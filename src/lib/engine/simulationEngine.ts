// MahaFlow — Synthetic Simulation Engine
// Generates realistic mobility behavior with time-of-day patterns

import { NetworkNode, initialNodes } from "../data/nodes";
import { NetworkRoute, initialRoutes } from "../data/routes";
import { evaluateFuzzy, FuzzyInputs, FuzzyResult } from "./fuzzyEngine";

export interface SimulationState {
  nodes: NetworkNode[];
  routes: NetworkRoute[];
  timeOfDay: number; // 0-23 hours
  timeLabel: string;
  eventIntensity: number; // 0-100
  weatherImpact: number; // 0-100
  totalPilgrims: number;
  activeRouteCount: number;
  avgParkingUtilization: number;
  congestionIndex: number;
  criticalZoneCount: number;
  systemHealthy: boolean;
  tickCount: number;
  alerts: AlertEntry[];
  routeRiskResults: Map<string, FuzzyResult>;
}

export interface AlertEntry {
  id: string;
  message: string;
  messageHi: string;
  messageMr: string;
  severity: "info" | "warning" | "critical";
  timestamp: number;
}

// Time-of-day profile multipliers for crowd density
function getTimeProfile(hour: number): number {
  // Morning influx 5-9am, peak 9-14, afternoon moderate, evening ebb
  if (hour >= 4 && hour < 6) return 0.3;
  if (hour >= 6 && hour < 8) return 0.55;
  if (hour >= 8 && hour < 10) return 0.8;
  if (hour >= 10 && hour < 14) return 1.0; // peak
  if (hour >= 14 && hour < 16) return 0.85;
  if (hour >= 16 && hour < 18) return 0.7;
  if (hour >= 18 && hour < 20) return 0.5;
  if (hour >= 20 && hour < 22) return 0.35;
  return 0.2; // night
}

function getTimeLabel(hour: number): string {
  const period = hour >= 5 && hour < 12 ? "AM" : hour >= 12 && hour < 17 ? "PM" : hour >= 17 && hour < 21 ? "EVE" : "NIGHT";
  const h = hour % 12 || 12;
  return `${h}:00 ${period}`;
}

// Random variation with smoothing
function jitter(base: number, range: number): number {
  return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * range));
}

// Event patterns — occasional surges
function getEventIntensity(tick: number): number {
  // Simulate periodic events every ~40 ticks (200 seconds at 5s interval)
  const cycle = Math.sin((tick / 40) * Math.PI * 2);
  const surge = Math.max(0, cycle) * 60;
  const base = 20 + Math.random() * 15;
  return Math.min(100, base + surge);
}

function getWeatherImpact(tick: number): number {
  // Mostly calm, occasional bad weather
  const cycle = Math.sin((tick / 80) * Math.PI * 2 + 1.5);
  if (cycle > 0.7) return 40 + Math.random() * 40; // bad weather
  return 5 + Math.random() * 15; // calm
}

export function createInitialState(): SimulationState {
  const nodes = JSON.parse(JSON.stringify(initialNodes)) as NetworkNode[];
  const routes = JSON.parse(JSON.stringify(initialRoutes)) as NetworkRoute[];

  return {
    nodes,
    routes,
    timeOfDay: 9,
    timeLabel: "9:00 AM",
    eventIntensity: 30,
    weatherImpact: 10,
    totalPilgrims: 0,
    activeRouteCount: routes.length,
    avgParkingUtilization: 0,
    congestionIndex: 0,
    criticalZoneCount: 0,
    systemHealthy: true,
    tickCount: 0,
    alerts: [],
    routeRiskResults: new Map(),
  };
}

