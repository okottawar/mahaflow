"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  accent?: boolean;
  trend?: "up" | "down" | "stable";
  size?: "default" | "hero";
}

export default function StatCard({ label, value, subtitle, icon, accent, trend, size = "default" }: StatCardProps) {
  return (
    <div className={`stat-card ${accent ? "stat-card-accent" : ""} ${size === "hero" ? "stat-card-hero" : ""}`}>
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">
        {value}
        {trend && (
          <span className={`stat-trend stat-trend-${trend}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  );
}
