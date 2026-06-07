"use client";

import React, { useState, useMemo } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { NetworkNode } from "@/lib/data/nodes";
import { NetworkRoute } from "@/lib/data/routes";
import ExplainPanel from "./ExplainPanel";

interface NetworkGraphProps {
  onNodeSelect?: (node: NetworkNode) => void;
  onRouteSelect?: (route: NetworkRoute) => void;
  highlightRouteIds?: string[];
}

function getRiskColor(score: number): string {
  if (score >= 80) return "var(--risk-critical)";
  if (score >= 60) return "var(--risk-high)";
  if (score >= 35) return "var(--risk-medium)";
  return "var(--risk-low)";
}

// Dramatic thickness differentiation for risk hierarchy
function getRiskStrokeWidth(score: number): number {
  if (score >= 80) return 6;     // Critical — very thick
  if (score >= 60) return 4.5;   // High — thick
  if (score >= 35) return 2.8;   // Medium — medium
  return 1.8;                     // Low — thin
}

// Major nodes (sacred, transit, interchange) visually dominate
function getNodeRadius(type: string, isSelected: boolean): number {
  const base = (() => {
    switch (type) {
      case "sacred": return 26;
      case "transit": return 22;
      case "interchange": return 21;
      case "emergency": return 19;
      case "medical": return 18;
      default: return 16; // parking, camp
    }
  })();
  return isSelected ? base + 6 : base;
}

function getNodeColor(type: string): string {
  switch (type) {
    case "sacred": return "#c94b2e";
    case "transit": return "#3a7ca5";
    case "parking": return "#6b8e23";
    case "camp": return "#b8860b";
    case "medical": return "#c94b2e";
    case "emergency": return "#d42020";
    case "interchange": return "#6a5acd";
    default: return "#7a7f8a";
  }
}

// Font size scales with node importance
function getNodeFontSize(type: string): number {
  switch (type) {
    case "sacred": return 18;
    case "transit": return 15;
    case "interchange": return 14;
    default: return 12;
  }
}

function getNodeLabelFontSize(type: string): string {
  switch (type) {
    case "sacred": return "12px";
    case "transit": return "11px";
    case "interchange": return "10.5px";
    default: return "9.5px";
  }
}

