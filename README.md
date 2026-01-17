# Kleinanzeigen-Filter

Firefox-Addon zum Filtern von Kleinanzeigen-Angeboten nach dem Mitglied-seit-Datum der Anbieter.

## Funktionsumfang

- Fügt auf Ergebnislisten ein Filter-Panel hinzu, mit dem ein Stichtag gewählt werden kann.
- Öffnet Anzeigen im Hintergrund, ruft das Profil des Anbieters auf und ermittelt das Mitglied-seit-Datum.
- Blendet automatisch Anbieter aus, die nach dem Stichtag beigetreten sind.
- Markiert Anzeigen ohne ermittelbares Datum, blendet sie aber nicht automatisch aus.
- Speichert den Filterstatus lokal und wendet ihn beim nächsten Besuch automatisch an.

## Entwicklung

Die wichtigsten Dateien:

- `manifest.json` – Firefox-Manifest inkl. Content- und Background-Skripte.
- `content.js` / `content.css` – UI und Filterlogik auf Ergebnislisten.
- `background.js` – Hintergrund-Logik zum Abrufen der Mitglied-seit-Daten.
