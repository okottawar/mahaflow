"use client";

import { useSimulation } from "@/context/SimulationContext";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { CongestionCategory } from "@/lib/data/fuzzyRules";

export default function OverviewPage() {
  const { state, t, language } = useSimulation();

  // Compute risk distribution
  const riskDist = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  state.routes.forEach((r) => {
    if (r.riskScore >= 80) riskDist.CRITICAL++;
    else if (r.riskScore >= 60) riskDist.HIGH++;
    else if (r.riskScore >= 35) riskDist.MEDIUM++;
    else riskDist.LOW++;
  });

  const congestionCategory: CongestionCategory =
    state.congestionIndex >= 80
      ? "CRITICAL"
      : state.congestionIndex >= 60
        ? "HIGH"
        : state.congestionIndex >= 35
          ? "MEDIUM"
          : "LOW";

  // Recent alerts
  const alertMessages = state.alerts.map((a) =>
    language === "hi" ? a.messageHi : language === "mr" ? a.messageMr : a.message
  );

  return (
    <Layout>
      <div className="page-overview">
        <div className="page-header">
          <h2 className="page-title">{t.navOverview}</h2>
          <div className="page-header-meta">
            <span className="page-time">{state.timeLabel}</span>
          </div>
        </div>

        {/* Hero Metrics — Primary Visual Anchors */}
        <div className="hero-stat-grid">
          <StatCard
            icon="🙏"
            label={t.totalPilgrims}
            value={state.totalPilgrims.toLocaleString()}
            trend="up"
            size="hero"
          />
          <StatCard
            icon="📊"
            label={t.congestionIndex}
            value={`${state.congestionIndex}%`}
            accent={state.congestionIndex >= 60}
            size="hero"
          />
          <StatCard
            icon="🚨"
            label={t.criticalZones}
            value={state.criticalZoneCount}
            accent={state.criticalZoneCount > 0}
            size="hero"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="secondary-stat-grid">
          <StatCard
            icon="🛤️"
            label={t.activeRoutes}
            value={`${state.activeRouteCount} / ${state.routes.length}`}
          />
          <StatCard
            icon="🅿️"
            label={t.parkingUtilization}
            value={`${state.avgParkingUtilization}%`}
            subtitle={state.avgParkingUtilization > 80 ? "⚠ Near capacity" : ""}
            accent={state.avgParkingUtilization > 80}
          />
          <StatCard
            icon="✓"
            label={t.systemStatus}
            value={state.systemHealthy ? t.operational : t.degraded}
          />
        </div>

        {/* Bottom Section: Risk Distribution + Alerts */}
        <div className="overview-bottom">
          {/* Risk Distribution */}
          <div className="card overview-risk-dist">
            <h3 className="card-title">{t.riskDistribution}</h3>
            <div className="risk-dist-bars">
              {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as CongestionCategory[]).map((level) => {
                const count = riskDist[level];
                const pct = Math.round((count / state.routes.length) * 100);
                return (
                  <div key={level} className="risk-dist-row">
                    <RiskBadge level={level} size="sm" />
                    <div className="risk-dist-bar-track">
                      <div
                        className={`risk-dist-bar-fill risk-fill-${level.toLowerCase()}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="risk-dist-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card overview-alerts">
            <h3 className="card-title">{t.recentAlerts}</h3>
            <div className="alerts-list">
              {alertMessages.length === 0 ? (
                <p className="alerts-empty">No active alerts</p>
              ) : (
                alertMessages.map((msg, i) => (
                  <div
                    key={state.alerts[i]?.id ?? i}
                    className={`alert-item alert-${state.alerts[i]?.severity ?? "info"}`}
                  >
                    <span className="alert-severity-dot" />
                    <span className="alert-message">{msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Environment Conditions */}
        <div className="overview-env">
          <div className="card env-card">
            <div className="env-row">
              <span className="env-label">🌡 Event Intensity</span>
              <div className="env-bar-track">
                <div className="env-bar-fill" style={{ width: `${state.eventIntensity}%` }} />
              </div>
              <span className="env-value">{state.eventIntensity}%</span>
            </div>
            <div className="env-row">
              <span className="env-label">🌧 Weather Impact</span>
              <div className="env-bar-track">
                <div className="env-bar-fill env-bar-weather" style={{ width: `${state.weatherImpact}%` }} />
              </div>
              <span className="env-value">{state.weatherImpact}%</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