export default function NetworkGraph({ onNodeSelect, onRouteSelect, highlightRouteIds }: NetworkGraphProps) {
  const { state, language, t } = useSimulation();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NetworkNode>();
    state.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [state.nodes]);

  const nameKey = language === "hi" ? "nameHi" : language === "mr" ? "nameMr" : "name";

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
    setSelectedRoute(null);
    onNodeSelect?.(node);
  };

  const handleRouteClick = (route: NetworkRoute) => {
    setSelectedRoute(route.id === selectedRoute ? null : route.id);
    setSelectedNode(null);
    onRouteSelect?.(route);
  };

  const selectedRouteData = state.routes.find((r) => r.id === selectedRoute);
  const selectedRouteResult = selectedRoute ? state.routeRiskResults.get(selectedRoute) : null;
  const selectedNodeData = state.nodes.find((n) => n.id === selectedNode);

  // Calculate curved path between two nodes
  function getRoutePath(route: NetworkRoute): string {
    const start = nodeMap.get(route.startNode);
    const end = nodeMap.get(route.endNode);
    if (!start || !end) return "";

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const offsetScale = dist * 0.12;
    const nx = -dy / dist;
    const ny = dx / dist;

    const routeIdx = state.routes.indexOf(route);
    const dir = routeIdx % 2 === 0 ? 1 : -1;

    const cx = midX + nx * offsetScale * dir;
    const cy = midY + ny * offsetScale * dir;

    return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
  }

  return (
    <div className="network-graph-container">
      <div className="network-graph-svg-wrapper">
        <svg viewBox="0 0 1000 750" className="network-graph-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="criticalGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0d0f12" floodOpacity="0.1" />
            </filter>
            <filter id="majorNodeShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0d0f12" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Routes — rendered by risk level (low first, critical on top) */}
          {[...state.routes]
            .sort((a, b) => a.riskScore - b.riskScore)
            .map((route) => {
              const isHighlighted = highlightRouteIds?.includes(route.id);
              const isSelected = route.id === selectedRoute;
              const isHovered = route.id === hoveredRoute;
              const isCritical = route.riskScore >= 80;

              return (
                <g key={route.id}>
                  <path
                    d={getRoutePath(route)}
                    stroke={getRiskColor(route.riskScore)}
                    strokeWidth={
                      isHighlighted ? 7
                        : isSelected || isHovered ? 6
                          : getRiskStrokeWidth(route.riskScore)
                    }
                    fill="none"
                    strokeLinecap="round"
                    opacity={isHighlighted ? 1 : isSelected || isHovered ? 1 : isCritical ? 0.85 : 0.55}
                    filter={isCritical ? "url(#criticalGlow)" : isHighlighted || isSelected ? "url(#glow)" : undefined}
                    className={`network-route ${isCritical ? "network-route-critical" : ""}`}
                    onClick={() => handleRouteClick(route)}
                    onMouseEnter={() => setHoveredRoute(route.id)}
                    onMouseLeave={() => setHoveredRoute(null)}
                    style={{ cursor: "pointer" }}
                  />
                  {/* Route label on hover/select */}
                  {(isSelected || isHovered) && (
                    <text
                      x={(nodeMap.get(route.startNode)!.x + nodeMap.get(route.endNode)!.x) / 2}
                      y={(nodeMap.get(route.startNode)!.y + nodeMap.get(route.endNode)!.y) / 2 - 12}
                      textAnchor="middle"
                      className="network-route-label"
                      fill="var(--text-primary)"
                    >
                      {route.id} · {route.riskScore}%
                    </text>
                  )}
                </g>
              );
            })}

          {/* Nodes — major destinations rendered last (on top) */}
          {[...state.nodes]
            .sort((a, b) => {
              const order: Record<string, number> = { camp: 0, parking: 1, medical: 2, emergency: 3, interchange: 4, transit: 5, sacred: 6 };
              return (order[a.type] ?? 0) - (order[b.type] ?? 0);
            })
            .map((node) => {
              const isSelected = node.id === selectedNode;
              const utilization = (node.currentLoad / node.capacity) * 100;
              const radius = getNodeRadius(node.type, isSelected);
              const isMajor = node.type === "sacred" || node.type === "transit" || node.type === "interchange";

              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: "pointer" }}
                  className="network-node-group"
                >
                  {/* Outer ring — utilization indicator */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 5}
                    fill="none"
                    stroke={getRiskColor(utilization)}
                    strokeWidth={isMajor ? 2.5 : 1.5}
                    opacity={0.45}
                    strokeDasharray={`${(utilization / 100) * (Math.PI * 2 * (radius + 5))} ${Math.PI * 2 * (radius + 5)}`}
                  />
                  {/* Main node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={isSelected ? getNodeColor(node.type) : "#ffffff"}
                    stroke={getNodeColor(node.type)}
                    strokeWidth={isMajor ? 2.5 : 2}
                    filter={isMajor ? "url(#majorNodeShadow)" : "url(#nodeShadow)"}
                  />
                  {/* Node icon */}
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={getNodeFontSize(node.type)}
                    style={{ pointerEvents: "none" }}
                  >
                    {node.icon}
                  </text>
                  {/* Node name */}
                  <text
                    x={node.x}
                    y={node.y + radius + 16}
                    textAnchor="middle"
                    className="network-node-label"
                    fill="var(--text-primary)"
                    style={{
                      fontSize: getNodeLabelFontSize(node.type),
                      fontWeight: isMajor ? 600 : 400,
                    }}
                  >
                    {node[nameKey]}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Detail Panel */}
      <div className="network-detail-panel">
        {selectedRouteData && selectedRouteResult ? (
          <div className="detail-content">
            <div className="detail-route-id">{selectedRouteData.id}</div>
            <h3 className="detail-title">
              {nodeMap.get(selectedRouteData.startNode)?.[nameKey]} → {nodeMap.get(selectedRouteData.endNode)?.[nameKey]}
            </h3>
            <div className="detail-stats">
              <div className="detail-stat">
                <span className="detail-stat-label">{t.crowdDensity}</span>
                <span className="detail-stat-value">{selectedRouteData.crowdDensity}%</span>
              </div>
              <div className="detail-stat">
                <span className="detail-stat-label">{t.vehicleDensity}</span>
                <span className="detail-stat-value">{selectedRouteData.vehicleDensity}%</span>
              </div>
              <div className="detail-stat">
                <span className="detail-stat-label">{t.capacity}</span>
                <span className="detail-stat-value">{selectedRouteData.baseCapacity.toLocaleString()}</span>
              </div>
            </div>
            <div className="detail-modes">
              {selectedRouteData.supportedTransportModes.map((m) => (
                <span key={m} className="detail-mode-tag">{m}</span>
              ))}
            </div>
            <ExplainPanel result={selectedRouteResult} />
          </div>
        ) : selectedNodeData ? (
          <div className="detail-content">
            <h3 className="detail-title">
              {selectedNodeData.icon} {selectedNodeData[nameKey]}
            </h3>
            <div className="detail-stats">
              <div className="detail-stat">
                <span className="detail-stat-label">{t.capacity}</span>
                <span className="detail-stat-value">{selectedNodeData.capacity.toLocaleString()}</span>
              </div>
              <div className="detail-stat">
                <span className="detail-stat-label">{t.currentLoad}</span>
                <span className="detail-stat-value">{selectedNodeData.currentLoad.toLocaleString()}</span>
              </div>
              <div className="detail-stat">
                <span className="detail-stat-label">Utilization</span>
                <span className="detail-stat-value">
                  {Math.round((selectedNodeData.currentLoad / selectedNodeData.capacity) * 100)}%
                </span>
              </div>
            </div>
            <div className="detail-utilization-bar">
              <div
                className="detail-utilization-fill"
                style={{
                  width: `${Math.min(100, (selectedNodeData.currentLoad / selectedNodeData.capacity) * 100)}%`,
                  backgroundColor: getRiskColor(
                    (selectedNodeData.currentLoad / selectedNodeData.capacity) * 100
                  ),
                }}
              />
            </div>
          </div>
        ) : (
          <div className="detail-placeholder">
            <div className="detail-placeholder-icon">◎</div>
            <p>{t.clickForDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
