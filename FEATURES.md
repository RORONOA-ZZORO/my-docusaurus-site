# Reference Library - Monorepo Features & Requirements

## Overview
A documentation website (Docusaurus) with an offline mobile companion app (Flutter) for BCA students.

---

## Website (`/website`)
- **Platform:** Docusaurus 3.x
- **Content:** MDX docs in `/website/docs/` organized by semester/subject
- **Structure:** Semester → Subject → Content (Handout, Notes, Assignments, etc.)

---

## Mobile App (`/apps/mobile`)

### Core Architecture
- **Framework:** Flutter 3.27+
- **State Management:** Riverpod 3.x
- **Navigation:** GoRouter
- **Local Storage:** path_provider + File I/O

### User Experience
- **Entry Point:** Homepage with welcome message + semester cards
- **Navigation:** Hamburger menu → Drawer with full doc tree
- **Content Display:** WebView loading local HTML files
- **Back Navigation:** Web history (not app navigator)

### Pack System
- **Storage:** `<app_data>/packs/current/` (atomic swap with backup)
- **Manifest:** `index.json` with docs map, tree structure
- **Download:** GitHub Releases API → ZIP → extract

### Key Screens
| Screen | Purpose |
|--------|---------|
| PackGateScreen | Entry: checks pack, shows download if missing |
| LibraryScreen | Main UI: WebView + Drawer navigation |
| SettingsScreen | Pack management: update/delete options |

---

## Content Build Pipeline (`/content_build`)

### Scripts
| Script | Description |
|--------|-------------|
| `build_pack.js` | Orchestrates full build pipeline |
| `export_docs.js` | Converts Docusaurus HTML → cleaned app HTML |
| `generate_manifest.js` | Creates `index.json` manifest |
| `generate_hubs.js` | Auto-generates hub pages (homepage, semester, subject) |

### Generated Files
- `content/docs/*.html` - Cleaned HTML for each doc
- `content/docs/homepage.html` - Welcome page with semester cards
- `content/docs/s*_hub.html` - Semester hubs
- `content/docs/s*_*_hub.html` - Subject hubs
- `content/index.json` - Manifest

### Registry (`doc_registry.json`)
Maps source MDX files to stable docIds with metadata:
- `docId`: Stable identifier
- `source`: Path to original MDX
- `category`: handout, notes, unit, etc.
- `semester`, `subject`, `isHub`

---

## CI/CD (`.github/workflows/`)

### release_pack.yml
- **Trigger:** Manual dispatch or `pack-v*` tag
- **Steps:** Build Docusaurus → Export docs → Generate pack → Upload to GitHub Release
- **Output:** `release_pack_<version>.zip` + `index.json`

---

## Key Design Decisions

### Offline-First
- Content pack downloaded once, stored locally
- All navigation via `app://doc/<docId>` links
- No network required after initial download

### Asset Strategy
- Assets (CSS/JS/images) bundled with app
- Content pack only includes HTML docs + manifest
- Pack size: ~300 KB

### Hub Pages
- Auto-generated during build
- Cards link to children via `app://doc/` scheme
- Consistent styling across all hubs

### Tree Structure
- Parents have `hubDocId` (opens hub on tap)
- Leaves have `docId` (opens content)
- Index pages hidden from navigation

---

## Development Commands

```bash
# Website
cd website && npm run start  # Dev server
cd website && npm run build  # Production build

# Content Pack
cd content_build && node build_pack.js         # Full build
cd content_build && node build_pack.js --skip-build  # Skip Docusaurus

# Mobile App
cd apps/mobile && flutter run -d emulator
cd apps/mobile && flutter test
cd apps/mobile && flutter analyze lib/
```

---

## Version History
- **v2026.01.15:** UX Overhaul - Homepage + Drawer navigation
- **v2026.01.14:** Automation Level 2 - Hub generation
- **v2026.01.13:** Initial content pack system
