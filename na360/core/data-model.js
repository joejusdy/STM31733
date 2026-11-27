/**
 * NetAdmin 360 — Data Model (localStorage CRUD Layer)
 * All localStorage reads and writes pass through this module.
 *
 * Keys used:
 *   na360_student_profile   — student identity
 *   na360_progress          — per-week activity
 *   na360_scores            — CA component scores
 *   na360_competency        — 6-domain scores + history
 *   na360_missions          — mission attempt history
 *   na360_cisco_history     — Cisco analyzer session history
 *   na360_readiness         — RI history snapshots
 *   na360_passport          — earned badges + achievements
 *   na360_theme             — 'dark' | 'light'
 *   na360_lect_interventions— lecturer intervention notes
 *   na360_vnoc_log          — Virtual NOC session log
 *   na360_quiz_answers      — per-week quiz answer records
 */

import EventBus from './event-bus.js';

const KEYS = {
  PROFILE:       'na360_student_profile',
  PROGRESS:      'na360_progress',
  SCORES:        'na360_scores',
  COMPETENCY:    'na360_competency',
  MISSIONS:      'na360_missions',
  CISCO:         'na360_cisco_history',
  READINESS:     'na360_readiness',
  PASSPORT:      'na360_passport',
  THEME:         'na360_theme',
  INTERVENTIONS: 'na360_lect_interventions',
  VNOC_LOG:      'na360_vnoc_log',
  QUIZ_ANSWERS:  'na360_quiz_answers',
};

// ── Generic Helpers ──────────────────────────────────────────