export function simulateTick(prev: SimulationState): SimulationState {
  const tick = prev.tickCount + 1;

  // Advance time (1 tick ≈ 10 minutes in simulation)
  const hour = (9 + Math.floor(tick / 6)) % 24;
  const timeProfile = getTimeProfile(hour);
  const eventIntensity = getEventIntensity(tick);
  const weatherImpact = getWeatherImpact(tick);

  // Update nodes
  const nodes = prev.nodes.map((node) => {
    const loadFactor = timeProfile * (0.7 + Math.random() * 0.6);
    let newLoad: number;

    switch (node.type) {
      case "sacred":
        newLoad = Math.round(node.capacity * loadFactor * (0.5 + (eventIntensity / 100) * 0.5));
        break;
      case "parking":
        // Parking saturates during peak
        newLoad = Math.round(
          node.capacity * Math.min(1, loadFactor * (0.4 + (eventIntensity / 200)))
        );
        break;
      case "transit":
        newLoad = Math.round(node.capacity * loadFactor * 0.65);
        break;
      case "camp":
        newLoad = Math.round(node.capacity * (0.5 + timeProfile * 0.4) * (0.8 + Math.random() * 0.4));
        break;
      default:
        newLoad = Math.round(node.capacity * loadFactor * 0.3);
    }

    return { ...node, currentLoad: Math.min(node.capacity, Math.max(0, newLoad)) };
  });

  // Calculate parking utilization for fuzzy input
  const parkingNodes = nodes.filter((n) => n.type === "parking");
  const avgParkingOccupancy =
    parkingNodes.reduce((sum, n) => sum + (n.currentLoad / n.capacity) * 100, 0) /
    parkingNodes.length;

  // Update routes with fuzzy logic
  const routeRiskResults = new Map<string, FuzzyResult>();
  const routes = prev.routes.map((route) => {
    const crowdDensity = jitter(
      timeProfile * 70 + (eventIntensity / 100) * 20,
      15
    );
    const vehicleDensity = jitter(
      route.supportedTransportModes.includes("private")
        ? timeProfile * 55 + 15
        : timeProfile * 25 + 5,
      12
    );

    // Evaluate fuzzy logic for this route
    const fuzzyInputs: FuzzyInputs = {
      crowdDensity,
      vehicleDensity,
      parkingOccupancy: avgParkingOccupancy,
      eventIntensity,
      weatherImpact,
    };
    const result = evaluateFuzzy(fuzzyInputs);
    routeRiskResults.set(route.id, result);

    return {
      ...route,
      crowdDensity: Math.round(crowdDensity),
      vehicleDensity: Math.round(vehicleDensity),
      riskScore: result.score,
    };
  });

  // Calculate aggregate metrics
  const totalPilgrims = nodes.reduce((sum, n) => sum + n.currentLoad, 0);
  const activeRouteCount = routes.filter((r) => r.riskScore < 90).length;
  const congestionIndex = Math.round(
    routes.reduce((sum, r) => sum + r.riskScore, 0) / routes.length
  );
  const criticalZoneCount = routes.filter((r) => r.riskScore >= 80).length;
  const systemHealthy = criticalZoneCount <= 3;

  // Generate alerts
  const newAlerts: AlertEntry[] = [];
  const criticalRoutes = routes.filter((r) => r.riskScore >= 80);
  if (criticalRoutes.length > 0 && tick % 3 === 0) {
    const r = criticalRoutes[0];
    const startNode = nodes.find((n) => n.id === r.startNode);
    const endNode = nodes.find((n) => n.id === r.endNode);
    newAlerts.push({
      id: `alert-${tick}-${r.id}`,
      message: `Critical congestion on ${r.id}: ${startNode?.name} → ${endNode?.name} (Risk: ${r.riskScore}%)`,
      messageHi: `${r.id} पर गंभीर भीड़: ${startNode?.nameHi} → ${endNode?.nameHi} (जोखिम: ${r.riskScore}%)`,
      messageMr: `${r.id} वर गंभीर गर्दी: ${startNode?.nameMr} → ${endNode?.nameMr} (जोखीम: ${r.riskScore}%)`,
      severity: "critical",
      timestamp: Date.now(),
    });
  }

  const highParkingNodes = parkingNodes.filter(
    (n) => n.currentLoad / n.capacity > 0.85
  );
  if (highParkingNodes.length > 0 && tick % 5 === 0) {
    const p = highParkingNodes[0];
    newAlerts.push({
      id: `alert-${tick}-${p.id}`,
      message: `${p.name} approaching capacity (${Math.round((p.currentLoad / p.capacity) * 100)}%)`,
      messageHi: `${p.nameHi} क्षमता के करीब (${Math.round((p.currentLoad / p.capacity) * 100)}%)`,
      messageMr: `${p.nameMr} क्षमतेच्या जवळ (${Math.round((p.currentLoad / p.capacity) * 100)}%)`,
      severity: "warning",
      timestamp: Date.now(),
    });
  }

  // Keep only last 8 alerts
  const alerts = [...newAlerts, ...prev.alerts].slice(0, 8);

  return {
    nodes,
    routes,
    timeOfDay: hour,
    timeLabel: getTimeLabel(hour),
    eventIntensity: Math.round(eventIntensity),
    weatherImpact: Math.round(weatherImpact),
    totalPilgrims,
    activeRouteCount,
    avgParkingUtilization: Math.round(avgParkingOccupancy),
    congestionIndex,
    criticalZoneCount,
    systemHealthy,
    tickCount: tick,
    alerts,
    routeRiskResults,
  };
}
