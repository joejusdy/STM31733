/**
 * NetAdmin 360 — Competency Engine
 * Deterministic scoring algorithms for all competency calculations.
 *
 * PRINCIPLE: Same inputs always produce the same outputs.
 * No random numbers. All weights are constants.
 * All weights are documented inline for transparency.
 *
 * READINESS INDEX FORMULA (mirrors official course CA structure):
 *   RI = 0.15×Test + 0.45×Practical1 + 0.30×Practical2 + 0.10×Presentation
 *
 * DOMAIN SCORE FORMULA:
 *   DomainScore(d) = weighted average of all quiz scores for weeks mapped to domain d
 *                    + mission bonus (up to +10%)
 *
 * OVERALL COMPETENCY:
 *   Overall = Σ (DomainScore(d) × DomainWeight(d)) for all 6 domains
 *   Weights: D1–D5 each = 18%, D6 = 10%
 */

import DataModel from './data-model.js';
import EventBus from './event-bus.js';

// ── Constants ────────────────────────────────────────────────

/** Official CA/FA weights matching STM31733 course structure */
const RI_WEIGHTS = {
  test:         0.15,
  practical1:   0.45,
  practical2:   0.30,
  presentation: 0.10,
};

/** Domain weights (must sum to 1.0) */
const DOMAIN_WEIGHTS = {
  domain1: 0.18,  // Network Administration Fundamentals
  domain2: 0.18,  // Network Device Infrastructure
  domain3: 0.18,  // Network Configuration
  domain4: 0.18,  // Network Troubleshooting
  domain5: 0.18,  // Network Monitoring & Security
  domain6: 0.10,  // Professional Practice & Communication
};

/** Quiz weeks mapped to their primary domain */
const QUIZ_DOMAIN_MAP = {
  week1:  'domain1',
  week2:  'domain1',
  week3:  'domain2',
  week4:  'domain2',
  week5:  'domain3',
  week6:  'domain3',
  week7:  'domain3',
  week8:  'domain3',
  week9:  'domain3',
  week10: 'domain3',
  week11: 'domain4',
  week12: 'domain5',
  week13: 'domain5',
  week14: 'domain6',
};

/** Mission categories mapped to their primary domain */
const MISSION_DOMAIN_MAP = {
  CAT1: 'domain4',
  CAT2: 'domain3',
  CAT3: 'domain3',
  CAT4: 'domain3',
  CAT5: 'domain5',
  CAT6: 'domain6',
};

/** Mastery level thresholds */
const MASTERY_THRESHOLDS = [
  { level: 0, label: 'Not Started', min: null, max: null },
  { level: 1, label: 'Novice',      min: 0,    max: 39   },
  { level: 2, label: 'Developing',  min: 40,   max: 59   },
  { level: 3, label: 'Competent',   min: 60,   max: 79   },
  { level: 4, label: 'Proficient',  min: 80,   max: 89   },
  { level: 5, label: 'Expert',      min: 90,   max: 100  },
];

/** Mission bonus config */
const MISSION_BONUS_PER = 5;    // % per completed mission
const MISSION_BONUS_CAP = 10;   // maximum bonus from missions per domain

// ── Mastery Level ────────────────────────────────────────────

/**
 * Determine mastery level (0–5) from a score (0–100).
 * Level 5 (Expert) also requires at least 1 mission completed.
 * @param {number} score
 * @param {boolean} [hasCompletedMission=false]
 * @returns {{ level: number, label: string }}
 */
function getMasteryLevel(score, hasCompletedMission = false) {
  if (score === null || score === undefined || isNaN(score)) {
    return MASTERY_THRESHOLDS[0]; // Not Started
  }
  for (let i = MASTERY_THRESHOLDS.length - 1; i >= 1; i--) {
    const t = MASTERY_THRESHOLDS[i];
    if (score >= t.min) {
      // Level 5 requires at least one completed mission
      if (t.level === 5 && !hasCompletedMission) {
        return MASTERY_THRESHOLDS[4]; // Drop to Proficient
      }
      return t;
    }
  }
  return MASTERY_THRESHOLDS[0];
}

// ── Readiness Index ──────────────────────────────────────────

/**
 * Calculate the Readiness Index from CA component scores.
 * Weights mirror the official STM31733 assessment structure.
 *
 * @param {{ test, practical1, practical2, presentation }} scores — values 0–100 or null
 * @returns {{ ri: number, components: object, band: object }}
 */
