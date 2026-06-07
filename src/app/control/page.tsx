"use client";

import React from "react";
import Layout from "@/components/Layout";
import RiskBadge from "@/components/RiskBadge";
import ExplainPanel from "@/components/ExplainPanel";
import { useSimulation } from "@/context/SimulationContext";
import { CongestionCategory } from "@/lib/data/fuzzyRules";

export default function ControlRoomPage() {
  const { state, t, language } = useSimulation();
  const nameKey = language === "hi" ? "nameHi" : language === "mr" ? "nameMr" : "name";

  // Critical routes (risk >= 60)
  const criticalRoutes = [...state.routes]
    .filter((r) => r.riskScore >= 60)
    .sort((a, b) => b.riskScore - a.riskScore);

  // Parking nodes
  const parkingNodes = state.nodes.filter((n) => n.type === "parking");

  // Zone health — all non-parking/non-emergency nodes
  const zoneNodes = state.nodes.filter(
    (n) => n.type !== "parking" && n.type !== "emergency"
  );

  // Risk distribution
  const riskDist = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  state.routes.forEach((r) => {
    if (r.riskScore >= 80) riskDist.CRITICAL++;
    else if (r.riskScore >= 60) riskDist.HIGH++;
    else if (r.riskScore >= 35) riskDist.MEDIUM++;
    else riskDist.LOW++;
  });

  // Collect unique recommendations from high-risk routes
  const recommendations: { text: string; priority: CongestionCategory; routeId: string }[] = [];
  criticalRoutes.forEach((r) => {
    const result = state.routeRiskResults.get(r.id);
    if (result) {
      const recText =
        language === "hi"
          ? result.topRecommendationHi
          : language === "mr"
            ? result.topRecommendationMr
            : result.topRecommendation;

      if (!recommendations.find((rec) => rec.text === recText)) {
        recommendations.push({
          text: recText,
          priority: result.category,
          routeId: r.id,
        });
      }
    }
  });

  // Get the highest risk route for detailed explain panel
  const highestRiskRoute = criticalRoutes[0];
  const highestRiskResult = highestRiskRoute
    ? state.routeRiskResults.get(highestRiskRoute.id)
    : null;

  return (
    <Layout>
      <div className="page-control">
        <div className="page-header">
          <h2 className="page-title">{t.navControl}</h2>
          <div className="page-header-meta">
            <span className="page-time">{state.timeLabel}</span>
            <span className={`system-badge ${state.systemHealthy ? "system-healthy" : "system-degraded"}`}>
              {state.systemHealthy ? t.operational : t.degraded}
            </span>
          </div>
        </div>

        <div className="control-grid">
          {/* Critical Routes */}
          <div className="card control-critical">
            <h3 className="card-title">{t.criticalRoutes}</h3>
            {criticalRoutes.length === 0 ? (
              <p className="control-empty">No critical routes at this time.</p>
            ) : (
              <div className="critical-routes-list">
                {criticalRoutes.slice(0, 6).map((route) => {
                  const startNode = state.nodes.find((n) => n.id === route.startNode);
                  const endNode = state.nodes.find((n) => n.id === route.endNode);
                  const category: CongestionCategory =
                    route.riskScore >= 80 ? "CRITICAL" : "HIGH";

                  return (
                    <div key={route.id} className="critical-route-item">
                      <div className="critical-route-header">
                        <span className="critical-route-id">{route.id}</span>
                        <RiskBadge level={category} score={route.riskScore} size="sm" />
                      </div>
                      <div className="critical-route-path">
                        {startNode?.[nameKey]} → {endNode?.[nameKey]}
                      </div>
                      <div className="critical-route-stats">
                        <span>👥 {route.crowdDensity}%</span>
                        <span>🚗 {route.vehicleDensity}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Parking Status */}
          <div className="card control-parking">
            <h3 className="card-title">{t.parkingStatus}</h3>
            <div className="parking-list">
              {parkingNodes.map((node) => {
                const utilization = Math.round(
                  (node.currentLoad / node.capacity) * 100
                );
                const category: CongestionCategory =
                  utilization >= 90
                    ? "CRITICAL"
                    : utilization >= 75
                      ? "HIGH"
                      : utilization >= 50
                        ? "MEDIUM"
                        : "LOW";

                return (
                  <div key={node.id} className="parking-item">
                    <div className="parking-item-header">
                      <span className="parking-name">{node[nameKey]}</span>
                      <RiskBadge level={category} size="sm" />
                    </div>
                    <div className="parking-bar-track">
                      <div
                        className={`parking-bar-fill parking-fill-${category.toLowerCase()}`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                    <div className="parking-stats">
                      <span>{node.currentLoad.toLocaleString()} / {node.capacity.toLocaleString()}</span>
                      <span className="parking-pct">{utilization}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zone Health */}
          <div className="card control-zones">
            <h3 className="card-title">{t.zoneHealth}</h3>
            <div className="zone-grid">
              {zoneNodes.map((node) => {
                const utilization = Math.round(
                  (node.currentLoad / node.capacity) * 100
                );
                const category: CongestionCategory =
                  utilization >= 85
                    ? "CRITICAL"
                    : utilization >= 70
                      ? "HIGH"
                      : utilization >= 45
                        ? "MEDIUM"
                        : "LOW";

                return (
                  <div key={node.id} className={`zone-tile zone-tile-${category.toLowerCase()}`}>
                    <span className="zone-icon">{node.icon}</span>
                    <span className="zone-name">{node[nameKey]}</span>
                    <span className="zone-util">{utilization}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Distribution Summary */}
          <div className="card control-risk-summary">
            <h3 className="card-title">{t.riskDistribution}</h3>
            <div className="risk-summary-grid">
              {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as CongestionCategory[]).map(
                (level) => (
                  <div key={level} className={`risk-summary-tile risk-summary-${level.toLowerCase()}`}>
                    <span className="risk-summary-count">{riskDist[level]}</span>
                    <RiskBadge level={level} size="sm" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Operational Recommendations */}
        <div className="card control-recommendations">
          <h3 className="card-title">{t.operationalRecommendations}</h3>
          {recommendations.length === 0 ? (
            <p className="control-empty">No operational recommendations at this time.</p>
          ) : (
            <div className="recommendations-list">
              {recommendations.slice(0, 5).map((rec, i) => (
                <div key={i} className="recommendation-item">
                  <div className="rec-priority">
                    <RiskBadge level={rec.priority} size="sm" />
                    <span className="rec-route">{rec.routeId}</span>
                  </div>
                  <p className="rec-text">{rec.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Explain Panel — Fuzzy Reasoning Showcase */}
        {highestRiskResult && highestRiskRoute && (
          <div className="card control-explain">
            <div className="control-explain-header">
              <h3 className="control-explain-label">Fuzzy Logic Analysis</h3>
              <span className="control-explain-subtitle">Explainable Decision Engine</span>
            </div>
            <ExplainPanel
              result={highestRiskResult}
              title={`${highestRiskRoute.id} — Highest Risk Corridor`}
              prominent
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
