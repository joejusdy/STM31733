/**
 * NetAdmin 360 — Hash-based SPA Router
 * Navigates between module views using URL hash.
 * Works on GitHub Pages without any server-side redirects.
 *
 * URL format: na360/index.html#/student/dashboard
 *                              #/student/radar
 *                              #/lecturer/dashboard
 *                              etc.
 */

const ROUTES = {
  // Student modules
  '/student/dashboard':       { file: 'student/dashboard.html',       title: 'Dashboard',              section: 'student' },
  '/student/radar':           { file: 'student/radar.html',           title: 'Competency Radar',        section: 'student' },
  '/student/skill-tree':      { file: 'student/skill-tree.html',      title: 'Skill Tree',             section: 'student' },
  '/student/mastery':         { file: 'student/mastery.html',         title: 'Skill Mastery',          section: 'student' },
  '/student/cisco-analyzer':  { file: 'student/cisco-analyzer.html',  title: 'Cisco Analyzer',         section: 'student' },
  '/student/vnoc':            { file: 'student/vnoc.html',            title: 'Virtual NOC',            section: 'student' },
  '/student/missions':        { file: 'student/missions.html',        title: 'Missions',               section: 'student' },
  '/student/readiness':       { file: 'student/readiness.html',       title: 'Readiness Index',        section: 'student' },
  '/student/recommendations': { file: 'student/recommendations.html', title: 'Recommendations',         section: 'student' },
  '/student/passport':        { file: 'student/passport.html',        title: 'Skill Passport',         section: 'student' },
  // Lecturer modules
  '/lecturer/dashboard':      { file: 'lecturer/dashboard.html',      title: 'Intelligence Dashboard', section: 'lecturer' },
  '/lecturer/heatmap':        { file: 'lecturer/heatmap.html',        title: 'Class Heatmap',          section: 'lecturer' },
  '/lecturer/intervention':   { file: 'lecturer/intervention.html',   title: 'Interventions',          section: 'lecturer' },
  '/lecturer/clo-attainment': { file: 'lecturer/clo-attainment.html', title: 'CLO/PLO Attainment',     section: 'lecturer' },
};

const DEFAULT_ROUTE = '/student/dashboard';

let contentArea = null;
let currentRoute = null;

/**
 * Navigate to a route.
 * @param {string} path — e.g. '/student/dashboard'
 */
async function navigate(path) {
  const route = ROUTES[path] || ROUTES[DEFAULT_ROUTE];
  currentRoute = path;

  // Update URL hash
  window.location.hash = path;

  // Update active sidebar link
  document.querySelectorAll('.sidebar-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.route === path);
  });

  // Update topbar breadcrumb
  _updateBreadcrumb(route.title, route.section);

  // Load the view
  await _loadView(route.file);
}

/**
 * Load a view HTML file into the content area.
 */
async function _loadView(file) {
  if (!contentArea) {
    contentArea = document.getElementById('na360-view');
  }
  if (!contentArea) return;

  // Show loading skeleton
  contentArea.innerHTML = `
    <div class="page-header">
      <div class="skeleton skeleton-title" style="width:200px;height:28px;"></div>
      <div class="skeleton skeleton-text" style="width:300px;"></div>
    </div>
    <div class="grid grid-cols-4" style="gap:1.25rem;">
      ${Array(4).fill('<div class="skeleton" style="height:120px;border-radius:12px;"></div>').join('')}
    </div>
    <div class="skeleton skeleton-chart" style="margin-top:1.25rem;height:300px;"></div>
  `;

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    // Extract only the body content (between <body> tags if present, else full)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const viewContent = doc.getElementById('view-content');
    contentArea.innerHTML = viewContent
      ? viewContent.innerHTML
      : doc.body.innerHTML;

    // Execute any inline scripts in the loaded content
    contentArea.querySelectorAll('script').forEach(oldScript => {
      const newScript = document.createElement('script');
      newScript.type = 'module';
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(newScript);
    });

    // Scroll to top
    contentArea.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    contentArea.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Page Not Found</h1>
        <p class="page-subtitle">Could not load: ${file}</p>
      </div>
      <div class="alert alert-warning">
        <span>⚠</span>
        <div>Module file not yet available. Check back after full implementation.</div>
      </div>
    `;
    console.error('[Router] Failed to load view:', file, err);
  }
}

function _updateBreadcrumb(title, section) {
  const bc = document.getElementById('topbar-breadcrumb');
  if (!bc) return;
  const sectionLabel = section === 'student' ? 'Student Workspace' : 'Lecturer Tools';
  bc.innerHTML = `
    <span class="breadcrumb-item">NetAdmin 360</span>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-item">${sectionLabel}</span>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-item current">${title}</span>
  `;
}

/**
 * Initialise the router — read the current hash and navigate.
 */
function init() {
  // Handle hash changes (back/forward navigation)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || DEFAULT_ROUTE;
    if (ROUTES[hash]) navigate(hash);
  });

  // Initial navigation
  const initialHash = window.location.hash.replace('#', '');
  navigate(ROUTES[initialHash] ? initialHash : DEFAULT_ROUTE);
}

/**
 * Get the current route path.
 */
function getCurrentRoute() { return currentRoute; }

export const Router = { init, navigate, getCurrentRoute, ROUTES };
export default Router;
