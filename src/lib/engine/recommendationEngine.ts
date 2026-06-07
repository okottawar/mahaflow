// MahaFlow — Recommendation Engine
// Transport-aware pathfinding with weighted graph traversal

import { NetworkNode } from "../data/nodes";
import { NetworkRoute, TransportMode } from "../data/routes";
import { Language } from "../data/translations";

export interface RouteResult {
  path: string[]; // node IDs in order
  pathNames: string[];
  routeIds: string[];
  totalDistance: number;
  estimatedTime: number; // minutes
  avgRiskScore: number;
  maxRiskScore: number;
}

export interface AdvisorResult {
  recommended: RouteResult | null;
  alternative: RouteResult | null;
  transportMode: TransportMode;
  reasoning: string[];
  reasoningHi: string[];
  reasoningMr: string[];
}

// Build adjacency list from routes
interface Edge {
  route: NetworkRoute;
  target: string;
  weight: number;
}

function buildGraph(
  routes: NetworkRoute[],
  mode: TransportMode
): Map<string, Edge[]> {
  const graph = new Map<string, Edge[]>();

  for (const route of routes) {
    if (!route.supportedTransportModes.includes(mode)) continue;

    // Calculate weight based on transport mode priorities
    let weight: number;
    switch (mode) {
      case "walking":
        // Prioritize lower crowd density and safety
        weight = route.crowdDensity * 2 + route.riskScore + route.baseTime;
        break;
      case "shuttle":
        // Prioritize route congestion
        weight = route.riskScore * 2 + route.vehicleDensity + route.baseTime * 0.5;
        break;
      case "bus":
        // Balance between time and congestion
        weight = route.riskScore + route.vehicleDensity + route.baseTime;
        break;
      case "private":
        // Prioritize parking availability and traffic load
        weight = route.vehicleDensity * 2.5 + route.riskScore + route.baseTime * 0.5;
        break;
      case "emergency":
        // Prioritize lowest congestion and fastest clearance
        weight = route.riskScore * 3 + route.crowdDensity * 2 + route.vehicleDensity;
        break;
    }

    // Bidirectional edges
    if (!graph.has(route.startNode)) graph.set(route.startNode, []);
    if (!graph.has(route.endNode)) graph.set(route.endNode, []);

    graph.get(route.startNode)!.push({ route, target: route.endNode, weight });
    graph.get(route.endNode)!.push({ route, target: route.startNode, weight });
  }

  return graph;
}

// Dijkstra's algorithm
function dijkstra(
  graph: Map<string, Edge[]>,
  start: string,
  end: string,
  excludeRoutes: Set<string> = new Set()
): { path: string[]; edges: NetworkRoute[] } | null {
  const distances = new Map<string, number>();
  const previous = new Map<string, { node: string; route: NetworkRoute } | null>();
  const visited = new Set<string>();

  // Initialize
  for (const node of graph.keys()) {
    distances.set(node, Infinity);
    previous.set(node, null);
  }
  distances.set(start, 0);

  while (true) {
    // Find minimum distance unvisited node
    let minNode: string | null = null;
    let minDist = Infinity;

    for (const [node, dist] of distances) {
      if (!visited.has(node) && dist < minDist) {
        minDist = dist;
        minNode = node;
      }
    }

    if (minNode === null || minNode === end) break;
    visited.add(minNode);

    const edges = graph.get(minNode) || [];
    for (const edge of edges) {
      if (visited.has(edge.target) || excludeRoutes.has(edge.route.id)) continue;

      const newDist = minDist + edge.weight;
      if (newDist < (distances.get(edge.target) ?? Infinity)) {
        distances.set(edge.target, newDist);
        previous.set(edge.target, { node: minNode, route: edge.route });
      }
    }
  }

  // Reconstruct path
  if (!previous.has(end) || (distances.get(end) ?? Infinity) === Infinity) {
    return null;
  }

  const path: string[] = [];
  const edges: NetworkRoute[] = [];
  let current: string | undefined = end;

  while (current) {
    path.unshift(current);
    const prev = previous.get(current);
    if (prev) {
      edges.unshift(prev.route);
      current = prev.node;
    } else {
      break;
    }
  }

  return { path, edges };
}

function buildRouteResult(
  pathData: { path: string[]; edges: NetworkRoute[] },
  nodes: NetworkNode[],
  mode: TransportMode,
  lang: Language
): RouteResult {
  const nameKey = lang === "hi" ? "nameHi" : lang === "mr" ? "nameMr" : "name";

  return {
    path: pathData.path,
    pathNames: pathData.path.map(
      (id) => nodes.find((n) => n.id === id)?.[nameKey] ?? id
    ),
    routeIds: pathData.edges.map((r) => r.id),
    totalDistance: Math.round(pathData.edges.reduce((s, r) => s + r.distance, 0) * 10) / 10,
    estimatedTime: Math.round(
      pathData.edges.reduce((s, r) => {
        // Adjust time based on transport mode and current conditions
        const congestionFactor = 1 + (r.riskScore / 100) * 0.5;
        switch (mode) {
          case "walking":
            return s + r.baseTime * 1.5 * congestionFactor;
          case "shuttle":
            return s + r.baseTime * 0.7 * congestionFactor;
          case "bus":
            return s + r.baseTime * 0.8 * congestionFactor;
          case "private":
            return s + r.baseTime * 0.6 * congestionFactor;
          case "emergency":
            return s + r.baseTime * 0.4;
          default:
            return s + r.baseTime;
        }
      }, 0)
    ),
    avgRiskScore: Math.round(
      pathData.edges.reduce((s, r) => s + r.riskScore, 0) / pathData.edges.length
    ),
    maxRiskScore: Math.max(...pathData.edges.map((r) => r.riskScore)),
  };
}

