# STM31733 Network Administration — NetAdmin 360

> **Intelligent Network Competency Platform**  
> Kolej Komuniti Papar · Semester 3, Year 2  
> Lecturer: Jusdy bin Juwait

---

## 🌐 Live Deployments

| Deployment | URL |
|------------|-----|
| GitHub Pages | https://joejusdy.github.io/STM31733/ |
| Netlify | https://31733.netlify.app/ |
| NetAdmin 360 (GitHub Pages) | https://joejusdy.github.io/STM31733/na360/ |

---

## 📋 Course Overview

| Item | Detail |
|------|--------|
| Course Code | STM31733 |
| Course Name | Network Administration |
| Credit | 3 |
| Semester | Semester 3, Year 2 |
| Session | I 2025/2026 |
| Tools | Cisco Packet Tracer, Network Switch, Router |

### Course Learning Outcomes (CLOs)

| CLO | Description | Bloom | PLO | Assessment |
|-----|-------------|-------|-----|------------|
| CLO1 | Identify the concepts of network administration in managing network environment | C3 | PLO1 | Test (15%) |
| CLO2 | Implement basic configuration for network devices in network environment | P3 | PLO3 | Practical (45% + 30%) |
| CLO3 | Perform group discussion in network monitoring traffic by using related software | A2 | PLO8 | Presentation (10%) |

---

## 🚀 NetAdmin 360 Platform

NetAdmin 360 is a professional, intelligent, competency-based learning platform built on top of this course content. It provides:

### Student Modules (10)
| # | Module | Description |
|---|--------|-------------|
| 1 | 🏠 Dashboard | Central hub — progress, stats, quick launch |
| 2 | 🎯 Competency Radar | 6-domain Chart.js radar chart |
| 3 | 🌳 Skill Tree | D3.js interactive skill progression map |
| 4 | ⭐ Skill Mastery | 5-level mastery system (Novice → Expert) |
| 5 | 🖥 Cisco Analyzer | Rule-based IOS configuration feedback |
| 6 | 📡 Virtual NOC | Simulated Network Operations Centre |
| 7 | ⚡ Missions | 12 guided troubleshooting scenarios |
| 8 | ✅ Readiness Index | Composite assessment readiness gauge |
| 9 | 💡 Recommendations | Personalised study recommendations |
| 10 | 🏅 Skill Passport | Printable digital competency credential |

### Lecturer Modules (4)
| # | Module | Description |
|---|--------|-------------|
| 11 | 📊 Intelligence Dashboard | Class overview with synthetic data |
| 12 | 🌡 Class Heatmap | Per-student, per-domain colour grid |
| 13 | ⚠ Interventions | At-risk analytics and intervention log |
| 14 | 📋 CLO/PLO Attainment | CQI attainment report |

---

## 🛠 Technology Stack

| Concern | Technology |
|---------|-----------|
| Hosting | GitHub Pages + Netlify (static) |
| Markup | HTML5 |
| Styling | Vanilla CSS with CSS Custom Properties |
| Scripting | Vanilla ES6+ JS (ES Modules) |
| Charts | Chart.js v4 (CDN) |
| Skill Tree | D3.js v7 (CDN) |
| Icons | Phosphor Icons (CDN) |
| Fonts | Inter (Google Fonts CDN) |
| CLI Highlighting | Prism.js (CDN) |
| Storage | localStorage (no server required) |
| CI/CD | GitHub Actions → gh-pages branch |

---

## 📁 Project Structure

```
STM31733/
├── index.html                  ← Course landing page
├── week1/ … week14/            ← Weekly lesson content
│
├── na360/                      ← NetAdmin 360 Platform
│   ├── index.html              ← App shell (sidebar layout)
│   ├── core/                   ← Core JS engines
│   │   ├── competency-engine.js
│   │   ├── data-model.js
│   │   ├── router.js
│   │   ├── theme.js
│   │   └── event-bus.js
│   ├── student/                ← 10 student module pages
│   ├── lecturer/               ← 4 lecturer module pages
│   ├── data/                   ← JSON data files
│   └── css/                    ← Design system CSS
│
├── .github/workflows/
│   └── deploy.yml              ← Auto-deploy to GitHub Pages
└── README.md
```

---

## 🔒 Privacy and Data Notes

- **No real student data is stored server-side.** All student progress is stored in the browser's `localStorage`.
- **Lecturer analytics use clearly labelled synthetic data.** The `synthetic-class.json` file contains fabricated student data for demonstration purposes only. A persistent banner displays on all lecturer views.
- **No API keys** are required or included in this repository.
- **PDPA Malaysia compliant** at Phase 1 scope — no personal data is transmitted.

---

## 🚀 Deployment

The project deploys automatically to GitHub Pages on every push to `main`:

```
Push to main → GitHub Actions → Deploy to gh-pages branch
```

**To deploy manually:**
```bash
git add .
git commit -m "Update content"
git push origin main
```

The platform will be live at `https://joejusdy.github.io/STM31733/na360/` within 2 minutes.

---

## 🔮 Phase 2 Roadmap

Future enhancements (not yet activated):

- **Supabase integration** — real student authentication and data persistence (`na360/integrations/supabase-adapter.js`)
- **IBM watsonx.ai recommendations** — AI-powered personalised study plans (`na360/integrations/watsonx-adapter.js`)
- **Multi-semester CLO/PLO comparison** — trend analysis across academic sessions
- **Packet Tracer grade webhook** — automatic lab score capture

---

## 📄 Licence

© 2025 Kolej Komuniti Papar. All rights reserved.  
Course content is restricted — DOKUMEN TERHAD KURIKULUM JPPKK.
