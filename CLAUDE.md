# PROJEKT-MASTERFILE – FIRSTWERK
Gilt zusätzlich zur globalen Masterfile (~/.claude/CLAUDE.md).

## 1. Ziel und Endprodukt
Interaktive Demo-Webseite für einen erfundenen Dachdeckerbetrieb (FIRSTWERK Bedachungen, Annahme: Dortmund). Musterbeispiel für Akquise an Dachdecker (nach LICHTBOGEN Elektro, WARMHERZ, FARBKANTE Maler).
Probleme, die die Seite löst: Nachwuchs/Fachkräfte (Recruiting-Kapitel Film + 60-s-Bewerbung), Sturmschaden-Anfragenflut (Melder mit Foto/Adresse/Rückruf), unnötige Besichtigungen (Dach-Check per Foto/Drohne), Kunde kann sich das neue Dach nicht vorstellen (Material-Konfigurator), Preisdruck (Ablauf und Qualität sichtbar, Bewertungen), Winterloch (Wartung/Dach-Check jährlich), Solar aus einer Hand.

## 2. Qualitätsanspruch & Referenzen
- Aufbau wie FLUTLICHT27 (Film-Kapitel ↔ Motion Design), Niveau wie FARBKANTE (live engelstraenen.github.io/farbkante/).
- Leitmotiv eindeutig Dachdecker: Gerüst mit Absturzsicherung, Kran mit Ziegelpalette, Lattung, Eindecken Reihe für Reihe, Schieferhammer, Notsicherung mit Plane, Drohnen-Dachcheck.

## 3. Regeln für dieses Projekt
- Alle globalen Handwerks-Demo-Regeln (Vorher → Arbeit → Ergebnis, Kinetik-Typo, nie Platzhalter), mobil in 4 Größen prüfen.
- Keine echten Firmen, keine Preise/Euro, kein Wort „KI“, keine Rechtsaussagen. Bewertungen nur als „Beispiel“ markiert.
- Bilder für die Seite 4K, Storyboards 2K. sjinn Unlimited.

## 4. Skills, Plugins, Agenten, MCP
Keine zusätzlichen nötig.

## 5. Zugänge
gh (Engelstraenen), sjinn in Chrome eingeloggt.

## 6. Workflow & Freigabepunkte
3 Storyboards (Eugen wählt/mischt) → First Frames 4K → Video-Drafts gratis → Seite bauen → Storyboard-Abgleich → GitHub Pages.

## 7. Befehle
- Vorschau: `python3 -m http.server 4392 --directory site --bind 127.0.0.1` (Port 4392)
- Bilder: `python3 tools/assets.py` (assets-roh/4k -> site/assets/img)
- Prüfen: `python3 tools/check.py <url> <ordner>`
- sjinn-Warteschlange: tools/sjinn_fw.js in den sjinn-Tab einspielen, `FWQ.go()`

## 8. Offene Fragen
- Wahl Storyboard FWSB-1 Eindecken / FWSB-2 Sturmnacht / FWSB-3 Von oben.

## 9. Entschieden
- 23.11.2026: Name FIRSTWERK, Stadt Dortmund (Annahme).
- 23.11.2026: Storyboard 1 zu normal, 4 Helmkamera abgelehnt. Eugen will Vorschau-Seiten zu 2 Sturmnacht und 3 Von oben. Bilder gratis (975 Credits abgelehnt).

## 10. Ablage
Code: Dropbox/CLAUDE/Projekte/FIRSTWERK · Storyboards: konzepte/