function calculateRI(scores) {
  const components = {};
  let weightedSum = 0;
  let usedWeight = 0;

  Object.entries(RI_WEIGHTS).forEach(([key, weight]) => {
    const raw = scores[key];
    const value = (raw !== null && raw !== undefined && !isNaN(raw)) ? Number(raw) : null;
    components[key] = {
      raw: value,
      weighted: value !== null ? value * weight : null,
      weight,
    };
    if (value !== null) {
      weightedSum += value * weight;
      usedWeight += weight;
    }
  });

  // If no scores entered yet, RI is 0
  const ri = usedWeight > 0 ? Math.round((weightedSum / usedWeight) * usedWeight * (1 / 1)) : 0;
  // Note: We scale proportionally only if partial — if all weights have scores, ri = Σ(score × weight)
  // Recalculate cleanly:
  const riClean = Object.entries(RI_WEIGHTS).every(([k]) => scores[k] !== null && scores[k] !== undefined)
    ? Math.round(Object.entries(RI_WEIGHTS).reduce((sum, [k, w]) => sum + scores[k] * w, 0))
    : Math.round(usedWeight > 0 ? weightedSum / usedWeight * 100 / 100 : 0);

  const band = getReadinessBand(riClean);

  return { ri: riClean, components, band };
}

/**
 * Determine the readiness band from an RI score.
 */
function getReadinessBand(ri) {
  if (ri >= 90) return { band: 'Exam-Ready',  color: '#F9AB00', advice: 'Excellent readiness. Proceed with confidence to your final assessment.' };
  if (ri >= 80) return { band: 'Confident',   color: '#34A853', advice: 'Well prepared. Light review of your weakest domain is recommended.' };
  if (ri >= 60) return { band: 'Ready',       color: '#1A73E8', advice: 'On track. Consolidate weak areas and complete all Packet Tracer labs.' };
  if (ri >= 40) return { band: 'Developing',  color: '#FBBC04', advice: 'Targeted revision needed. Focus on CLO2 practical skills.' };
  return           { band: 'Critical',    color: '#EA4335', advice: 'Immediate action required. Contact your lecturer for guidance.' };
}

// ── Domain Scores ────────────────────────────────────────────

/**
 * Calculate all 6 domain scores from quiz progress and mission completions.
 *
 * @param {object} progress — from DataModel.Progress.get()
 * @param {object} missions — from DataModel.Missions.get()
 * @returns {{ domain1–6: number }}
 */
