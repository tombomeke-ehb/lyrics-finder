# Lyrics Finder - Single Page Application

![Lyrics Finder Screenshot](./screenshots/main.png)

## Projectbeschrijving en functionaliteiten

Lyrics Finder is een interactieve single-page applicatie waarmee gebruikers:
- Liedjes kunnen zoeken via de iTunes API
- Songteksten kunnen bekijken via de Lyrics.ovh API
- Favoriete liedjes kunnen opslaan (lokaal in browser)
- Instellingen kunnen aanpassen (thema, animaties, etc.)

### Hoofdfunctionaliteiten:
1. **Dataverzameling & -weergave**:
   - Haalt liedjesdata op van iTunes API (max 25 resultaten)
   - Toont resultaten in visueel aantrekkelijke kaarten
   - Toont gedetailleerde informatie per liedje (6+ velden)

2. **Interactiviteit**:
   - Zoekfunctionaliteit met validatie
   - Sorteermogelijkheden (standaard op relevantie)
   - Lyrics overlay met toggle functionaliteit

3. **Personalisatie**:
   - Opslaan van favoriete liedjes (lokaal opslag)
   - Thema voorkeuren (light/dark mode)
   - Animatie-instellingen
   - Aantal resultaten instelling

4. **Gebruikerservaring**:
   - Volledig responsive design
   - Foutafhandeling met duidelijke meldingen
   - Intuïtieve navigatie

## Gebruikte API's

1. **iTunes Search API**:
   - Endpoint: `https://itunes.apple.com/search`
   - Gebruikt voor: Zoeken naar liedjes
   - Documentatie: [Apple Developer Docs](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)

2. **Lyrics.ovh API**:
   - Endpoint: `https://api.lyrics.ovh/v1/{artist}/{title}`
   - Gebruikt voor: Ophalen songteksten
   - Documentatie: [Lyrics.ovh Docs](https://lyricsovh.docs.apiary.io/)

## Technische Implementatie

Hieronder vind je waar elk vereist concept is geïmplementeerd:

### DOM Manipulatie
| Concept | Bestand | Lijnnummers |
|---------|---------|------------|
| Elementen selecteren | searchSongsScript.mjs | 45-50, 108-110 |
| Elementen manipuleren | searchSongsScript.mjs | 112-114, 160-240 |
| Events koppelen | searchSongsScript.mjs | 53-55, 160-240 |

### Modern JavaScript
| Concept | Bestand | Voorbeeld |
|---------|---------|-----------|
| Constantes | settingsScript.mjs | 5 (`SAVED_SONGS_KEY`) |
| Template literals | searchSongsScript.mjs | 168-186 |
| Array methodes | savedSongsScript.mjs | 20 (`filter`, `some`) |
| Arrow functions | searchSongsScript.mjs | 56 (`searchSongs`) |
| Ternary operator | errorHandling.mjs | 11 (`console[type === ...]`) |
| Async/Await | searchSongsScript.mjs | 56, 124 |
| Callbacks | searchSongsScript.mjs | 160 (`addEventListener`) |

### Data & API
| Concept | Bestand | Lijnnummers |
|---------|---------|------------|
| Fetch API | searchSongsScript.mjs | 124-130 |
| JSON manipulatie | searchSongsScript.mjs | 128 (`res.json()`) |

### Opslag & Validatie
| Concept | Bestand | Lijnnummers |
|---------|---------|------------|
| LocalStorage | savedSongsScript.mjs | 15-25 |
| Form validatie | searchSongsScript.mjs | 114-120 |

### Styling & Layout
| Concept | Bestand | Locatie |
|---------|---------|---------|
| Flexbox/Grid | style.css | Diverse |
| Responsive | style.css | Media queries |

### Geavanceerde Concepten
| Concept | Bestand | Lijnnummers |
|---------|---------|------------|
| Observer API | **TODO** | Moet nog worden geïmplementeerd |
| Error boundaries | errorHandling.mjs | 1-60 |

## Installatiehandleiding

### Vereisten
- Node.js (v18+)
- npm (v9+)

### Installatiestappen
1. Clone de repository:
   ```bash
   git clone https://github.com/tombomeke-ehb/lyrics-finder.git
   cd lyrics-finder
2. Installeer dependencies:
    npm install

3. Start development server:
    npm run dev

4. Open de applicatie in je browser:
    http://localhost:5173

### Gebruikte bronnen
## API's

    iTunes Search API

        Officiële documentatie: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/

        Gebruikt voor: Het zoeken en ophalen van liedjesinformatie

        Implementatie: Zie searchSongsScript.mjs lijnen 124-130

    Lyrics.ovh API

        Officiële documentatie: https://lyricsovh.docs.apiary.io/

        Gebruikt voor: Het ophalen van songteksten

        Implementatie: Zie searchSongsScript.mjs lijnen 196-210

### Documentatie

    MDN Web Docs

        Link: https://developer.mozilla.org/

        Gebruikt voor: JavaScript referentie, DOM-manipulatie, Fetch API

    Vite Documentation

        Link: https://vitejs.dev/guide/

        Gebruikt voor: Projectopzet en configuratie

Vorige comits
![alt text](image.png)