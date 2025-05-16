// searchSongsScript.mjs
import { hideError, showError, safeFetch } from './errorHandling.mjs';
import { burgerMenu } from './burgerMenu.mjs';
import { PageLoad } from './pageLoad.mjs';
import { getSongLimit } from './settingsScript.mjs';
import { applyThemeFromStorage } from './themeUtils.mjs';

export function setupFindLyricsPage() {
  burgerMenu();
  PageLoad();
  applyThemeFromStorage();
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

  // Lyrics-cache
  const lyricsCache = {};

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
      // HIER ophalen, zodat je altijd het actuele aantal hebt!
      const songLimit = getSongLimit();

      const res = await safeFetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${songLimit}`
      );
      const data = await res.json();

      if (!data.results.length) {
        showError('Geen resultaten gevonden.', 'info');
        return;
      }

      data.results.forEach(track => resultsDiv.appendChild(createTrackItem(track)));

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

  // Create track item
  function createTrackItem({ artworkUrl100, trackName, artistName, collectionName, primaryGenreName, releaseDate, previewUrl }) {
    const div = document.createElement('div');
    div.className = 'song';
    const rd = new Date(releaseDate).toLocaleDateString('nl-BE');

    div.innerHTML = `
      <img src="${artworkUrl100}" alt="Album art">
      <h3>${trackName}</h3>
      <p><strong>Artiest:</strong> ${artistName}</p>
      <p><strong>Album:</strong> ${collectionName}</p>
      <p><strong>Genre:</strong> ${primaryGenreName}</p>
      <p><strong>Releasedatum:</strong> ${rd}</p>
      <audio class="preview" controls src="${previewUrl}"></audio>
      <button class="toon-lyrics">Toon lyrics</button>
      <div class="lyrics" style="display:none;"></div>
    `;

    const btn = div.querySelector('.toon-lyrics');
    const lyricsDiv = div.querySelector('.lyrics');
    btn.addEventListener('click', async () => {
      const key = `${artistName}|${trackName}`;
      if (lyricsDiv.style.display === 'block') {
        lyricsDiv.style.display = 'none';
        btn.textContent = 'Toon lyrics';
        return;
      }
      lyricsDiv.style.display = 'block';
      btn.textContent = 'Verstop lyrics';
      if (lyricsCache[key]) {
        lyricsDiv.textContent = lyricsCache[key];
      } else {
        lyricsDiv.textContent = 'Loading…';
        try {
          // Ook hier safeFetch gebruiken!
          const r = await safeFetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(trackName)}`);
          const d = await r.json();
          if (!d.lyrics) throw new Error('Lyrics niet gevonden.');
          lyricsCache[key] = d.lyrics;
          lyricsDiv.textContent = d.lyrics;
        } catch (e) {
          lyricsDiv.textContent = e.message;
        }
      }
    });
    return div;
  }
}
