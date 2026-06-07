"use client";

import React from "react";
import { CongestionCategory } from "@/lib/data/fuzzyRules";
import { useSimulation } from "@/context/SimulationContext";

interface RiskBadgeProps {
  level: CongestionCategory;
  score?: number;
  size?: "sm" | "md" | "lg";
}

export default function RiskBadge({ level, score, size = "md" }: RiskBadgeProps) {
  const { t } = useSimulation();

  const labelMap: Record<CongestionCategory, string> = {
    LOW: t.riskLow,
    MEDIUM: t.riskMedium,
    HIGH: t.riskHigh,
    CRITICAL: t.riskCritical,
  };

  return (
    <span className={`risk-badge risk-badge-${level.toLowerCase()} risk-badge-${size}`}>
      <span className="risk-badge-dot" />
      {labelMap[level]}
      {score !== undefined && <span className="risk-badge-score">{score}%</span>}
    </span>
  );
}
