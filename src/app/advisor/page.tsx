"use client";

import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import NetworkGraph from "@/components/NetworkGraph";
import RiskBadge from "@/components/RiskBadge";
import { useSimulation } from "@/context/SimulationContext";
import { TransportMode } from "@/lib/data/routes";
import { findRoute, AdvisorResult } from "@/lib/engine/recommendationEngine";
import { CongestionCategory } from "@/lib/data/fuzzyRules";

const transportModes: { mode: TransportMode; icon: string; key: string }[] = [
  { mode: "walking", icon: "🚶", key: "modeWalking" },
  { mode: "shuttle", icon: "🚐", key: "modeShuffle" },
  { mode: "bus", icon: "🚌", key: "modeBus" },
  { mode: "private", icon: "🚗", key: "modePrivate" },
  { mode: "emergency", icon: "🚑", key: "modeEmergency" },
];

export default function AdvisorPage() {
  const { state, t, language } = useSimulation();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState<TransportMode>("walking");
  const [result, setResult] = useState<AdvisorResult | null>(null);

  const nameKey = language === "hi" ? "nameHi" : language === "mr" ? "nameMr" : "name";

  const handleSearch = () => {
    if (!origin || !destination || origin === destination) return;
    const r = findRoute(origin, destination, mode, state.nodes, state.routes, language);
    setResult(r);
  };

  const highlightRouteIds = useMemo(() => {
    if (!result?.recommended) return [];
    const ids = [...result.recommended.routeIds];
    if (result.alternative) ids.push(...result.alternative.routeIds);
    return ids;
  }, [result]);

  const reasoning = language === "hi" ? result?.reasoningHi : language === "mr" ? result?.reasoningMr : result?.reasoning;

  return (
    <Layout>
      <div className="page-advisor">
        <div className="page-header">
          <h2 className="page-title">{t.navAdvisor}</h2>
        </div>

        <div className="advisor-layout">
          {/* Controls Panel */}
          <div className="card advisor-controls">
            {/* Transport Mode Selector */}
            <div className="advisor-section">
              <label className="advisor-label">{t.selectTransport}</label>
              <div className="transport-mode-grid">
                {transportModes.map((tm) => (
                  <button
                    key={tm.mode}
                    onClick={() => setMode(tm.mode)}
                    className={`transport-mode-btn ${mode === tm.mode ? "transport-mode-active" : ""}`}
                  >
                    <span className="transport-mode-icon">{tm.icon}</span>
                    <span className="transport-mode-label">
                      {t[tm.key as keyof typeof t]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Origin / Destination */}
            <div className="advisor-section">
              <label className="advisor-label">{t.selectOrigin}</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="advisor-select"
              >
                <option value="">{t.selectOrigin}</option>
                {state.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.icon} {n[nameKey]}
                  </option>
                ))}
              </select>
            </div>

            <div className="advisor-section">
              <label className="advisor-label">{t.selectDestination}</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="advisor-select"
              >
                <option value="">{t.selectDestination}</option>
                {state.nodes
                  .filter((n) => n.id !== origin)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.icon} {n[nameKey]}
                    </option>
                  ))}
              </select>
            </div>

            <button onClick={handleSearch} className="advisor-search-btn" disabled={!origin || !destination}>
              {t.findRoute}
            </button>
          </div>

          {/* Results Panel */}
          <div className="advisor-results">
            {result ? (
              <>
                {/* Recommended Route */}
                {result.recommended ? (
                  <div className="card route-result-card route-result-primary">
                    <h3 className="route-result-title">{t.recommendedRoute}</h3>
                    <div className="route-result-path">
                      {result.recommended.pathNames.join(" → ")}
                    </div>
                    <div className="route-result-stats">
                      <div className="route-stat">
                        <span className="route-stat-label">{t.estimatedTime}</span>
                        <span className="route-stat-value">
                          {result.recommended.estimatedTime} {t.minutes}
                        </span>
                      </div>
                      <div className="route-stat">
                        <span className="route-stat-label">{t.riskScore}</span>
                        <RiskBadge
                          level={
                            (result.recommended.avgRiskScore >= 80
                              ? "CRITICAL"
                              : result.recommended.avgRiskScore >= 60
                                ? "HIGH"
                                : result.recommended.avgRiskScore >= 35
                                  ? "MEDIUM"
                                  : "LOW") as CongestionCategory
                          }
                          score={result.recommended.avgRiskScore}
                          size="sm"
                        />
                      </div>
                      <div className="route-stat">
                        <span className="route-stat-label">Distance</span>
                        <span className="route-stat-value">{result.recommended.totalDistance} km</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card route-result-card route-no-result">
                    <p>{t.noRouteFound}</p>
                  </div>
                )}

                {/* Alternative Route */}
                {result.alternative && (
                  <div className="card route-result-card route-result-alt">
                    <h3 className="route-result-title">{t.alternativeRoute}</h3>
                    <div className="route-result-path">
                      {result.alternative.pathNames.join(" → ")}
                    </div>
                    <div className="route-result-stats">
                      <div className="route-stat">
                        <span className="route-stat-label">{t.estimatedTime}</span>
                        <span className="route-stat-value">
                          {result.alternative.estimatedTime} {t.minutes}
                        </span>
                      </div>
                      <div className="route-stat">
                        <span className="route-stat-label">{t.riskScore}</span>
                        <RiskBadge
                          level={
                            (result.alternative.avgRiskScore >= 80
                              ? "CRITICAL"
                              : result.alternative.avgRiskScore >= 60
                                ? "HIGH"
                                : result.alternative.avgRiskScore >= 35
                                  ? "MEDIUM"
                                  : "LOW") as CongestionCategory
                          }
                          score={result.alternative.avgRiskScore}
                          size="sm"
                        />
                      </div>
                      <div className="route-stat">
                        <span className="route-stat-label">Distance</span>
                        <span className="route-stat-value">{result.alternative.totalDistance} km</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reasoning */}
                <div className="card advisor-reasoning">
                  <h3 className="card-title">{t.reasoning}</h3>
                  <ul className="reasoning-list">
                    {reasoning?.map((r, i) => (
                      <li key={i} className="reasoning-item">{r}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="advisor-placeholder">
                <div className="advisor-placeholder-icon">⇢</div>
                <p>{t.selectOrigin}, {t.selectDestination}, & {t.selectTransport}</p>
              </div>
            )}
          </div>
        </div>

        {/* Map with highlighted routes */}
        {result?.recommended && (
          <div className="advisor-map">
            <NetworkGraph highlightRouteIds={highlightRouteIds} />
          </div>
        )}
      </div>
    </Layout>
  );
}