function _get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[DataModel] Failed to read "${key}":`, e);
    return fallback;
  }
}

function _set(key, value) {
  try {
    // Guard: check approximate storage size
    const str = JSON.stringify(value);
    localStorage.setItem(key, str);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('[DataModel] localStorage quota exceeded. Clearing old history entries.');
      _pruneHistory();
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e2) {
        console.error('[DataModel] Still cannot write after pruning:', e2);
        return false;
      }
    }
    console.error(`[DataModel] Failed to write "${key}":`, e);
    return false;
  }
}

function _pruneHistory() {
  // Keep only the last 10 readiness snapshots and last 20 cisco sessions
  const ri = _get(KEYS.READINESS, []);
  if (ri.length > 10) _set(KEYS.READINESS, ri.slice(-10));
  const cisco = _get(KEYS.CISCO, []);
  if (cisco.length > 20) _set(KEYS.CISCO, cisco.slice(-20));
}

function _remove(key) {
  try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
}

// ── Student Profile ──────────────────────────────────────────

const Profile = {
  get() {
    return _get(KEYS.PROFILE, null);
  },

  set(name, cohort = 'DKM/DLKM Network Administration') {
    const id = 'STD_' + Date.now().toString(36).toUpperCase();
    const profile = {
      id,
      name: String(name).trim(),
      cohort,
      semester: 'Semester 3',
      year: 'Year 2',
      institution: 'Kolej Komuniti Papar',
      course: 'STM31733 Network Administration',
      enrollDate: new Date().toISOString(),
    };
    _set(KEYS.PROFILE, profile);
    EventBus.emit('profile:updated', profile);
    return profile;
  },

  exists() {
    const p = _get(KEYS.PROFILE, null);
    return p !== null && p.name && p.name.length > 0;
  },

  getName() {
    const p = _get(KEYS.PROFILE, null);
    return p ? p.name : 'Student';
  },
};

// ── Week Progress ────────────────────────────────────────────

const Progress = {
  _default() {
    const weeks = {};
    for (let w = 1; w <= 14; w++) {
      weeks[`week${w}`] = {
        visited: false,
        quiz_completed: false,
        quiz_score: null,       // 0–100 or null if not taken
        quiz_answers: [],       // array of { question_id, selected, correct }
        lab_completed: false,
        completed: false,
        visited_at: null,
        completed_at: null,
      };
    }
    return weeks;
  },

  get() {
    return _get(KEYS.PROGRESS, this._default());
  },

  getWeek(weekNum) {
    const p = this.get();
    return p[`week${weekNum}`] || {};
  },

  markVisited(weekNum) {
    const p = this.get();
    const key = `week${weekNum}`;
    if (!p[key]) return;
    if (!p[key].visited) {
      p[key].visited = true;
      p[key].visited_at = new Date().toISOString();
      _set(KEYS.PROGRESS, p);
      EventBus.emit('progress:week_visited', { week: weekNum });
    }
  },

  saveQuizResult(weekNum, score, answers) {
    const p = this.get();
    const key = `week${weekNum}`;
    if (!p[key]) return;
    p[key].quiz_completed = true;
    p[key].quiz_score = score;
    p[key].quiz_answers = answers;
    // Auto-mark visited
    if (!p[key].visited) { p[key].visited = true; p[key].visited_at = new Date().toISOString(); }
    // Auto-mark completed if lab not required or already done
    _set(KEYS.PROGRESS, p);
    EventBus.emit('progress:quiz_completed', { week: weekNum, score });
  },

  markLabCompleted(weekNum) {
    const p = this.get();
    const key = `week${weekNum}`;
    if (!p[key]) return;
    p[key].lab_completed = true;
    _set(KEYS.PROGRESS, p);
    EventBus.emit('progress:lab_completed', { week: weekNum });
  },

  markWeekCompleted(weekNum) {
    const p = this.get();
    const key = `week${weekNum}`;
    if (!p[key]) return;
    p[key].completed = true;
    p[key].completed_at = new Date().toISOString();
    _set(KEYS.PROGRESS, p);
    EventBus.emit('progress:week_completed', { week: weekNum });
  },

  getCompletedCount() {
    const p = this.get();
    return Object.values(p).filter(w => w.completed).length;
  },

  getVisitedCount() {
    const p = this.get();
    return Object.values(p).filter(w => w.visited).length;
  },

  getCompletionPct() {
    return Math.round((this.getCompletedCount() / 14) * 100);
  },

  getAverageQuizScore() {
    const p = this.get();
    const scores = Object.values(p)
      .map(w => w.quiz_score)
      .filter(s => s !== null && s !== undefined);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  },
};

// ── Scores (CA Components) ───────────────────────────────────

const Scores = {
  _default() {
    return { test: null, practical1: null, practical2: null, presentation: null };
  },

  get() { return _get(KEYS.SCORES, this._default()); },

  update(component, value) {
    const s = this.get();
    const clamped = Math.max(0, Math.min(100, Number(value)));
    s[component] = clamped;
    _set(KEYS.SCORES, s);
    EventBus.emit('scores:updated', { component, value: clamped });
  },

  getAll() { return this.get(); },
};

// ── Competency ───────────────────────────────────────────────

const Competency = {
  _default() {
    return {
      domain1: { score: 0, level: 0, history: [] },
      domain2: { score: 0, level: 0, history: [] },
      domain3: { score: 0, level: 0, history: [] },
      domain4: { score: 0, level: 0, history: [] },
      domain5: { score: 0, level: 0, history: [] },
      domain6: { score: 0, level: 0, history: [] },
    };
  },

  get() { return _get(KEYS.COMPETENCY, this._default()); },

  update(domainId, score, level) {
    const c = this.get();
    if (!c[domainId]) return;
    const prev = c[domainId].score;
    c[domainId].score = score;
    c[domainId].level = level;
    // Keep last 8 history points
    c[domainId].history.push({ score, timestamp: new Date().toISOString() });
    if (c[domainId].history.length > 8) c[domainId].history.shift();
    _set(KEYS.COMPETENCY, c);
    EventBus.emit('competency:updated', { domain: domainId, score, level, prev });
  },

  updateAll(scores) {
    // scores: { domain1: 72, domain2: 65, ... }
    const c = this.get();
    Object.entries(scores).forEach(([domainId, score]) => {
      if (!c[domainId]) return;
      c[domainId].score = score;
      c[domainId].history.push({ score, timestamp: new Date().toISOString() });
      if (c[domainId].history.length > 8) c[domainId].history.shift();
    });
    _set(KEYS.COMPETENCY, c);
    EventBus.emit('competency:all_updated', scores);
  },

  getOverallScore() {
    const c = this.get();
    const weights = { domain1: 0.18, domain2: 0.18, domain3: 0.18, domain4: 0.18, domain5: 0.18, domain6: 0.10 };
    let total = 0, totalWeight = 0;
    Object.entries(c).forEach(([k, v]) => {
      const w = weights[k] || 0;
      total += v.score * w;
      totalWeight += w;
    });
    return totalWeight > 0 ? Math.round(total / totalWeight) : 0;
  },

  getWeakestDomains(n = 3) {
    const c = this.get();
    return Object.entries(c)
      .sort((a, b) => a[1].score - b[1].score)
      .slice(0, n)
      .map(([id, data]) => ({ id, ...data }));
  },
};

// ── Missions ─────────────────────────────────────────────────

const Missions = {
  _default() { return {}; },

  get() { return _get(KEYS.MISSIONS, this._default()); },

  saveMissionResult(missionId, score, hintsUsed, timeSeconds) {
    const m = this.get();
    if (!m[missionId]) {
      m[missionId] = { attempts: 0, best_score: 0, completed: false, history: [] };
    }
    m[missionId].attempts++;
    m[missionId].history.push({ score, hintsUsed, timeSeconds, timestamp: new Date().toISOString() });
    if (score > m[missionId].best_score) m[missionId].best_score = score;
    if (score >= 60) m[missionId].completed = true;
    _set(KEYS.MISSIONS, m);
    EventBus.emit('missions:completed', { missionId, score });
  },

  getCompletedCount() {
    const m = this.get();
    return Object.values(m).filter(m => m.completed).length;
  },

  getCompletionRate() {
    // Against total 12 missions
    return Math.round((this.getCompletedCount() / 12) * 100);
  },

  getMissionScore(missionId) {
    const m = this.get();
    return m[missionId] ? m[missionId].best_score : 0;
  },
};

// ── Cisco Analyzer ───────────────────────────────────────────

const CiscoHistory = {
  get() { return _get(KEYS.CISCO, []); },

  add(score, issueCount, configLength) {
    const h = this.get();
    h.push({ timestamp: new Date().toISOString(), score, issueCount, configLength });
    if (h.length > 20) h.shift();
    _set(KEYS.CISCO, h);
    EventBus.emit('cisco:analyzed', { score });
  },

  getCount() { return this.get().length; },

  getAverageScore() {
    const h = this.get();
    if (h.length === 0) return 0;
    const avg = h.reduce((a, b) => a + b.score, 0) / h.length;
    return Math.round(avg);
  },

  getLast(n = 5) { return this.get().slice(-n); },
};

// ── Readiness History ────────────────────────────────────────

const ReadinessHistory = {
  get() { return _get(KEYS.READINESS, []); },

  add(riScore, components) {
    const h = this.get();
    h.push({ timestamp: new Date().toISOString(), ri_score: riScore, components });
    if (h.length > 10) h.shift();
    _set(KEYS.READINESS, h);
    EventBus.emit('readiness:updated', { score: riScore });
  },

  getLast() {
    const h = this.get();
    return h.length > 0 ? h[h.length - 1] : null;
  },

  getHistory() { return this.get(); },
};

// ── Passport / Badges ────────────────────────────────────────

const Passport = {
  _default() {
    return { badges: [], achievements: [], generated_at: null };
  },

  get() { return _get(KEYS.PASSPORT, this._default()); },

  addBadge(badgeId, label) {
    const p = this.get();
    if (p.badges.find(b => b.id === badgeId)) return; // already earned
    p.badges.push({ id: badgeId, label, earned_at: new Date().toISOString() });
    _set(KEYS.PASSPORT, p);
    EventBus.emit('passport:badge_earned', { badgeId, label });
  },

  addAchievement(text) {
    const p = this.get();
    p.achievements.push({ text, timestamp: new Date().toISOString() });
    _set(KEYS.PASSPORT, p);
  },

  hasBadge(badgeId) {
    const p = this.get();
    return p.badges.some(b => b.id === badgeId);
  },

  getBadges() { return this.get().badges; },

  regenerate() {
    const p = this.get();
    p.generated_at = new Date().toISOString();
    _set(KEYS.PASSPORT, p);
    return p;
  },
};

// ── Theme ────────────────────────────────────────────────────

const Theme = {
  get() { return _get(KEYS.THEME, 'light'); },
  set(mode) { _set(KEYS.THEME, mode); },
};

// ── Lecturer Interventions ───────────────────────────────────

const Interventions = {
  get() { return _get(KEYS.INTERVENTIONS, []); },

  add(studentId, studentName, action, note) {
    const list = this.get();
    list.push({
      id: Date.now().toString(36),
      student_id: studentId,
      student_name: studentName,
      action,
      note,
      timestamp: new Date().toISOString(),
    });
    _set(KEYS.INTERVENTIONS, list);
  },

  getForStudent(studentId) {
    return this.get().filter(i => i.student_id === studentId);
  },
};

// ── VNOC Log ─────────────────────────────────────────────────

const VNOCLog = {
  get() { return _get(KEYS.VNOC_LOG, []); },

  add(alertId, action) {
    const log = this.get();
    log.push({ alertId, action, timestamp: new Date().toISOString() });
    if (log.length > 100) log.shift();
    _set(KEYS.VNOC_LOG, log);
  },

  clear() { _set(KEYS.VNOC_LOG, []); },
};

// ── Full Reset (dev/testing only) ────────────────────────────

function resetAll() {
  Object.values(KEYS).forEach(k => _remove(k));
  console.info('[DataModel] All na360 data cleared.');
}

// ── Export ───────────────────────────────────────────────────

export const DataModel = {
  KEYS,
  Profile,
  Progress,
  Scores,
  Competency,
  Missions,
  CiscoHistory,
  ReadinessHistory,
  Passport,
  Theme,
  Interventions,
  VNOCLog,
  resetAll,
};

export default DataModel;