function calculateDomainScores(progress, missions) {
  // Accumulate quiz scores per domain
  const domainData = {};
  Object.keys(DOMAIN_WEIGHTS).forEach(d => {
    domainData[d] = { scores: [], weights: [] };
  });

  Object.entries(QUIZ_DOMAIN_MAP).forEach(([weekKey, domainId]) => {
    const week = progress[weekKey];
    if (week && week.quiz_score !== null && week.quiz_score !== undefined) {
      domainData[domainId].scores.push(week.quiz_score);
      domainData[domainId].weights.push(1); // equal weight per quiz
    }
  });

  // Calculate mission bonus per domain
  const missionBonuses = {};
  Object.keys(DOMAIN_WEIGHTS).forEach(d => { missionBonuses[d] = 0; });

  // Load mission data from missions.json mapping (static — categories defined in data)
  // We use the MISSION_DOMAIN_MAP constant above
  if (missions) {
    // For each category, count completed missions
    const catCounts = {};
    Object.entries(missions).forEach(([missionId, data]) => {
      if (!data.completed) return;
      // Derive category from mission ID prefix (M001–M002=CAT1, M003–M004=CAT2, etc.)
      const idx = parseInt(missionId.replace('M', ''), 10);
      let cat;
      if      (idx <= 2)  cat = 'CAT1';
      else if (idx <= 4)  cat = 'CAT2';
      else if (idx <= 6)  cat = 'CAT3';
      else if (idx <= 8)  cat = 'CAT4';
      else if (idx <= 10) cat = 'CAT5';
      else                cat = 'CAT6';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    Object.entries(catCounts).forEach(([cat, count]) => {
      const domainId = MISSION_DOMAIN_MAP[cat];
      if (domainId) {
        const bonus = Math.min(count * MISSION_BONUS_PER, MISSION_BONUS_CAP);
        missionBonuses[domainId] = Math.max(missionBonuses[domainId], bonus);
      }
    });
  }

  // Calculate final domain scores
  const domainScores = {};
  Object.keys(DOMAIN_WEIGHTS).forEach(d => {
    const { scores } = domainData[d];
    let baseScore = 0;
    if (scores.length > 0) {
      baseScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
    // Apply mission bonus (capped at 100)
    const finalScore = Math.min(100, baseScore + missionBonuses[d]);
    domainScores[d] = finalScore;
  });

  return domainScores;
}

// ── Overall Competency ───────────────────────────────────────

/**
 * Calculate overall competency score from domain scores.
 * @param {{ domain1–6: number }} domainScores
 * @returns {number} 0–100
 */
function calculateOverallCompetency(domainScores) {
  let total = 0;
  Object.entries(DOMAIN_WEIGHTS).forEach(([d, w]) => {
    total += (domainScores[d] || 0) * w;
  });
  return Math.round(total);
}

// ── Recalculate and Persist All ──────────────────────────────

/**
 * Full recalculation: reads all stored data, recomputes all scores,
 * persists updated competency to DataModel, and emits events.
 * Call this whenever a quiz score, lab score, or mission completes.
 */
async function recalculateAll() {
  const progress = DataModel.Progress.get();
  const missions = DataModel.Missions.get();
  const scores   = DataModel.Scores.get();

  // 1. Domain scores
  const domainScores = calculateDomainScores(progress, missions);

  // 2. Overall competency
  const overall = calculateOverallCompetency(domainScores);

  // 3. Mastery levels per domain
  const missionCount = DataModel.Missions.getCompletedCount();
  const updatedCompetency = {};
  Object.entries(domainScores).forEach(([d, score]) => {
    const mastery = getMasteryLevel(score, missionCount > 0);
    updatedCompetency[d] = score;
    DataModel.Competency.update(d, score, mastery.level);
  });

  // 4. Readiness Index
  const riResult = calculateRI(scores);
  DataModel.ReadinessHistory.add(riResult.ri, riResult.components);

  // 5. Badge checks
  checkAndAwardBadges(domainScores, missions, progress);

  EventBus.emit('engine:recalculated', {
    domainScores,
    overall,
    ri: riResult.ri,
  });

  return { domainScores, overall, ri: riResult.ri, riResult };
}

// ── Badge Awarding ───────────────────────────────────────────

function checkAndAwardBadges(domainScores, missions, progress) {
  const missionCount = DataModel.Missions.getCompletedCount();
  const ciscoCount   = DataModel.CiscoHistory.getCount();
  const ciscoAvg     = DataModel.CiscoHistory.getAverageScore();
  const weeksVisited = DataModel.Progress.getVisitedCount();
  const scores       = DataModel.Scores.get();

  const award = (id, label) => {
    if (!DataModel.Passport.hasBadge(id)) {
      DataModel.Passport.addBadge(id, label);
      DataModel.Passport.addAchievement(`Earned badge: ${label}`);
    }
  };

  // Domain badges (≥ 80%)
  if (domainScores.domain1 >= 80) award('badge-d1', 'Network Admin Fundamentals');
  if (domainScores.domain2 >= 80) award('badge-d2', 'Infrastructure Specialist');
  if (domainScores.domain3 >= 80) award('badge-d3', 'Network Configuration Expert');
  if (domainScores.domain4 >= 80 && missionCount >= 2) award('badge-d4', 'Troubleshooter Pro');
  if (domainScores.domain5 >= 80) award('badge-d5', 'Monitoring & Security Analyst');
  if (scores.presentation !== null && scores.presentation >= 80) award('badge-d6', 'Professional Communicator');

  // Special badges
  if (missionCount >= 5) award('badge-mission-commander', 'Mission Commander');
  if (ciscoCount >= 10 && ciscoAvg >= 75) award('badge-cisco-analyst', 'Cisco Config Analyst');
  if (weeksVisited >= 14 && scores.test !== null && scores.practical1 !== null) award('badge-completer', 'Course Completer');

  // Ultimate badge
  const allDomainBadges = ['badge-d1','badge-d2','badge-d3','badge-d4','badge-d5','badge-d6',
                            'badge-mission-commander','badge-cisco-analyst','badge-completer'];
  if (allDomainBadges.every(b => DataModel.Passport.hasBadge(b))) {
    award('badge-graduate', 'NetAdmin 360 Graduate');
  }
}

// ── Recommendation Engine ────────────────────────────────────

/**
 * Generate top-N personalised study recommendations.
 * Deterministic: same inputs → same outputs.
 *
 * @param {number} [n=5]
 * @returns {Array<{ priority, action, reason, domain, clo, week, type }>}
 */
function generateRecommendations(n = 5) {
  const domainScores = DataModel.Competency.get();
  const missions     = DataModel.Missions.get();
  const progress     = DataModel.Progress.get();

  const domainLabels = {
    domain1: 'Network Admin Fundamentals',
    domain2: 'Network Device Infrastructure',
    domain3: 'Network Configuration',
    domain4: 'Network Troubleshooting',
    domain5: 'Network Monitoring & Security',
    domain6: 'Professional Practice',
  };

  const domainCLOs = {
    domain1: 'CLO1', domain2: 'CLO1',
    domain3: 'CLO2', domain4: 'CLO2',
    domain5: 'CLO2', domain6: 'CLO3',
  };

  const domainWeeks = {
    domain1: [1, 2],
    domain2: [3, 4],
    domain3: [5, 6, 7, 8, 9, 10],
    domain4: [11],
    domain5: [12, 13],
    domain6: [14],
  };

  const recs = [];

  // Sort domains by ascending score (weakest first)
  const sorted = Object.entries(domainScores)
    .sort((a, b) => a[1].score - b[1].score);

  sorted.forEach(([domainId, data]) => {
    const score = data.score;
    const label = domainLabels[domainId];
    const clo   = domainCLOs[domainId];
    const weeks = domainWeeks[domainId] || [];
    const priority = score < 40 ? 'High' : score < 60 ? 'Medium' : 'Low';

    // Find unvisited or low-score weeks for this domain
    weeks.forEach(weekNum => {
      const weekData = progress[`week${weekNum}`];
      if (!weekData || !weekData.visited || (weekData.quiz_score !== null && weekData.quiz_score < 60)) {
        recs.push({
          type: 'revise',
          priority,
          action: `Revise Week ${weekNum}: ${label}`,
          reason: `Your ${label} score is ${score}% — below the Competent threshold of 60%`,
          domain: domainId,
          clo,
          week: weekNum,
          link: `../week${weekNum}/index.html`,
        });
      }
    });

    // Find incomplete missions for this domain
    if (['domain3', 'domain4', 'domain5'].includes(domainId)) {
      const catMap = {
        domain3: ['M003', 'M004', 'M005', 'M006', 'M007', 'M008'],
        domain4: ['M001', 'M002'],
        domain5: ['M009', 'M010', 'M011'],
      };
      (catMap[domainId] || []).forEach(mId => {
        if (!missions[mId] || !missions[mId].completed) {
          recs.push({
            type: 'mission',
            priority,
            action: `Complete Mission: ${mId}`,
            reason: `Completing this mission will boost your ${label} domain score`,
            domain: domainId,
            clo,
            week: null,
            link: '../student/missions.html',
          });
        }
      });
    }
  });

  // Deduplicate, limit to n, and return
  const seen = new Set();
  const unique = recs.filter(r => {
    const key = r.type + (r.week || r.action);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, n);
}

// ── CLO Attainment (for student) ─────────────────────────────

/**
 * Calculate student's attainment per CLO from stored scores.
 * @returns {{ CLO1: number, CLO2: number, CLO3: number }}
 */
function calculateCLOAttainment() {
  const scores = DataModel.Scores.get();
  return {
    CLO1: scores.test !== null ? scores.test : 0,
    CLO2: (scores.practical1 !== null && scores.practical2 !== null)
            ? Math.round((scores.practical1 * 0.6 + scores.practical2 * 0.4))
            : (scores.practical1 || scores.practical2 || 0),
    CLO3: scores.presentation !== null ? scores.presentation : 0,
  };
}

// ── Export ───────────────────────────────────────────────────

export const CompetencyEngine = {
  RI_WEIGHTS,
  DOMAIN_WEIGHTS,
  MASTERY_THRESHOLDS,
  getMasteryLevel,
  calculateRI,
  getReadinessBand,
  calculateDomainScores,
  calculateOverallCompetency,
  recalculateAll,
  generateRecommendations,
  calculateCLOAttainment,
  checkAndAwardBadges,
};

export default CompetencyEngine;