export function findRoute(
  origin: string,
  destination: string,
  mode: TransportMode,
  nodes: NetworkNode[],
  routes: NetworkRoute[],
  lang: Language = "en"
): AdvisorResult {
  const graph = buildGraph(routes, mode);

  // Find primary route
  const primary = dijkstra(graph, origin, destination);

  // Find alternative by excluding primary route edges
  let alternative: { path: string[]; edges: NetworkRoute[] } | null = null;
  if (primary) {
    const excludeSet = new Set(primary.edges.map((r) => r.id));
    alternative = dijkstra(graph, origin, destination, excludeSet);
  }

  const recommended = primary ? buildRouteResult(primary, nodes, mode, lang) : null;
  const altResult = alternative ? buildRouteResult(alternative, nodes, mode, lang) : null;

  // Generate reasoning
  const reasoning: string[] = [];
  const reasoningHi: string[] = [];
  const reasoningMr: string[] = [];

  if (recommended) {
    switch (mode) {
      case "walking":
        reasoning.push(`Pedestrian route optimized for lower crowd density`);
        reasoning.push(`Average crowd exposure: ${recommended.avgRiskScore}% risk`);
        reasoningHi.push(`कम भीड़ घनत्व के लिए पैदल मार्ग अनुकूलित`);
        reasoningHi.push(`औसत भीड़ जोखिम: ${recommended.avgRiskScore}%`);
        reasoningMr.push(`कमी गर्दीसाठी पादचारी मार्ग अनुकूलित`);
        reasoningMr.push(`सरासरी गर्दी जोखीम: ${recommended.avgRiskScore}%`);
        break;
      case "shuttle":
        reasoning.push(`Shuttle route avoiding congested corridors`);
        reasoning.push(`Route congestion index: ${recommended.avgRiskScore}%`);
        reasoningHi.push(`भीड़भाड़ वाले गलियारों से बचते हुए शटल मार्ग`);
        reasoningHi.push(`मार्ग भीड़ सूचकांक: ${recommended.avgRiskScore}%`);
        reasoningMr.push(`गर्दीच्या मार्गांना टाळून शटल मार्ग`);
        reasoningMr.push(`मार्ग गर्दी निर्देशांक: ${recommended.avgRiskScore}%`);
        break;
      case "private":
        reasoning.push(`Route optimized for parking availability and traffic`);
        reasoning.push(`Peak vehicle density on route: ${recommended.maxRiskScore}%`);
        reasoningHi.push(`पार्किंग उपलब्धता और ट्रैफिक के लिए अनुकूलित मार्ग`);
        reasoningHi.push(`मार्ग पर अधिकतम वाहन घनत्व: ${recommended.maxRiskScore}%`);
        reasoningMr.push(`पार्किंग उपलब्धता आणि वाहतुकीसाठी अनुकूलित मार्ग`);
        reasoningMr.push(`मार्गावरील कमाल वाहन घनता: ${recommended.maxRiskScore}%`);
        break;
      case "emergency":
        reasoning.push(`Emergency corridor with minimum congestion`);
        reasoning.push(`Fastest clearance time: ${recommended.estimatedTime} min`);
        reasoningHi.push(`न्यूनतम भीड़ के साथ आपातकालीन गलियारा`);
        reasoningHi.push(`सबसे तेज़ निकासी समय: ${recommended.estimatedTime} मिनट`);
        reasoningMr.push(`किमान गर्दीसह आपत्कालीन मार्ग`);
        reasoningMr.push(`सर्वात जलद मार्ग: ${recommended.estimatedTime} मिनिटे`);
        break;
      default:
        reasoning.push(`Route selected for optimal travel conditions`);
        reasoningHi.push(`इष्टतम यात्रा स्थितियों के लिए चयनित मार्ग`);
        reasoningMr.push(`इष्टतम प्रवास परिस्थितींसाठी निवडलेला मार्ग`);
    }
    reasoning.push(`Via: ${recommended.pathNames.join(" → ")}`);
    reasoningHi.push(`मार्ग: ${recommended.pathNames.join(" → ")}`);
    reasoningMr.push(`मार्ग: ${recommended.pathNames.join(" → ")}`);
  } else {
    reasoning.push(`No viable route found for ${mode} between selected points`);
    reasoningHi.push(`चयनित बिंदुओं के बीच ${mode} के लिए कोई व्यवहार्य मार्ग नहीं मिला`);
    reasoningMr.push(`निवडलेल्या बिंदूंमध्ये ${mode} साठी कोणताही व्यवहार्य मार्ग सापडला नाही`);
  }

  return {
    recommended,
    alternative: altResult,
    transportMode: mode,
    reasoning,
    reasoningHi,
    reasoningMr,
  };
}
