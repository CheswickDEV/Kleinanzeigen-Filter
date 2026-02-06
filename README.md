# 🛡️ Kleinanzeigen Filter

### A Firefox extension that reveals seller registration dates on Kleinanzeigen.de and lets you filter out freshly created accounts — your first line of defense against bots and scalpers.

[![GitHub Stars](https://img.shields.io/github/stars/CheswickDEV/Kleinanzeigen-Filter?color=00d4ff&labelColor=16161f)](https://github.com/CheswickDEV/Kleinanzeigen-Filter)
[![Last Commit](https://img.shields.io/github/last-commit/CheswickDEV/Kleinanzeigen-Filter?color=a855f7&labelColor=16161f)](https://github.com/CheswickDEV/Kleinanzeigen-Filter/commits/main)
![Version](https://img.shields.io/badge/version-1.1.0-00d4ff?labelColor=16161f)
![Status](https://img.shields.io/badge/status-Active-00d4ff?labelColor=16161f)
![License](https://img.shields.io/badge/license-MIT-a855f7?labelColor=16161f)
![Firefox](https://img.shields.io/badge/Firefox-Manifest_v2-a855f7?logo=firefox&logoColor=white&labelColor=16161f)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-00d4ff?logo=javascript&logoColor=white&labelColor=16161f)

---

## 💡 What It Does

Kleinanzeigen.de doesn't show you how long a seller has been on the platform — you have to click every single profile to find out. This extension fixes that by:

1. Fetching seller profile data in the background for every listing in your search results
2. Displaying a **"Member since"** badge directly in each listing card
3. Letting you set a **cutoff date** — any seller who registered *after* that date gets hidden automatically

Set the filter to "01.01.2024" and instantly see only listings from established sellers. Freshly created throwaway accounts (often bots, scalpers, or scammers) disappear from your results.

---

<!-- Screenshots — replace with actual screenshots when available -->
<!--
## 📸 Screenshots

| Dashboard | Inline Badges |
|:---------:|:------------:|
| <img src="docs/assets/dashboard.png" width="280"> | <img src="docs/assets/list-view.png" width="280"> |

---
-->

## ⚡ Features

- **📅 Time Travel Filter** — Set a registration date threshold via the HUD dashboard. Listings from sellers who joined after that date are automatically hidden. Perfect for filtering out bot waves that appear after product launches.

- **👁️ Instant Insights** — A `👤 Since: DD.MM.YYYY` badge appears next to every listing without clicking into profiles. Profile data is fetched asynchronously in the background.

- **💾 Smart Caching** — Seller profiles are cached in localStorage to minimize requests. Return visits to the same search results load instantly.

- **⚠️ Warning System** — Profiles that can't be read or return unexpected data are flagged with a yellow warning icon so you know which listings need manual review.

- **🎨 Dark Mode Dashboard** — A floating HUD overlays the search results with a dark theme, neon accents, glassmorphism effects, and subtle glow animations.

---

## 🚀 Quick Start

### Prerequisites

- Firefox (any recent version)

###  Installation

1. Open [Link](https://addons.mozilla.org/de/firefox/addon/kleinanzeigen-filter/) in Firefox
2. Click "Install"

###  Installation without Firefox Store

1. Rename the `.zip` file to `.xpi`
2. In Firefox → Menu → Add-ons and Themes
3. Gear icon → "Install Add-on From File..."
4. Select the `.xpi` file

3. **Open Kleinanzeigen.de** — the dashboard and inline badges appear automatically on search results pages

---

## 📖 Usage

1. Open any search results page on [kleinanzeigen.de](https://www.kleinanzeigen.de)
2. The floating **dashboard panel** appears in the top area of the page
3. Set your desired cutoff date (e.g. `01.01.2023`)
4. Listings from sellers who registered **after** that date are faded out or hidden
5. Each listing shows a **"👤 Since: DD.MM.YYYY"** badge with the seller's registration date

---

## 🛠️ Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-16161f?logo=javascript&logoColor=00d4ff)
![CSS](https://img.shields.io/badge/CSS3-16161f?logo=css3&logoColor=00d4ff)
![Firefox](https://img.shields.io/badge/WebExtensions_API-16161f?logo=firefox&logoColor=a855f7)

```
Kleinanzeigen-Filter/
├── manifest.json       # Extension manifest (v2)
├── content.js          # Core logic: profile fetching, filtering, badge injection
├── content.css         # Inline badge and dashboard styling
├── background.js       # Background script
└── README.md
```

- **JavaScript** (~65%) — Content script with async profile fetching, DOM manipulation, and filter logic
- **CSS** (~35%) — Dashboard HUD styling with dark theme, glassmorphism, and glow effects
- **Firefox WebExtensions API** — Storage, content scripts, host permissions
- **LocalStorage** — Client-side profile caching

---

## 📝 Changelog

### v1.1.0 (current)
- 🐛 Dashboard now appears on the homepage (not just search results)
- 🐛 Fixed z-index issues — Kleinanzeigen dropdowns (profile menu, etc.) are no longer obscured by the addon
- ♻️ More robust listing container detection across different page types
- ♻️ Improved DOM-ready check for more reliable loading

<details>
<summary>Older versions</summary>

### v1.0.0
- 🚀 Initial release
- ✨ Dashboard with date filter
- ✨ Inline "Member since" badges
- ✨ Smart profile caching
- ✨ Dark mode HUD design

</details>

---

## 📄 License

[MIT](LICENSE) — do what you want, just give credit.

---

<p align="center">
  <a href="https://cheswick.dev">
    <img src="https://img.shields.io/badge/CHESWICK.DEV-00d4ff?style=for-the-badge&logo=firefox&logoColor=0a0a0f&labelColor=a855f7" alt="cheswick.dev" />
  </a>
</p>

<p align="center">
  Made with 🖤 by <a href="https://cheswick.dev">cheswick.dev</a>
</p>
