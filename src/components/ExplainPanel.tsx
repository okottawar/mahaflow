"use client";

import React from "react";
import { FuzzyResult } from "@/lib/engine/fuzzyEngine";
import { useSimulation } from "@/context/SimulationContext";
import RiskBadge from "./RiskBadge";

interface ExplainPanelProps {
  result: FuzzyResult;
  title?: string;
  prominent?: boolean;
}

export default function ExplainPanel({ result, title, prominent }: ExplainPanelProps) {
  const { t, language } = useSimulation();

  const recommendation =
    language === "hi"
      ? result.topRecommendationHi
      : language === "mr"
        ? result.topRecommendationMr
        : result.topRecommendation;

  const variableLabels: Record<string, string> = {
    crowdDensity: t.crowdDensity,
    vehicleDensity: t.vehicleDensity,
    parkingOccupancy: t.parkingUtilization,
    eventIntensity: "Event Intensity",
    weatherImpact: "Weather Impact",
  };

  return (
    <div className={`explain-panel ${prominent ? "explain-panel-prominent" : ""}`}>
      {title && <h3 className="explain-title">{title}</h3>}

      {/* Congestion Score — Hero display when prominent */}
      <div className={`explain-score-block ${prominent ? "explain-score-prominent" : ""}`}>
        <div className="explain-score-hero">
          <span className="explain-score-number">{result.score}</span>
          <span className="explain-score-percent">%</span>
        </div>
        <div className="explain-score-meta">
          <span className="explain-label">{t.congestionRisk}</span>
          <RiskBadge level={result.category} score={result.score} size={prominent ? "lg" : "sm"} />
        </div>
        <div className="explain-score-bar-container">
          <div
            className="explain-score-bar"
            style={{ width: `${result.score}%` }}
            data-category={result.category.toLowerCase()}
          />
        </div>
      </div>

      {/* Triggered Rules */}
      {result.triggeredRules.length > 0 && (
        <div className="explain-section">
          <h4 className="explain-section-title">{t.triggeredRules}</h4>
          <div className="explain-rules">
            {result.triggeredRules.slice(0, 3).map((tr) => (
              <div key={tr.rule.id} className="explain-rule">
                <span className="explain-rule-id">{tr.rule.id}</span>
                <span className="explain-rule-desc">{tr.rule.description}</span>
                <div className="explain-rule-strength-bar">
                  <div
                    className="explain-rule-strength-fill"
                    style={{ width: `${Math.round(tr.activationStrength * 100)}%` }}
                  />
                </div>
                <span className="explain-rule-strength">
                  {Math.round(tr.activationStrength * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reasoning — Input Memberships */}
      <div className="explain-section">
        <h4 className="explain-section-title">{t.reasoning}</h4>
        <div className="explain-inputs">
          {result.triggeredRules[0]?.matchedConditions.map((cond, i) => (
            <div key={i} className="explain-input-row">
              <span className="explain-input-var">{variableLabels[cond.variable] ?? cond.variable}</span>
              <span className={`explain-input-level explain-level-${cond.level.toLowerCase()}`}>
                {cond.level}
              </span>
              <span className="explain-input-degree">{Math.round(cond.degree * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="explain-section explain-recommendation">
        <h4 className="explain-section-title">{t.recommendation}</h4>
        <p className="explain-rec-text">{recommendation}</p>
      </div>
    </div>
  );
}
