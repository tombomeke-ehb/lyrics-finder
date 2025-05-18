import { hideError, showError, safeFetch } from './errorHandling.mjs';
import { burgerMenu } from './burgerMenu.mjs';
import { PageLoad } from './pageLoad.mjs';
import { getSongLimit } from './settingsScript.mjs';
import { applySettingsFromStorage } from './themeUtils.mjs';

export function setupFindLyricsPage() {
  burgerMenu();
  PageLoad();
  applySettingsFromStorage();
  console.log('Search page loaded');

  // ---- TEST THROWS HIER ----

  // 1. Simuleer een netwerkfout
  // throw new Error('Netwerkfout: Kan geen verbinding maken met de server.');

  // 2. Simuleer een 404 fout
  // throw new Error('Niet gevonden (404)');

  // 3. Simuleer een 500 fout
  // throw new Error('Interne serverfout (500)');

  // 4. Simuleer een lege invoer
  // throw new Error('Typ eerst iets in…');

  // 5. Simuleer een te korte zoekopdracht
  // throw new Error('Voer minimaal 2 tekens in.');

  // 6. Simuleer geen resultaten gevonden
  // throw new Error('Geen resultaten gevonden.');

  // 7. Simuleer een fout bij het laden van een afbeelding
  // throw new Error('Afbeelding kon niet geladen worden.');

  // 8. Simuleer een fout bij het laden van lyrics
  // throw new Error('Lyrics niet gevonden.');

  // 9. Simuleer een algemene JS-fout
  // notDefinedFunction(); // Dit veroorzaakt een runtime error

  // 10. Simuleer een ongehandelde promise rejection
  // Promise.reject('Simulated unhandled rejection');

  // 11. Simuleer een waarschuwing
  // throw new Error('Dit is een waarschuwing!');

  // 12. Simuleer een info-melding
  // throw new Error('Dit is een info-melding!');

  // ---- EINDE TEST THROWS ----

  // DOM elements
  const searchInput       = document.getElementById('searchInput');
  const zoekLiedjesButton = document.getElementById('zoekLiedjes');
  const resultsDiv        = document.getElementById('results');
  let searchError         = document.getElementById('searchError');

  // Create error div if missing (voor de zekerheid)
  if (!searchError) {
    searchError = document.createElement('div');
    searchError.id = 'searchError';
    searchError.classList.add('searchError');
    searchError.style.display = 'none';
    document.body.insertBefore(searchError, document.body.firstChild);
  }

  // Lyrics-cache (in-memory)
  const lyricsCache = {};

  // Track-cache (laatste 3 zoekopdrachten in localStorage)
  const TRACK_CACHE_KEY = 'trackCacheRecent3';
  const SAVED_SONGS_KEY = 'savedSongsV2';

  function loadTrackCache() {
    try {
      return JSON.parse(localStorage.getItem(TRACK_CACHE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveTrackCache(cacheArr) {
    localStorage.setItem(TRACK_CACHE_KEY, JSON.stringify(cacheArr));
  }

  function getCachedTracks(cacheArr, key) {
    const found = cacheArr.find(entry => entry.key === key);
    return found ? found.tracks : undefined;
  }

  function updateTrackCache(cacheArr, key, tracks) {
    const filtered = cacheArr.filter(entry => entry.key !== key);
    filtered.unshift({ key, tracks });
    return filtered.slice(0, 3);
  }

  // Saved Songs helpers
  function loadSavedSongs() {
    try {
      return JSON.parse(localStorage.getItem(SAVED_SONGS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveSavedSongs(arr) {
    localStorage.setItem(SAVED_SONGS_KEY, JSON.stringify(arr));
  }

  function isSongSaved(artist, track) {
    const saved = loadSavedSongs();
    return saved.some(s => s.artistName === artist && s.trackName === track);
  }

  // ENTER to search
  if (searchInput && zoekLiedjesButton) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') zoekLiedjesButton.click();
    });
  }

  // Search songs
  const searchSongs = async () => {
    if (!searchInput || !resultsDiv) return;
    const query = searchInput.value.trim();

    // Input validatie
    if (!query) {
      showError('Typ eerst iets in…', 'warning');
      return;
    }
    if (query.length < 2) {
      showError('Voer minimaal 2 tekens in.', 'info');
      return;
    }

    hideError();
    resultsDiv.innerHTML = '';
    showLoading();

    try {
      const songLimit = getSongLimit();
      const cacheKey = `${query.toLowerCase()}|${songLimit}`;
      let trackCacheArr = loadTrackCache();
      let tracks = getCachedTracks(trackCacheArr, cacheKey);

      if (tracks) {
        console.log('Tracks loaded from localStorage cache:', cacheKey);
      } else {
        const res = await safeFetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${songLimit}`
        );
        const data = await res.json();
        if (!data.results.length) {
          showError('Geen resultaten gevonden.', 'info');
          return;
        }
        tracks = data.results;
        // Update cache
        trackCacheArr = updateTrackCache(trackCacheArr, cacheKey, tracks);
        saveTrackCache(trackCacheArr);
      }

      tracks.forEach(track => resultsDiv.appendChild(createTrackItem(track)));

      // Wacht tot alle images geladen zijn
      const imgs = Array.from(resultsDiv.querySelectorAll('img'));
      await Promise.all(imgs.map(img => new Promise(r => {
        if (img.complete) return r();
        img.onload = img.onerror = r;
      })));

    } catch (err) {
      if (err instanceof Error && err.message === 'Geen resultaten gevonden.') {
        showError(err.message, 'info');
      }
      // safeFetch toont netwerk/server errors al automatisch
    } finally {
      hideLoading();
    }
  };

  zoekLiedjesButton && zoekLiedjesButton.addEventListener('click', searchSongs);

  // Show/hide loading overlay
  function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
  }
  function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }

  // Create track item (met lyrics overlay en opslaan)
  function createTrackItem({ artworkUrl100, trackName, artistName, collectionName, primaryGenreName, releaseDate, previewUrl }) {
    const div = document.createElement('div');
    div.className = 'song';
    const rd = new Date(releaseDate).toLocaleDateString('nl-BE');
    const saved = isSongSaved(artistName, trackName);

    div.innerHTML = `
      <div class="result-div">
        <div class="result-div-inner">
          <img src="${artworkUrl100}" alt="Album art">
          <div class="result-text">
            <h3>${trackName}</h3>
            <p><strong>Artiest:</strong> ${artistName}</p>
            <p><strong>Album:</strong> ${collectionName}</p>
            <p><strong>Genre:</strong> ${primaryGenreName}</p>
            <p><strong>Releasedatum:</strong> ${rd}</p>
          </div>
        </div>
        <audio class="preview" controls src="${previewUrl}"></audio>
        <button class="toon-lyrics">Toon lyrics</button>
        <button class="save-song">${saved ? 'Niet meer opslaan' : 'Opslaan'}</button>
        <div class="lyrics-overlay" style="display:none;">
          <button class="close-lyrics" title="Sluiten">&times;</button>
          <div class="lyrics-content">Loading…</div>
        </div>
      </div>
    `;

    const btn = div.querySelector('.toon-lyrics');
    const lyricsOverlay = div.querySelector('.lyrics-overlay');
    const closeBtn = div.querySelector('.close-lyrics');
    const lyricsContent = div.querySelector('.lyrics-content');
    const saveBtn = div.querySelector('.save-song');

    // Lyrics tonen
    btn.addEventListener('click', async () => {
      const key = `${artistName}|${trackName}`;
      lyricsOverlay.style.display = 'flex';
      btn.disabled = true;

      if (lyricsCache[key]) {
        lyricsContent.textContent = lyricsCache[key];
      } else {
        lyricsContent.textContent = 'Loading…';
        try {
          const r = await safeFetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(trackName)}`);
          const d = await r.json();
          if (!d.lyrics) throw new Error('Lyrics niet gevonden.');
          lyricsCache[key] = d.lyrics;
          lyricsContent.textContent = d.lyrics;
        } catch (e) {
          lyricsContent.textContent = e.message;
        }
      }
    });

    closeBtn.addEventListener('click', () => {
      lyricsOverlay.style.display = 'none';
      btn.disabled = false;
    });

    lyricsOverlay.addEventListener('click', (e) => {
      if (e.target === lyricsOverlay) {
        lyricsOverlay.style.display = 'none';
        btn.disabled = false;
      }
    });

    // Opslaan/Verwijderen van song
    saveBtn.addEventListener('click', async () => {
      let savedSongs = loadSavedSongs();
      const alreadySaved = isSongSaved(artistName, trackName);

      if (alreadySaved) {
        // Verwijder uit saved
        savedSongs = savedSongs.filter(s => !(s.artistName === artistName && s.trackName === trackName));
        saveBtn.textContent = 'Opslaan';
      } else {
        // Lyrics ophalen (uit cache of API)
        let lyrics = lyricsCache[`${artistName}|${trackName}`];
        if (!lyrics) {
          try {
            const r = await safeFetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(trackName)}`);
            const d = await r.json();
            lyrics = d.lyrics || '';
          } catch {
            lyrics = '';
          }
        }
        savedSongs.unshift({
          artworkUrl100, trackName, artistName, collectionName, primaryGenreName, releaseDate, previewUrl, lyrics
        });
        // Beperk optioneel tot bv. 20 saved songs:
        savedSongs = savedSongs.slice(0, 20);
        saveBtn.textContent = 'Niet meer opslaan';
      }
      saveSavedSongs(savedSongs);
    });

    return div;
  }
}