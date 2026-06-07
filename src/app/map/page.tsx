"use client";

import Layout from "@/components/Layout";
import NetworkGraph from "@/components/NetworkGraph";
import { useSimulation } from "@/context/SimulationContext";
import RiskBadge from "@/components/RiskBadge";
import { CongestionCategory } from "@/lib/data/fuzzyRules";

export default function MapPage() {
  const { t } = useSimulation();

  return (
    <Layout>
      <div className="page-map">
        <div className="page-header">
          <h2 className="page-title">{t.networkMap}</h2>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <span className="map-legend-title">{t.mapLegend}:</span>
          <div className="map-legend-items">
            <span className="legend-item">
              <span className="legend-line legend-line-low" />
              {t.riskLow}
            </span>
            <span className="legend-item">
              <span className="legend-line legend-line-medium" />
              {t.riskMedium}
            </span>
            <span className="legend-item">
              <span className="legend-line legend-line-high" />
              {t.riskHigh}
            </span>
            <span className="legend-item">
              <span className="legend-line legend-line-critical" />
              {t.riskCritical}
            </span>
          </div>
          <div className="map-legend-items map-legend-nodes">
            <span className="legend-item"><span className="legend-node" style={{ backgroundColor: "#c94b2e" }} /> Sacred</span>
            <span className="legend-item"><span className="legend-node" style={{ backgroundColor: "#3a7ca5" }} /> Transit</span>
            <span className="legend-item"><span className="legend-node" style={{ backgroundColor: "#6b8e23" }} /> Parking</span>
            <span className="legend-item"><span className="legend-node" style={{ backgroundColor: "#b8860b" }} /> Camp</span>
            <span className="legend-item"><span className="legend-node" style={{ backgroundColor: "#d42020" }} /> Emergency</span>
          </div>
        </div>

        {/* Network Graph */}
        <NetworkGraph />

        {/* Routes Overview Table */}
        <div className="card map-routes-table">
          <h3 className="card-title">Route Status Summary</h3>
          <div className="routes-table-wrapper">
            <table className="routes-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>{t.crowdDensity}</th>
                  <th>{t.vehicleDensity}</th>
                  <th>{t.riskScore}</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <RoutesTableBody />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function RoutesTableBody() {
  const { state } = useSimulation();

  const sortedRoutes = [...state.routes].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <>
      {sortedRoutes.map((route) => {
        const category: CongestionCategory =
          route.riskScore >= 80
            ? "CRITICAL"
            : route.riskScore >= 60
              ? "HIGH"
              : route.riskScore >= 35
                ? "MEDIUM"
                : "LOW";

        return (
          <tr key={route.id}>
            <td className="route-id-cell">{route.id}</td>
            <td>{route.crowdDensity}%</td>
            <td>{route.vehicleDensity}%</td>
            <td className="route-score-cell">{route.riskScore}%</td>
            <td><RiskBadge level={category} size="sm" /></td>
          </tr>
        );
      })}
    </>
  );
}
