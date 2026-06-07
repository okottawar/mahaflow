// MahaFlow — Fuzzy Logic Engine
// Fuzzification → Rule Evaluation → Defuzzification → Explainability

import { fuzzyRules, FuzzyLevel, CongestionCategory, FuzzyRule } from "../data/fuzzyRules";

// --- Membership Functions ---
// Trapezoidal membership functions for fuzzy input variables (0-100 range)

export interface MembershipDegrees {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
}

export function fuzzify(value: number): MembershipDegrees {
  // Clamp to 0-100
  const v = Math.max(0, Math.min(100, value));

  let low = 0, medium = 0, high = 0;

  // LOW: full at 0-20, taper off 20-45, zero at 45+
  if (v <= 20) low = 1;
  else if (v <= 45) low = (45 - v) / 25;
  else low = 0;

  // MEDIUM: zero at 0-20, ramp 20-40, full 40-60, taper 60-80, zero 80+
  if (v <= 20) medium = 0;
  else if (v <= 40) medium = (v - 20) / 20;
  else if (v <= 60) medium = 1;
  else if (v <= 80) medium = (80 - v) / 20;
  else medium = 0;

  // HIGH: zero at 0-55, ramp 55-80, full 80+
  if (v <= 55) high = 0;
  else if (v <= 80) high = (v - 55) / 25;
  else high = 1;

  return { LOW: low, MEDIUM: medium, HIGH: high };
}

// --- Fuzzy Inputs ---
export interface FuzzyInputs {
  crowdDensity: number;
  vehicleDensity: number;
  parkingOccupancy: number;
  eventIntensity: number;
  weatherImpact: number;
}

export interface FuzzyInputMemberships {
  crowdDensity: MembershipDegrees;
  vehicleDensity: MembershipDegrees;
  parkingOccupancy: MembershipDegrees;
  eventIntensity: MembershipDegrees;
  weatherImpact: MembershipDegrees;
}

// --- Rule Evaluation Result ---
export interface TriggeredRule {
  rule: FuzzyRule;
  activationStrength: number; // 0-1
  matchedConditions: { variable: string; level: FuzzyLevel; degree: number }[];
}

export interface FuzzyResult {
  score: number; // 0-100
  category: CongestionCategory;
  triggeredRules: TriggeredRule[];
  inputMemberships: FuzzyInputMemberships;
  topRecommendation: string;
  topRecommendationHi: string;
  topRecommendationMr: string;
}

// --- Engine ---

function getActivation(
  rule: FuzzyRule,
  memberships: FuzzyInputMemberships
): { strength: number; matches: { variable: string; level: FuzzyLevel; degree: number }[] } {
  const matches: { variable: string; level: FuzzyLevel; degree: number }[] = [];
  let minDegree = 1;

  const conditionEntries = Object.entries(rule.conditions) as [keyof FuzzyInputMemberships, FuzzyLevel][];

  if (conditionEntries.length === 0) return { strength: 0, matches: [] };

  for (const [variable, level] of conditionEntries) {
    const degree = memberships[variable][level];
    matches.push({ variable, level, degree });
    // AND semantics: take minimum
    minDegree = Math.min(minDegree, degree);
  }

  return { strength: minDegree, matches };
}

export function evaluateFuzzy(inputs: FuzzyInputs): FuzzyResult {
  // Step 1: Fuzzify all inputs
  const inputMemberships: FuzzyInputMemberships = {
    crowdDensity: fuzzify(inputs.crowdDensity),
    vehicleDensity: fuzzify(inputs.vehicleDensity),
    parkingOccupancy: fuzzify(inputs.parkingOccupancy),
    eventIntensity: fuzzify(inputs.eventIntensity),
    weatherImpact: fuzzify(inputs.weatherImpact),
  };

  // Step 2: Evaluate all rules
  const triggered: TriggeredRule[] = [];

  for (const rule of fuzzyRules) {
    const { strength, matches } = getActivation(rule, inputMemberships);
    if (strength > 0.1) {
      // threshold to avoid noise
      triggered.push({
        rule,
        activationStrength: strength,
        matchedConditions: matches,
      });
    }
  }

  // Sort by activation strength * score (weighted priority)
  triggered.sort((a, b) => b.activationStrength * b.rule.score - a.activationStrength * a.rule.score);

  // Step 3: Defuzzify — weighted average of triggered rule scores
  let weightedSum = 0;
  let weightTotal = 0;

  for (const t of triggered) {
    weightedSum += t.activationStrength * t.rule.score;
    weightTotal += t.activationStrength;
  }

  const score = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 20;

  // Step 4: Categorize
  let category: CongestionCategory;
  if (score >= 80) category = "CRITICAL";
  else if (score >= 60) category = "HIGH";
  else if (score >= 35) category = "MEDIUM";
  else category = "LOW";

  // Top recommendation from highest-priority triggered rule
  const topRule = triggered[0];

  return {
    score,
    category,
    triggeredRules: triggered.slice(0, 5), // top 5
    inputMemberships,
    topRecommendation: topRule?.rule.recommendation ?? "All systems nominal.",
    topRecommendationHi: topRule?.rule.recommendationHi ?? "सभी प्रणालियाँ सामान्य।",
    topRecommendationMr: topRule?.rule.recommendationMr ?? "सर्व प्रणाली सामान्य.",
  };
}
