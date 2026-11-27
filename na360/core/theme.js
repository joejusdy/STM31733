/**
 * NetAdmin 360 — Theme Manager
 * Manages dark/light mode toggle and persistence.
 * Applies [data-theme="dark"] to <html> element.
 */

import DataModel from './data-model.js';
import EventBus from './event-bus.js';

// Chart.js default colour overrides for dark mode
const CHART_DEFAULTS = {
  dark: {
    color:       '#8B949E',
    borderColor: '#30363D',
    gridColor:   'rgba(48,54,61,0.8)',
    tickColor:   '#8B949E',
  },
  light: {
    color:       '#5F6368',
    borderColor: '#E0E0E0',
    gridColor:   'rgba(224,224,224,0.8)',
    tickColor:   '#5F6368',
  },
};

let currentTheme = 'light';

/**
 * Apply a theme to the document and update Chart.js defaults if loaded.
 * @param {'light'|'dark'} mode
 */
function applyTheme(mode) {
  currentTheme = mode;
  document.documentElement.setAttribute('data-theme', mode);

  // Update toggle button icon if present
  const icon = document.querySelector('.theme-toggle-icon');
  const label = document.querySelector('.theme-toggle-label');
  if (icon)  icon.textContent = mode === 'dark' ? '☀' : '☾';
  if (label) label.textContent = mode === 'dark' ? 'Light Mode' : 'Dark Mode';

  // Update Chart.js global defaults if Chart.js is loaded
  if (typeof Chart !== 'undefined') {
    const cfg = CHART_DEFAULTS[mode];
    Chart.defaults.color = cfg.color;
    Chart.defaults.borderColor = cfg.borderColor;
    if (Chart.defaults.plugins?.legend?.labels) {
      Chart.defaults.plugins.legend.labels.color = cfg.color;
    }
  }

  // Persist
  DataModel.Theme.set(mode);
  EventBus.emit('theme:changed', { mode });
}

/**
 * Toggle between light and dark.
 */
function toggle() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

/**
 * Initialise theme from stored preference or system preference.
 */
function init() {
  const stored = DataModel.Theme.get();
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
    return;
  }
  // Respect system preference as default
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

/**
 * Get current theme mode.
 * @returns {'light'|'dark'}
 */
function getMode() { return currentTheme; }

/**
 * Get Chart.js colour config for the current theme.
 * @returns {object}
 */
function getChartColors() { return CHART_DEFAULTS[currentTheme]; }

export const Theme = { init, toggle, applyTheme, getMode, getChartColors, CHART_DEFAULTS };
export default Theme;
