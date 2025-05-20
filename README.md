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
   - Toont gedetailleerde informatie per liedje (artiest, album, genre, releasedatum, preview, lyrics)

2. **Interactiviteit**:
   - Zoekfunctionaliteit met validatie (minimaal 2 karakters)
   - Filters (genre, tijdperk)
   - Sorteermogelijkheden (relevantie, titel, artiest, datum)
   - Lyrics overlay met toggle functionaliteit

3. **Personalisatie**:
   - Opslaan van favoriete liedjes (LocalStorage)
   - Thema voorkeuren (light/dark mode)
   - Animatie-instellingen
   - Aantal resultaten instelling (5-25)

4. **Gebruikerservaring**:
   - Volledig responsive design (mobile/desktop)
   - Foutafhandeling met duidelijke meldingen
   - Intuïtieve navigatie met burger menu
   - Lazy loading van afbeeldingen

## Gebruikte API's

1. **iTunes Search API**:
   - Endpoint: `https://itunes.apple.com/search`
   - Gebruikt voor: Zoeken naar liedjes
   - Documentatie: [Apple Developer Docs](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
   - Implementatie: `searchSongsScript.mjs` (regel 124-130)

2. **Lyrics.ovh API**:
   - Endpoint: `https://api.lyrics.ovh/v1/{artist}/{title}`
   - Gebruikt voor: Ophalen songteksten
   - Documentatie: [Lyrics.ovh Docs](https://lyricsovh.docs.apiary.io/)
   - Implementatie: `searchSongsScript.mjs` (regel 196-210)

## Technische Implementatie

### DOM Manipulatie
| Concept | Locatie | Voorbeeld |
|---------|---------|-----------|
| Elementen selecteren | `searchSongsScript.mjs` | `document.getElementById()` |
| Elementen manipuleren | `searchSongsScript.mjs` | `innerHTML`, `classList` |
| Events koppelen | `burgerMenu.mjs` | `addEventListener` |

### Modern JavaScript
| Concept | Locatie | Voorbeeld |
|---------|---------|-----------|
| Constantes | `settingsScript.mjs` | `SAVED_SONGS_KEY` |
| Template literals | `searchSongsScript.mjs` | `` `Artiest: ${artistName}` `` |
| Array methodes | `savedSongsScript.mjs` | `filter()`, `some()` |
| Arrow functions | `searchSongsScript.mjs` | `() => {}` |
| Async/Await | `searchSongsScript.mjs` | `async searchSongs()` |
| Observer API | `searchSongsScript.mjs` | `IntersectionObserver` |

### Data & API
| Concept | Locatie | Details |
|---------|---------|---------|
| Fetch API | `searchSongsScript.mjs` | `safeFetch()` wrapper |
| JSON manipulatie | `searchSongsScript.mjs` | `res.json()` |

### Opslag & Validatie
| Concept | Locatie | Implementatie |
|---------|---------|--------------|
| LocalStorage | `savedSongsScript.mjs` | `getItem/setItem` |
| Form validatie | `searchSongsScript.mjs` | Minimaal 2 karakters |

### Observer API Implementatie
```javascript
// searchSongsScript.mjs (regel 33-42)
const lazyLoadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      lazyLoadObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '200px'
});
```

## Installatiehandleiding
### Vereisten

    Node.js (v18+)

    npm (v9+)

    Moderne browser (Chrome, Firefox, Edge)

Installatiestappen

    Clone de repository:
    bash

git clone https://github.com/tombomeke-ehb/lyrics-finder.git
cd lyrics-finder

Installeer dependencies:
bash

npm install

Start development server:
bash

npm run dev

Open de applicatie:
bash

http://localhost:5173