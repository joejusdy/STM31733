# NetAdmin 360 — Intelligent Network Competency Platform
## Implementation Plan v1.1 (Finalised)
### Course: STM31733 Network Administration | Kolej Komuniti Papar, Malaysia
### Lecturer: Jusdy bin Juwait | Semester 3, Year 2 | Credit: 3

---

## 0. Top-Level Overview

### Goal
Upgrade the existing STM31733 static site (https://31733.netlify.app/) into a professional,
intelligent, competency-based learning platform called **NetAdmin 360**, deployed on GitHub
Pages (https://joejusdy.github.io/STM31733/) while preserving full compatibility with the
existing Netlify deployment.

### Confirmed Design Decisions
| Question | Decision |
|----------|----------|
| CLO/PLO data | 3 CLOs, 11 PLOs — confirmed from official course document |
| Existing site format | Single index.html page — na360 shell lives at /na360/ alongside it |
| Score capture | Fully automatic — derived from quiz interactions, missions, Cisco analyzer (no manual entry) |
| Dashboard language | English |
| Student login | Type name on first load (simple onboarding modal, no password) |
| Implementation scope | All 21 sub-tasks in a single continuous Agent Mode run |
| Repo clone | ST-01 clones https://github.com/joejusdy/STM31733 into workspace as first action |

### Scope
- 14 modules added on top of preserved existing course content
- Vanilla HTML + CSS + JS (no build step required for GitHub Pages)
- All student data stored in localStorage; no backend or paid API in Phase 1
- Deterministic competency scoring algorithms
- Synthetic/labelled class data for all lecturer analytics views
- Optional future upgrade hooks for Supabase and IBM watsonx.ai

### Non-Goals (Phase 1)
- No real-time multi-user collaboration
- No server-side authentication
- No paid third-party APIs
- No React / Vue / Angular framework migration
- No modification to existing weekly lesson HTML files

### Guiding Principle
> Every module must work offline from a GitHub Pages URL with zero server-side logic.

---

## 1. Official Course Data (Verified from COURSE INFORMATION PDF)

### 1.1 Course Learning Outcomes (CLOs)

| CLO | Statement | Bloom Level | Domain | PLO | Assessment |
|-----|-----------|-------------|--------|-----|------------|
| CLO 1 | Identify the concepts of network administration in managing network environment | C3 (Apply) | Cognitive | PLO1 | Test (15%), Cooperative Learning |
| CLO 2 | Implement basic configuration for network devices in network environment | P3 (Precision) | Psychomotor | PLO3 | Practical (45%), Practical (30%) |
| CLO 3 | Perform group discussion in network monitoring traffic by using related software | A2 (Responding) | Affective | PLO8 | Presentation/Discussion (10%) |

### 1.2 Programme Learning Outcomes (PLOs)
PLO1 through PLO11 are defined at programme level (DKM/DLKM).
Relevant mappings:
- **PLO1** — Knowledge (Cognitive domain — CLO1)
- **PLO3** — Practical Skills (Psychomotor domain — CLO2)
- **PLO8** — Communication Skills (Affective domain — CLO3)

### 1.3 Assessment Structure

| Component | Type | Weight | CLO |
|-----------|------|--------|-----|
| Test | Continuous Assessment | 15% | CLO1 |
| Practical (Lab 1) | Continuous Assessment | 45% | CLO2 |
| Practical (Lab 2) | Continuous Assessment (Final) | 30% | CLO2 |
| Presentation/Discussion | Continuous Assessment | 10% | CLO3 |
| **Continuous Assessment Total** | | **70%** | |
| **Final Assessment** | Exam/Final | **30%** | All |

> Students must PASS BOTH Continuous Assessment (≥ pass mark) AND Final Assessment.

### 1.4 Course Content Structure (4 Units, 14 Weeks)

| Unit | Title | Topics | CLO |
|------|-------|--------|-----|
| 1.0 | Introduction to Network Administration | Network admin concepts, roles, NOC functions, best practices | CLO1 |
| 2.0 | Fundamentals of Network Devices | VLAN types & trunking, routing protocols (Static, RIPv2, OSPF, EIGRP), server types & NOS | CLO1, CLO2 |
| 3.0 | Network Configuration | Initial switch/router config, VLAN/trunking, inter-VLAN routing, static/RIPv2 routing, DHCP, DNS, troubleshooting | CLO2 |
| 4.0 | Network Monitor | Network monitoring concepts, SNMP/NetFlow/Telnet/SSH, monitoring tools install & configure & report | CLO2, CLO3 |

### 1.5 Contact Hours
- 14 weeks × 2 hrs Face-to-Face + Non-F2F = **120 total contact hours**
- Tools required: Packet Tracer, PC, Network Switch, Router

---

## 2. Existing Codebase Audit

### 2.1 Structure (to be confirmed in ST-01)
```
/
├── index.html                  # Course landing / home page
├── assets/
│   ├── css/                    # Stylesheets
│   ├── js/                     # Scripts
│   └── img/                    # Images / diagrams
├── week1/ … week14/            # Weekly lesson folders (HTML + resources)
├── assessments/                # Quiz / lab / test pages
└── clo-plo/                    # CLO/PLO mapping data or pages
```

### 2.2 Technology Stack (Assumed — confirm in ST-01)
| Layer | Current |
|-------|---------|
| Markup | Vanilla HTML5 |
| Styling | Custom CSS (possibly Bootstrap) |
| Scripting | Vanilla JS or jQuery |
| Hosting | Netlify static |
| Quizzes | Static HTML pages (not auto-graded) |
| Charts | None or basic |

### 2.3 ST-01 Action
Agent Mode sub-task ST-01 will perform a live audit of all existing files, document the
exact CLO/PLO structure as implemented, and update `course-structure.json` with
verified week-by-week data before creating any new files.

---

## 3. Proposed System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Pages Host                         │
│                  joejusdy.github.io/STM31733/                    │
├──────────────┬──────────────────────────┬───────────────────────┤
│  PRESERVED   │    NEW STUDENT SHELL     │  NEW LECTURER SHELL   │
│  CONTENT     │   /na360/student/        │  /na360/lecturer/     │
│  /week1-14/  │   dashboard.html         │  dashboard.html       │
│  /assess/    │   radar.html             │  heatmap.html         │
│  /clo-plo/   │   skill-tree.html        │  intervention.html    │
│              │   mastery.html           │  clo-attainment.html  │
│              │   cisco-analyzer.html    │                       │
│              │   vnoc.html              │                       │
│              │   missions.html          │                       │
│              │   readiness.html         │                       │
│              │   recommendations.html   │                       │
│              │   passport.html          │                       │
├──────────────┴──────────────────────────┴───────────────────────┤
│                     SHARED CORE LAYER /na360/core/               │
│   competency-engine.js   — scoring algorithms                    │
│   data-model.js          — localStorage read/write helpers       │
│   router.js              — hash-based SPA navigation             │
│   theme.js               — dark/light mode toggle                │
│   event-bus.js           — cross-module pub/sub                  │
├──────────────────────────────────────────────────────────────────┤
│                    SHARED DATA LAYER (localStorage)              │
│   na360_student_profile  na360_progress  na360_competency        │
│   na360_missions  na360_cisco_history  na360_readiness           │
│   na360_passport  na360_theme  na360_lect_interventions          │
├──────────────────────────────────────────────────────────────────┤
│              FUTURE INTEGRATION HOOKS (Phase 2+)                 │
│   /na360/integrations/                                           │
│   supabase-adapter.js    — swap localStorage for Supabase        │
│   watsonx-adapter.js     — IBM watsonx.ai recommendations        │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow (Phase 1)
1. Student enters name on first load → stored in `na360_student_profile`
2. Student interacts with any module → events fire via `event-bus.js`
3. `competency-engine.js` recalculates scores deterministically
4. `data-model.js` persists updated state to localStorage
5. All visualisation modules read from localStorage on mount
6. Lecturer dashboard reads from clearly labelled `synthetic-class.json`

---

## 4. Recommended Technology Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Markup | HTML5 (preserve existing) | No migration risk |
| Styling | Custom CSS + CSS Variables | Zero dependency, theming via variables |
| Scripting | Vanilla ES6+ JS (modules) | No build step needed for GitHub Pages |
| Charts | Chart.js v4 (CDN) | Free, canvas-based, radar + bar + line |
| Network diagrams | D3.js v7 (CDN) | Force-directed graphs for skill tree |
| Icons | Phosphor Icons (CDN) | Free, consistent, NOC-style |
| Fonts | Inter (Google Fonts) | Clean, professional |
| Cisco CLI syntax | Prism.js (CDN) | Syntax highlighting for config analyzer |
| Routing | Hash-based vanilla router | Works on GitHub Pages without 404 issues |
| Storage | localStorage API (built-in) | Zero cost, offline-capable |
| CI/CD | GitHub Actions → gh-pages branch | Automatic deploy on push to main |
| Phase 2 DB | Supabase (optional stub) | Free tier, Postgres, row-level security |
| Phase 2 AI | IBM watsonx.ai (optional stub) | LLM recommendations, skill gap analysis |

### CDN Bundle (all free, no API keys)
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.css">
<script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js"></script>
```

---

## 5. Proposed Folder Structure

```
STM31733/
│
├── index.html                        # PRESERVED — existing home page
├── week1/ … week14/                  # PRESERVED — existing weekly lessons
├── assessments/                      # PRESERVED — existing assessments
├── clo-plo/                          # PRESERVED — existing CLO/PLO pages
│
├── na360/                            # NEW — NetAdmin 360 shell
│   ├── index.html                    # App entry point (sidebar layout + onboarding modal)
│   │
│   ├── core/
│   │   ├── competency-engine.js      # Scoring algorithms (deterministic)
│   │   ├── data-model.js             # localStorage CRUD helpers
│   │   ├── router.js                 # Hash-based view router
│   │   ├── theme.js                  # Dark/light mode toggle + persistence
│   │   └── event-bus.js              # Publish/subscribe for cross-module events
│   │
│   ├── components/
│   │   ├── sidebar.js                # Sidebar HTML builder + active link logic
│   │   ├── topbar.js                 # Topbar: breadcrumb + search + theme toggle
│   │   └── onboarding.js             # First-launch name input modal
│   │
│   ├── student/
│   │   ├── dashboard.html            # Module 1
│   │   ├── radar.html                # Module 2
│   │   ├── skill-tree.html           # Module 3
│   │   ├── mastery.html              # Module 4
│   │   ├── cisco-analyzer.html       # Module 5
│   │   ├── vnoc.html                 # Module 6
│   │   ├── missions.html             # Module 7
│   │   ├── readiness.html            # Module 8
│   │   ├── recommendations.html      # Module 9
│   │   └── passport.html             # Module 10
│   │
│   ├── lecturer/
│   │   ├── dashboard.html            # Module 11
│   │   ├── heatmap.html              # Module 12
│   │   ├── intervention.html         # Module 13
│   │   └── clo-attainment.html       # Module 14
│   │
│   ├── data/
│   │   ├── course-structure.json     # 14-week outline + CLO/PLO mappings (official data)
│   │   ├── competency-domains.json   # 6 competency domain definitions + weightings
│   │   ├── skill-tree.json           # Skill node graph (nodes + edges)
│   │   ├── missions.json             # Troubleshooting scenario bank (min. 6 scenarios)
│   │   ├── cisco-templates.json      # Config analysis rules bank
│   │   ├── synthetic-class.json      # CLEARLY LABELLED synthetic class of 25 students
│   │   └── clo-plo-matrix.json       # Official CLO/PLO attainment definitions
│   │
│   ├── css/
│   │   ├── variables.css             # CSS custom properties (all design tokens)
│   │   ├── layout.css                # Sidebar + main grid + topbar
│   │   ├── components.css            # Cards, badges, tables, modals, gauges
│   │   ├── charts.css                # Chart container + legend styles
│   │   └── dark-mode.css             # Dark mode overrides via [data-theme="dark"]
│   │
│   └── js/
│       ├── dashboard.js              # Module 1 logic
│       ├── radar.js                  # Module 2 — Chart.js radar
│       ├── skill-tree.js             # Module 3 — D3.js graph
│       ├── mastery.js                # Module 4 — mastery table + animations
│       ├── cisco-analyzer.js         # Module 5 — rule engine + Prism.js
│       ├── vnoc.js                   # Module 6 — NOC simulation
│       ├── missions.js               # Module 7 — mission engine
│       ├── readiness.js              # Module 8 — RI formula + gauge
│       ├── recommendations.js        # Module 9 — deterministic recommender
│       ├── passport.js               # Module 10 — badge system + print
│       ├── lect-dashboard.js         # Module 11 — lecturer overview
│       ├── heatmap.js                # Module 12 — class heatmap grid
│       ├── intervention.js           # Module 13 — at-risk analytics
│       └── clo-attainment.js         # Module 14 — CLO/PLO CQI dashboard
│
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions → gh-pages branch
│
└── README.md                         # Updated with na360 usage instructions
```

---

## 6. UI/UX Layout and Navigation

### 6.1 Design Tokens

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--bg-primary` | `#FFFFFF` | `#0D1117` |
| `--bg-surface` | `#F8F9FA` | `#161B22` |
| `--bg-sidebar` | `#0A1628` | `#0A1628` (always dark) |
| `--accent-blue` | `#1A73E8` | `#4D9FFF` |
| `--accent-green` | `#34A853` | `#4CAF50` |
| `--accent-amber` | `#FBBC04` | `#FFC107` |
| `--accent-red` | `#EA4335` | `#F44336` |
| `--accent-gold` | `#F9AB00` | `#FFD54F` |
| `--text-primary` | `#202124` | `#E6EDF3` |
| `--text-secondary` | `#5F6368` | `#8B949E` |
| `--border` | `#E0E0E0` | `#30363D` |
| `--sidebar-text` | `#C9D1D9` | `#C9D1D9` |

### 6.2 Layout Grid
```
┌──────────────┬──────────────────────────────────────────────────┐
│   SIDEBAR    │  TOPBAR (breadcrumb + search + theme toggle)      │
│   240px      ├──────────────────────────────────────────────────┤
│              │                                                    │
│  🌐 Logo     │  MAIN CONTENT AREA                                │
│  ─────────   │  (scrollable, 12-column CSS grid)                 │
│  STUDENT     │                                                    │
│  WORKSPACE   │                                                    │
│  ─────────   │                                                    │
│  LECTURER    │                                                    │
│  TOOLS       │                                                    │
│  ─────────   │                                                    │
│  COURSE      │                                                    │
│  CONTENT     │                                                    │
│  (week links)│                                                    │
│              │                                                    │
│  ─────────   │                                                    │
│  Theme Toggle│                                                    │
└──────────────┴──────────────────────────────────────────────────┘
```

### 6.3 Sidebar Navigation Structure
```
🌐 NetAdmin 360
━━━━━━━━━━━━━━━━━━━━━
STUDENT WORKSPACE
  ⬡  Dashboard
  ◎  Competency Radar
  ◈  Skill Tree
  ★  Skill Mastery
  ⌨  Cisco Analyzer
  ⬡  Virtual NOC
  ⚡ Missions
  ✓  Readiness Index
  ✦  Recommendations
  ⬡  Skill Passport

LECTURER TOOLS
  ⬡  Intelligence Dashboard
  ⬡  Class Heatmap
  ⚠  Interventions
  ⬡  CLO/PLO Attainment

COURSE CONTENT
  ○  Week 1 → Week 14
  ○  Assessments
  ○  CLO/PLO Map
━━━━━━━━━━━━━━━━━━━━━
  ☀ / ☾  Theme Toggle
```

### 6.4 Responsive Breakpoints
| Breakpoint | Behaviour |
|------------|-----------|
| ≥ 1280px | Full 240px sidebar + scrollable content |
| 768–1279px | Collapsible sidebar (hamburger button, overlaid) |
| < 768px | Bottom nav bar (5 key icons); sidebar via hamburger drawer |

### 6.5 Onboarding Flow (First Launch)
1. `na360/index.html` loads
2. `data-model.js` checks for `na360_student_profile` in localStorage
3. If absent → overlay modal appears: "Welcome to NetAdmin 360 — Enter your name to begin"
4. Student types name → stored → modal closes → Dashboard renders
5. Subsequent visits skip the modal entirely

---

## 7. Module Specifications

### Module 1 — Modern Student Dashboard
**Purpose:** Central hub showing overall progress, upcoming tasks, and quick-access metrics.

**Key UI Elements:**
- Welcome banner: "Welcome back, [Name] — STM31733 Network Administration"
- 4 stat cards: Current Week | Competency Score | Mastery Level | Readiness Index
- 14-week progress timeline (colour: grey=not started, amber=in-progress, green=done)
- Doughnut chart: Course completion %
- Recent activity feed (last 5 interactions with timestamps)
- Upcoming assessment countdown card
- Quick-launch grid (cards to all 9 other student modules)

**Data Sources:** `na360_progress`, `na360_competency`, `na360_student_profile`

---

### Module 2 — Network Competency Radar Chart
**Purpose:** Visualise student competency across 6 network administration domains.

**6 Competency Domains (mapped from course syllabus):**
| # | Domain | Course Units |
|---|--------|-------------|
| 1 | Network Administration Fundamentals | Unit 1.0 |
| 2 | Network Device Infrastructure | Unit 2.0 (VLAN, routing, server) |
| 3 | Network Configuration | Unit 3.0 (switch, router, DHCP, DNS) |
| 4 | Network Troubleshooting | Unit 3.6 |
| 5 | Network Monitoring & Security | Unit 4.0 (SNMP, SSH, tools) |
| 6 | Professional Practice & Communication | CLO3 (discussion, group work) |

**Key UI Elements:**
- Animated Chart.js radar chart: student (blue) vs target (green) vs class average (amber dashed)
- Domain breakdown cards (score + mastery badge per domain)
- Historical trend sparklines (last 4 sessions)
- Domain-specific advice callout below each card
- Export radar as PNG (Canvas toDataURL)

**Scoring:** Weighted average of quiz scores, lab scores, and mission completions per domain mapping in `competency-domains.json`.

---

### Module 3 — Interactive Network Skill Tree
**Purpose:** Visual, game-inspired skill progression map showing which skills are locked, in-progress, or mastered.

**Key UI Elements:**
- D3.js hierarchical tree graph (top-down layout, 4 unit branches)
- Node colour by mastery: grey=locked, red=novice, amber=developing, blue=competent, green=proficient, gold=expert
- Click node → side panel: skill name, unit, CLO, description, linked week, assessment, resources
- Filter by domain (dropdown)
- Zoom + pan (D3 zoom behaviour)
- Legend panel

**Skill Node Schema (skill-tree.json):**
```json
{
  "id": "vlan-config",
  "label": "VLAN Configuration",
  "domain": "Network Configuration",
  "unit": "3.2",
  "week": 6,
  "clo": "CLO2",
  "bloom": "P3",
  "prerequisites": ["vlan-concepts"],
  "mastery_level": 0
}
```

---

### Module 4 — Five-Level Skill Mastery System
**Purpose:** Explicitly model and display each student's mastery level per skill using a 5-level framework.

**5 Mastery Levels:**
| Level | Label | Colour | Score Criteria |
|-------|-------|--------|----------------|
| 0 | Not Started | Grey | No activity recorded |
| 1 | Novice | Red `#EA4335` | < 40% |
| 2 | Developing | Amber `#FBBC04` | 40–59% |
| 3 | Competent | Blue `#1A73E8` | 60–79% |
| 4 | Proficient | Green `#34A853` | 80–89% |
| 5 | Expert | Gold `#F9AB00` | ≥ 90% + at least 1 mission completed |

**Key UI Elements:**
- Full skill table (filterable by domain, by level)
- Mastery badge + progress bar per skill
- Level-up micro-animation (glow pulse) when threshold crossed
- Summary doughnut chart (distribution across all 6 states)
- Domain aggregation cards (average mastery per domain)

---

### Module 5 — Smart Cisco Configuration Analyzer
**Purpose:** Allow students to paste Cisco IOS configuration snippets and receive instant structured feedback mapped to CLO2.

**Key UI Elements:**
- Prism.js syntax-highlighted textarea (Cisco IOS language definition)
- Sample config loader (3 preset configs for practice)
- Analyse button → triggers deterministic rule engine
- Results panel: Score (0–100), issue list (error/warning/info), annotated config, CLO2 alignment tags
- Score history chart (last 5 analyses)

**Analysis Rule Categories (from course syllabus Unit 3.0):**
1. Initial device configuration (hostname, enable secret, password encryption, banner, VTY lines)
2. VLAN and trunk configuration (VLAN creation, port assignment, trunk mode)
3. Routing configuration (static routes, RIPv2 syntax, network commands)
4. DHCP configuration (pool, network, excluded, default-router)
5. DNS configuration (ip name-server, ip domain-name)
6. Security hardening (SSH enabled, Telnet disabled, service password-encryption)
7. Basic troubleshooting readiness (loopback interfaces, ip routing enabled)

---

### Module 6 — Virtual Network Operations Centre
**Purpose:** Provide an immersive simulated NOC environment aligned to Unit 1.3 (NOC functions & team roles).

**Key UI Elements:**
- Full-width dark NOC aesthetic (always dark regardless of global theme)
- Simulated network topology SVG (Kolej Komuniti Papar campus network)
- Status panels: Device Status | Interface Status | Alert Feed | Traffic Gauges
- Alert ticker cycling through 10+ predefined scenarios from `missions.json`
- Action buttons: Acknowledge / Escalate / Resolve
- Animated traffic gauges (CPU %, bandwidth %, memory % — seeded pseudo-random)
- Shift log (timestamped action history for current session)

**Note:** Prominent banner — "SIMULATION MODE — Synthetic Data Only"

---

### Module 7 — Interactive Troubleshooting Missions
**Purpose:** Guided, scenario-based troubleshooting challenges mapped to CLO2 and Unit 3.6.

**Mission Flow:**
```
Mission Select → Scenario Brief → Topology Diagram → Step Tasks → Hints → Debrief
```

**6 Mission Categories (from syllabus):**
1. Basic Connectivity (ping, traceroute, ipconfig — Unit 3.6)
2. VLAN and Trunking Faults (Unit 3.2)
3. Routing Misconfiguration (Static / RIPv2 — Units 3.3)
4. DHCP / DNS Failures (Units 3.4, 3.5)
5. Security and Access Issues (SSH, ACL, password — Unit 3.1)
6. Network Monitoring Faults (SNMP, NetFlow — Unit 4.2)

**Mission Schema (missions.json):**
```json
{
  "id": "M001",
  "title": "VLAN Trunk Not Forming",
  "category": "VLAN and Trunking Faults",
  "clo": "CLO2",
  "unit": "3.2",
  "difficulty": 2,
  "steps": [
    {
      "instruction": "Verify trunk status on Sw1 Gi0/1",
      "expected_command": "show interfaces trunk",
      "hint": "Use show interfaces trunk on the switch",
      "hint_penalty": 5
    }
  ],
  "debrief": "Trunk was set to access mode on Sw1..."
}
```

---

### Module 8 — Final Assessment Readiness Index
**Purpose:** Provide a composite, transparent readiness score aligned to the course's 70%CA + 30%FA structure.

**Readiness Index Formula (matches course assessment weightings):**
```
RI = (0.15 × TestScore) + (0.45 × Practical1Score) + (0.30 × Practical2Score)
   + (0.10 × PresentationScore)

Scaled 0–100. Component weights mirror official CA structure.
```

**Readiness Bands:**
| Band | Range | Colour | Advice |
|------|-------|--------|--------|
| Critical | 0–39 | Red | Immediate lecturer intervention recommended |
| Developing | 40–59 | Amber | Targeted revision of weak CLOs needed |
| Ready | 60–79 | Blue | Consolidate weak areas before FA |
| Confident | 80–89 | Green | Light review only |
| Exam-Ready | 90–100 | Gold | Proceed with confidence |

**Key UI Elements:**
- Large RI gauge (semi-circular dial, animated)
- Component breakdown table (each weight shown transparently)
- Band-coloured advice banner with top-3 improvement actions
- Trend chart (RI history over sessions)
- CLO attainment sub-scores per component

---

### Module 9 — Personalised Learning Recommendations
**Purpose:** Deliver targeted, algorithm-driven study recommendations based on the student's competency profile.

**Recommendation Algorithm (Deterministic):**
1. Rank 6 domains by ascending score (weakest first)
2. For top-3 weakest domains, retrieve associated weeks from `course-structure.json`
3. For each week, retrieve associated missions from `missions.json`
4. Sort recommendations by: CLO impact weight → upcoming assessment proximity → mastery gap size
5. Output: Top 5 priority action cards

**Each Recommendation Card Contains:**
- Priority badge (High / Medium / Low)
- Action: "Revise [Topic]" / "Complete [Mission]" / "Retry [Quiz]"
- Reason: "Your [Domain] score is [X]% — below the Competent threshold of 60%"
- Resource link: Direct link to the correct week page or mission
- CLO tag

**Phase 2 hook:** Replace step 1–5 with IBM watsonx.ai LLM call via `watsonx-adapter.js`.

---

### Module 10 — Digital Network Skill Passport
**Purpose:** A shareable, achievement-based digital credential summarising the student's competency journey.

**Badge Criteria (6 domain badges + 4 special badges):**
| Badge | Trigger |
|-------|---------|
| Network Admin Fundamentals | Domain 1 score ≥ 80% |
| Infrastructure Specialist | Domain 2 score ≥ 80% |
| Network Configuration Expert | Domain 3 score ≥ 80% |
| Troubleshooter Pro | Domain 4 score ≥ 80% + 2 missions done |
| Monitoring & Security Analyst | Domain 5 score ≥ 80% |
| Professional Communicator | CLO3 presentation score ≥ 80% |
| Mission Commander | 5+ missions completed at ≥ 80% |
| Cisco Config Analyst | 10+ configs analysed, avg ≥ 75% |
| Course Completer | All 14 weeks visited + all assessments entered |
| NetAdmin 360 Graduate | All 9 domain/special badges earned |

**Key UI Elements:**
- Passport card UI (styled certificate, Kolej Komuniti Papar header + crest)
- Student name + cohort + semester + year
- Earned badge grid (greyed-out for unearned)
- Achievement timeline (chronological milestones)
- Print/Save PDF (window.print() with print-only CSS)
- Share link (encodes badge list + scores as Base64 URL hash — no PII)

---

### Module 11 — Lecturer Intelligence Dashboard
**Purpose:** Provide the lecturer (Jusdy bin Juwait) with an at-a-glance class overview using synthetic demo data.

**Key UI Elements:**
- Persistent banner: "⚠ SYNTHETIC DATA — DEMONSTRATION MODE ONLY"
- Class summary: 25 students | Avg RI | Avg Competency | At-Risk Count
- Class competency radar (class average overlaid on target)
- Weekly engagement bar chart (% of students completing each of 14 weeks)
- Assessment score distribution (bar chart: Test, P1, P2, Presentation)
- Top-5 at-risk student panel (name, RI, primary weak domain, risk flag count)
- Module usage stats (which modules are most used)

---

### Module 12 — Class Competency Heatmap
**Purpose:** Visualise per-student, per-domain competency as a colour-coded grid for rapid class diagnosis.

**Key UI Elements:**
- Table grid: 25 rows (students) × 7 columns (6 domains + Overall)
- Cell colour: Red (<40%), Amber (40–59%), Blue (60–79%), Green (80%+)
- Sort by: student name, overall score, any domain column
- Filter: At-risk only | Above average only | By domain
- Click cell → drilldown: student detail modal (all scores + RI)
- Export CSV button

---

### Module 13 — Early Intervention Analytics
**Purpose:** Automatically surface at-risk students and suggest intervention strategies before under-performance becomes critical.

**At-Risk Criteria (any one flag triggers at-risk status):**
| Flag | Threshold |
|------|-----------|
| Low RI | RI < 50 |
| Domain failure risk | Any domain score < 40% |
| Assessment gap | Any CA component score not entered after deadline week |
| Low mission engagement | Mission completion rate < 30% |
| Inactivity | No localStorage activity for 7+ simulated days |

**Risk Severity:**
| Level | Flags Active | Action |
|-------|-------------|--------|
| Low | 1 flag | Monitor |
| Medium | 2 flags | Contact student |
| High | 3 flags | Scheduled counselling |
| Critical | 4–5 flags | Immediate escalation |

**Key UI Elements:**
- At-risk student list with risk level badges + flag tags
- Recommended intervention per student (based on dominant flag)
- Intervention log (lecturer enters action notes → stored in localStorage)
- Week-by-week engagement drop-off line chart
- Alert thresholds configuration panel (adjustable in-browser)

---

### Module 14 — CLO/PLO Attainment and CQI Dashboard
**Purpose:** Map all assessment results to the 3 official CLOs and relevant PLOs for formal quality reporting.

**Official CLO Targets:**
| CLO | Target | Assessment Source |
|-----|--------|-------------------|
| CLO1 | ≥ 80% of students achieve ≥ 60% | Test score |
| CLO2 | ≥ 80% of students achieve ≥ 60% | Practical 1 + Practical 2 avg |
| CLO3 | ≥ 80% of students achieve ≥ 60% | Presentation/Discussion score |

**Key UI Elements:**
- CLO attainment table: CLO | Target | Achieved % | Status (Met/Not Met)
- PLO rollup table: PLO1, PLO3, PLO8 — attainment derived from mapped CLOs
- Bloom's Taxonomy level tags (C3/P3/A2) per CLO
- CQI gap table: CLOs below target → auto-generated suggested actions
- Export print-ready A4 table (print CSS)
- Semester comparison stub (ready for Phase 2 multi-semester data)

---

## 8. Competency Scoring Methodology

### 8.1 Input Sources and Weights
| Input | Weight | How Captured |
|-------|--------|--------------|
| Test score (CA1) | 15% | Manual score entry by student (0–100) |
| Practical 1 score (CA2) | 45% | Manual score entry by student (0–100) |
| Practical 2 / Final Assessment score | 30% | Manual score entry by student (0–100) |
| Presentation/Discussion score (CA3) | 10% | Manual score entry by student (0–100) |

> Weights mirror the official course assessment structure exactly.

### 8.2 Domain Score Calculation
```
DomainScore(d) = Σ (InputScore(i) × Weight(i)) for all inputs i mapped to domain d
                 ─────────────────────────────────────────────────────────────────
                              Σ Weight(i) for all i mapped to domain d
```

Mapping defined per week in `course-structure.json` and per domain in `competency-domains.json`.

### 8.3 Overall Competency Score
```
OverallCompetency = Σ (DomainScore(d) × DomainWeight(d)) for all 6 domains
```
Domain weights: Domains 1–5 each = 18%, Domain 6 (Professional Practice) = 10%.

### 8.4 Readiness Index (matches official CA weighting)
```
RI = (0.15 × Test) + (0.45 × Practical1) + (0.30 × Practical2/FA) + (0.10 × Presentation)
```

### 8.5 Mission Bonus
Mission completions contribute a +5% bonus per completed mission (capped at +10%) applied
to the mapped domain score only.

### 8.6 Determinism Guarantee
- All algorithms use only stored scores as input
- No random numbers in score calculations
- Same inputs always produce identical outputs
- All weights are displayed transparently in the UI

---

## 9. Data Model

### 9.1 localStorage Keys
```
na360_student_profile     JSON  { id, name, cohort, semester, year, enrollDate }
na360_progress            JSON  { week1: { visited, quiz_score, lab_score, completed }, … }
na360_scores              JSON  { test: 0, practical1: 0, practical2: 0, presentation: 0 }
na360_competency          JSON  { domain1: { score, level, history: [] }, … }
na360_missions            JSON  { [mission_id]: { attempts, best_score, completed, timestamp } }
na360_cisco_history       JSON  [ { timestamp, config_hash, score, issues_count } ]
na360_readiness           JSON  [ { timestamp, ri_score, components } ]
na360_passport            JSON  { badges: [], achievements: [], generated_at }
na360_theme               String 'dark' | 'light'
na360_lect_interventions  JSON  [ { student_id, action, timestamp, note } ]
na360_vnoc_log            JSON  [ { timestamp, alert_id, action } ]
```

### 9.2 course-structure.json Schema (3 CLOs, 4 Units, 14 Weeks)
```json
{
  "course": {
    "code": "STM31733",
    "title": "Network Administration",
    "credit": 3,
    "semester": 3,
    "year": 2,
    "lecturer": "Jusdy bin Juwait",
    "institution": "Kolej Komuniti Papar"
  },
  "clos": [
    {
      "id": "CLO1",
      "description": "Identify the concepts of network administration in managing network environment",
      "bloom": "C3",
      "domain": "Cognitive",
      "plo": "PLO1",
      "assessment": "test",
      "weight": 0.15
    },
    {
      "id": "CLO2",
      "description": "Implement basic configuration for network devices in network environment",
      "bloom": "P3",
      "domain": "Psychomotor",
      "plo": "PLO3",
      "assessment": ["practical1", "practical2"],
      "weight": 0.75
    },
    {
      "id": "CLO3",
      "description": "Perform group discussion in network monitoring traffic by using related software",
      "bloom": "A2",
      "domain": "Affective",
      "plo": "PLO8",
      "assessment": "presentation",
      "weight": 0.10
    }
  ],
  "plos": [
    { "id": "PLO1", "description": "Knowledge" },
    { "id": "PLO3", "description": "Practical Skills" },
    { "id": "PLO8", "description": "Communication Skills" }
  ],
  "weeks": [
    {
      "week": 1,
      "title": "Introduction to Network Administration",
      "unit": "1.0",
      "subtopics": ["1.1 Basic knowledge of network administration",
                    "1.2 Tasks in network administration",
                    "1.3 NOC functions and team roles",
                    "1.4 Best practices"],
      "clos": ["CLO1"],
      "domains": ["Network Administration Fundamentals"],
      "has_quiz": true,
      "has_lab": false,
      "url": "../../week1/index.html"
    }
  ]
}
```

### 9.3 synthetic-class.json Schema
```json
{
  "_meta": {
    "data_type": "SYNTHETIC — FOR DEMONSTRATION ONLY",
    "warning": "This data does not represent any real student",
    "generated": "2026-11",
    "student_count": 25,
    "course": "STM31733"
  },
  "students": [
    {
      "id": "S001",
      "name": "Ahmad Firdaus bin Abdullah",
      "ri": 72,
      "scores": { "test": 68, "practical1": 74, "practical2": 70, "presentation": 80 },
      "competency": {
        "domain1": 68, "domain2": 74, "domain3": 71,
        "domain4": 60, "domain5": 55, "domain6": 80
      },
      "weeks_completed": 10,
      "missions_completed": 3,
      "at_risk": false,
      "risk_flags": []
    }
  ]
}
```

---

## 10. Implementation Roadmap — 21 Sub-tasks

### Phase 1A — Foundation (ST-01 to ST-04)
Establish structural shell, design system, core engine, and navigation.

| ID | Sub-task | Intent |
|----|----------|--------|
| ST-01 | Existing file audit + data extraction | Clone repo, audit all files, build `course-structure.json` and `clo-plo-matrix.json` from live content |
| ST-02 | Design system + layout shell | Create `na360/css/` files; build sidebar, topbar, responsive grid |
| ST-03 | Core JS engine layer | Build `competency-engine.js`, `data-model.js`, `router.js`, `theme.js`, `event-bus.js` |
| ST-04 | na360 app shell + router | Build `na360/index.html` with onboarding modal, test routing |

### Phase 1B — Student Modules (ST-05 to ST-14)

| ID | Module | Key Dependency |
|----|--------|----------------|
| ST-05 | Module 1: Student Dashboard | ST-04 |
| ST-06 | Module 2: Competency Radar | ST-03, Chart.js |
| ST-07 | Module 3: Skill Tree | ST-03, D3.js, skill-tree.json |
| ST-08 | Module 4: Skill Mastery | ST-06 |
| ST-09 | Module 5: Cisco Analyzer | ST-04, Prism.js, cisco-templates.json |
| ST-10 | Module 6: Virtual NOC | ST-04, missions.json |
| ST-11 | Module 7: Troubleshooting Missions | ST-03, missions.json |
| ST-12 | Module 8: Readiness Index | ST-03, all score sources |
| ST-13 | Module 9: Recommendations | ST-12, course-structure.json |
| ST-14 | Module 10: Skill Passport | ST-06, ST-07, ST-08 |

### Phase 1C — Lecturer Modules (ST-15 to ST-18)

| ID | Module | Key Dependency |
|----|--------|----------------|
| ST-15 | Module 11: Lecturer Dashboard | synthetic-class.json |
| ST-16 | Module 12: Class Heatmap | ST-15 |
| ST-17 | Module 13: Intervention Analytics | ST-15 |
| ST-18 | Module 14: CLO/PLO Attainment | ST-01, clo-plo-matrix.json, ST-15 |

### Phase 1D — Integration and Deployment (ST-19 to ST-21)

| ID | Sub-task | Intent |
|----|----------|--------|
| ST-19 | Responsive CSS pass | Tablet (768px) and mobile (375px) breakpoints across all modules |
| ST-20 | Dark/light mode polish + accessibility | WCAG 2.1 AA colour contrast check, keyboard nav, focus rings |
| ST-21 | GitHub Actions deploy + README | deploy.yml, README with na360 usage guide, Lighthouse audit |

### Phase 2 (Future, out of scope)
- Supabase integration via `supabase-adapter.js` (real student auth + data sync)
- IBM watsonx.ai recommendations via `watsonx-adapter.js`
- Real lecturer data feed (replace synthetic JSON)
- Packet Tracer grade webhook integration

---

## 11. Testing and Deployment Strategy

### 11.1 Testing Approach
| Type | Method | Target |
|------|--------|--------|
| Unit | Console test harness for `competency-engine.js` | 100% formula coverage |
| Integration | Click-through each module in Chrome and Firefox | No broken links |
| Responsive | Chrome DevTools: 1280px, 768px, 375px | All layouts render correctly |
| Theme | Toggle dark/light on every module page | No colour contrast failures |
| Accessibility | Lighthouse accessibility audit | ≥ 90 score |
| Performance | Lighthouse performance audit | ≥ 85 score |
| Cross-origin | Verify existing week1–14 links work from GitHub Pages | 200 OK on all week links |
| localStorage | Test with empty storage, partial data, corrupt data | Graceful fallback always |

### 11.2 GitHub Actions Deploy Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### 11.3 Netlify Compatibility
- All new content lives under `/na360/` — no interference with existing routes
- Existing `index.html` and `week*` paths continue to work on Netlify unchanged
- Add `/na360/ /na360/index.html 200` to `_redirects` if needed

### 11.4 Branch Strategy
```
main        → production (auto-deploys to gh-pages + Netlify)
develop     → active development
feature/*   → one branch per module
```

---

## 12. Security and Privacy Considerations

| Risk | Mitigation |
|------|-----------|
| Student PII exposure | Only name + cohort stored; no IC, email, or password ever collected |
| API key in source | No API keys exist in Phase 1; Phase 2 keys via GitHub Actions secrets only |
| Synthetic data confusion | `_meta.data_type` field + persistent red UI banner on all lecturer views |
| XSS in Cisco config input | Input sanitised via `textContent` setter; Prism.js renders in pre/code only |
| Passport share link | Encodes only scores/badge IDs as Base64; no name or IC in URL |
| GitHub Pages HTTPS | Automatically enforced by GitHub Pages |
| localStorage size | 5MB browser limit; `data-model.js` checks size before write; graceful clear if full |
| PDPA Malaysia compliance | No real student data transmitted or stored server-side in Phase 1 |
| Course document confidentiality | PDF marked RESTRICTED — not included in repository |

---

## 13. Acceptance Criteria

### Cross-Cutting (applies to all modules)
- [ ] Dark/light mode toggle works on all 14 module pages without page reload
- [ ] All existing Week 1–14 sidebar links open correct pages
- [ ] Lighthouse Performance ≥ 85 on GitHub Pages
- [ ] Lighthouse Accessibility ≥ 90 on GitHub Pages
- [ ] No JS console errors on first load of any module page
- [ ] localStorage handles missing/corrupt data gracefully (no white screen)
- [ ] All pages pass W3C HTML5 validation
- [ ] Responsive layout correct at 1280px, 768px, 375px viewports

### Module-Level Criteria

**M1 — Dashboard**
- [ ] Displays student name from localStorage on every visit
- [ ] 14-week timeline tiles render with correct colour by completion status
- [ ] Competency score, Mastery level, and RI cards show correct computed values
- [ ] Quick-launch cards navigate to all 9 modules without 404

**M2 — Competency Radar**
- [ ] Chart.js radar renders with all 6 axes correctly labelled
- [ ] Student/target/class-average overlays all visible and togglable
- [ ] Export as PNG produces a valid download
- [ ] Domain breakdown cards show correct scores and mastery badges

**M3 — Skill Tree**
- [ ] D3.js graph renders all skill nodes and prerequisite edges
- [ ] Clicking a node opens detail panel with correct CLO and week data
- [ ] Locked vs unlocked nodes are visually distinct
- [ ] Zoom and pan work on both mouse and touch

**M4 — Skill Mastery**
- [ ] All 5 mastery levels display with correct colour coding
- [ ] Table filter by domain and level works without JS errors
- [ ] Level-up animation fires when score crosses a threshold
- [ ] Doughnut chart shows correct distribution across all 6 states

**M5 — Cisco Analyzer**
- [ ] Valid baseline config scores ≥ 70 with no false error flags
- [ ] Config missing `enable secret` triggers rule R001 (error severity)
- [ ] All 7 rule categories produce at least one rule each
- [ ] Prism.js syntax highlighting renders without breaking layout

**M6 — Virtual NOC**
- [ ] Dashboard loads in dark NOC aesthetic
- [ ] Alert ticker cycles through ≥ 10 predefined alerts
- [ ] Acknowledge / Resolve / Escalate buttons update shift log correctly
- [ ] "SIMULATION MODE" banner is always visible

**M7 — Missions**
- [ ] ≥ 6 missions available across all 6 categories
- [ ] Progressive hint system deducts 5 points per hint correctly
- [ ] Debrief screen shows score, CLO map, and correct answer walkthrough
- [ ] Completed mission status persists across browser refresh

**M8 — Readiness Index**
- [ ] RI formula produces consistent result for identical inputs
- [ ] All 4 component weights displayed transparently and sum to 1.0
- [ ] RI trend chart shows historical values across sessions
- [ ] Advice banner text matches the computed RI band

**M9 — Recommendations**
- [ ] At least 5 personalised cards generated from competency profile
- [ ] Each card links to the correct existing week page
- [ ] Marking a card done updates the display in the same session
- [ ] Filtering by domain shows only domain-relevant recommendations

**M10 — Skill Passport**
- [ ] All earned badges display; unearned badges are visually greyed out
- [ ] Print function triggers browser print dialog with clean print CSS
- [ ] Share URL encodes passport data without including student real name
- [ ] Institution name and course code appear correctly on passport card

**M11 — Lecturer Dashboard**
- [ ] "SYNTHETIC DATA — DEMO MODE" banner is always visible at top
- [ ] At-risk count matches students with RI < 50 in synthetic data
- [ ] All 4 chart types render without errors in both themes
- [ ] Class competency radar overlays correctly

**M12 — Class Heatmap**
- [ ] All 25 synthetic students render in the grid
- [ ] Cell colours match defined score threshold ranges
- [ ] Sorting by any column reorders correctly
- [ ] CSV export contains correct headers and all 25 student rows

**M13 — Intervention Analytics**
- [ ] At-risk students correctly identified by all 5 flag criteria
- [ ] Risk level badge matches number of active flags per student
- [ ] Intervention log entries persist across page refresh
- [ ] Engagement drop-off chart reflects synthetic data trends

**M14 — CLO/PLO Attainment**
- [ ] All 3 official CLOs display with correct bloom level and PLO mapping
- [ ] Attainment % calculated correctly from synthetic class scores
- [ ] CLOs below target threshold highlighted in CQI gap table
- [ ] Print CSS produces clean, readable A4 output

---

## 14. Sub-Task Reference Table (for Agent Mode)

| ID | Title | Phase | Status |
|----|-------|-------|--------|
| ST-01 | Existing file audit + data extraction | 1A | [ ] pending |
| ST-02 | Design system + layout shell | 1A | [ ] pending |
| ST-03 | Core JS engine layer | 1A | [ ] pending |
| ST-04 | na360 app shell + router | 1A | [ ] pending |
| ST-05 | Module 1: Student Dashboard | 1B | [ ] pending |
| ST-06 | Module 2: Competency Radar | 1B | [ ] pending |
| ST-07 | Module 3: Skill Tree | 1B | [ ] pending |
| ST-08 | Module 4: Skill Mastery | 1B | [ ] pending |
| ST-09 | Module 5: Cisco Analyzer | 1B | [ ] pending |
| ST-10 | Module 6: Virtual NOC | 1B | [ ] pending |
| ST-11 | Module 7: Troubleshooting Missions | 1B | [ ] pending |
| ST-12 | Module 8: Readiness Index | 1B | [ ] pending |
| ST-13 | Module 9: Recommendations | 1B | [ ] pending |
| ST-14 | Module 10: Skill Passport | 1B | [ ] pending |
| ST-15 | Module 11: Lecturer Dashboard | 1C | [ ] pending |
| ST-16 | Module 12: Class Heatmap | 1C | [ ] pending |
| ST-17 | Module 13: Intervention Analytics | 1C | [ ] pending |
| ST-18 | Module 14: CLO/PLO Attainment | 1C | [ ] pending |
| ST-19 | Responsive CSS pass | 1D | [ ] pending |
| ST-20 | Dark/light mode polish + accessibility | 1D | [ ] pending |
| ST-21 | GitHub Actions deploy + README | 1D | [ ] pending |
