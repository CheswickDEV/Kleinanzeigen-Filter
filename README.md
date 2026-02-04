# Kleinanzeigen Filter // Cheswick Edition

![Version](https://img.shields.io/badge/version-1.1.0-869e1e?style=for-the-badge&logo=firefox)
![Status](https://img.shields.io/badge/status-Live-869e1e?style=for-the-badge)
![Tech](https://img.shields.io/badge/powered_by-cheswick.dev-0a0a0f?style=for-the-badge)

**Das ultimative Power-User Tool für Kleinanzeigen.**
Dieses Firefox-Addon erweitert die Suchergebnisse um essentielle Metadaten und ermöglicht das Filtern von Anbietern basierend auf ihrem Registrierungsdatum. Verpackt in einem modernen Dark-Mode Interface, inspiriert von `cheswick.dev`.

---

## 📸 Visual Tour

### Das Dashboard
Ein modernes HUD (Heads-Up Display), das sich nahtlos über die Suchergebnisse legt. Hier steuerst du den Zeitfilter.
*(Bitte Screenshot hier einfügen: docs/assets/dashboard.png)*

### Inline Metadaten
Anstatt jedes Profil einzeln klicken zu müssen, siehst du das "Mitglied seit"-Datum direkt in der Ergebnisliste – sauber integriert und nativ im Look.
*(Bitte Screenshot hier einfügen: docs/assets/list-view.png)*

---

## ⚡ Features

### 📅 Time Travel Filter
Lege einen Stichtag fest (z.B. "01.01.2023"). Das Addon analysiert im Hintergrund alle Anbieter und blendet automatisch Ergebnisse aus, deren Ersteller **nach** diesem Datum beigetreten sind. Perfekt, um kurzfristig erstellte Accounts (oft Bots oder Scalper) zu vermeiden.

### 👁️ Instant Insights
Das Addon fetcht die Profildaten asynchron im Hintergrund.
- **Smart Caching:** Profile werden lokal zwischengespeichert, um Anfragen zu minimieren.
- **Visual Feedback:** Ein "👤 Seit: TT.MM.JJJJ" Badge erscheint sofort neben dem Ort/Datum der Anzeige.
- **Warning System:** Unbekannte oder nicht lesbare Daten werden mit einem gelben Warn-Icon markiert.

### 🎨 Cheswick Design System
Das UI bringt den `cheswick.dev` Look auf Kleinanzeigen:
- **Dark Mode Dashboard:** Kontrastreiches Panel mit Neon-Akzenten (`#869e1e`).
- **Glow Effects:** Subtile Hintergrund-Animationen.
- **Glassmorphism:** Moderne, transparente Header-Elemente.
- **Native Integration:** Die Badges in den Listen passen sich dem hellen Design von Kleinanzeigen an, um den Lesefluss nicht zu stören.

---

## 🚀 Installation

Aktuell ist das Addon für den Entwickler-Modus in Firefox optimiert.

1. **Repository klonen**
   ```bash
   git clone https://github.com/cheswickdev/kleinanzeigen-filter.git
   ```

2. **Firefox Entwickler-Modus öffnen**
   - Öffne `about:debugging#/runtime/this-firefox` in Firefox

3. **Addon laden**
   - Klicke auf "Temporäres Add-on laden..."
   - Wähle die `manifest.json` aus dem heruntergeladenen Ordner

---

## 📋 Changelog

### v1.1.0
- **Fix:** Dashboard erscheint jetzt auch auf der Hauptseite (nicht nur in Suchergebnissen)
- **Fix:** Z-Index korrigiert – Kleinanzeigen-Dropdowns (Profil-Menü, etc.) werden nicht mehr vom Addon verdeckt
- **Verbessert:** Robustere Erkennung von Anzeigen-Containern auf verschiedenen Seitentypen
- **Verbessert:** DOM-Ready Check für zuverlässigeres Laden

### v1.0.0
- Initiales Release
- Dashboard mit Datumsfilter
- Inline Badges für "Mitglied seit"
- Smart Caching für Profile
- Cheswick.dev Design System

---

## 🛠️ Technologie

- **JavaScript** (65%)
- **CSS** (35%)
- Firefox WebExtensions API
- LocalStorage für Smart Caching

---

## 📄 Lizenz

MIT License – siehe LICENSE Datei für Details.

---

**Made with 🖤 by [cheswick.dev](https://cheswick.dev)**
