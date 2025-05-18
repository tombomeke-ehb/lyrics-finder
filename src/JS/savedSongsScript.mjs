import { burgerMenu } from './burgerMenu.mjs';
import { PageLoad } from './pageLoad.mjs';
import { applySettingsFromStorage } from './themeUtils.mjs';

const SAVED_SONGS_KEY = 'savedSongsV2';

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

export function setupSavedSongsPage() {
  burgerMenu();
  PageLoad();
  applySettingsFromStorage();
  console.log('Saved Songs page loaded');

  const container = document.getElementById('savedSongsContainer');
  if (!container) return;
  container.innerHTML = '';

  const songs = loadSavedSongs();
  if (!songs.length) {
    container.innerHTML = '<p class="no-saved-songs">Je hebt nog geen liedjes opgeslagen.</p>';
    return;
  }

  // Maak een wrapper voor dezelfde structuur als de zoekresultaten
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'results';
  resultsDiv.className = 'results';

  songs.forEach(song => {
    const div = document.createElement('div');
    div.className = 'song';
    const rd = new Date(song.releaseDate).toLocaleDateString('nl-BE');

    div.innerHTML = `
      <div class="result-div">
        <div class="result-div-inner">
          <img src="${song.artworkUrl100}" alt="Album art">
          <div class="result-text">
            <h3>${song.trackName}</h3>
            <p><strong>Artiest:</strong> ${song.artistName}</p>
            <p><strong>Album:</strong> ${song.collectionName}</p>
            <p><strong>Genre:</strong> ${song.primaryGenreName}</p>
            <p><strong>Releasedatum:</strong> ${rd}</p>
          </div>
        </div>
        <audio class="preview" controls src="${song.previewUrl}"></audio>
        <button class="toon-lyrics">Toon lyrics</button>
        <button class="save-song">Niet meer opslaan</button>
        <div class="lyrics-overlay" style="display:none;">
          <button class="close-lyrics" title="Sluiten">&times;</button>
          <div class="lyrics-content">${song.lyrics ? song.lyrics : 'Geen lyrics opgeslagen.'}</div>
        </div>
      </div>
    `;

    // Lyrics overlay events
    const btn = div.querySelector('.toon-lyrics');
    const lyricsOverlay = div.querySelector('.lyrics-overlay');
    const closeBtn = div.querySelector('.close-lyrics');
    btn.addEventListener('click', () => {
      lyricsOverlay.style.display = 'flex';
      btn.disabled = true;
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

    // Verwijderen uit saved
    const saveBtn = div.querySelector('.save-song');
    saveBtn.addEventListener('click', () => {
      let savedSongs = loadSavedSongs();
      savedSongs = savedSongs.filter(s => !(s.artistName === song.artistName && s.trackName === song.trackName));
      saveSavedSongs(savedSongs);
      div.remove();
      if (!savedSongs.length) {
        container.innerHTML = '<p class="no-saved-songs">Je hebt nog geen liedjes opgeslagen.</p>';
      }
    });

    resultsDiv.appendChild(div);
  });

  container.appendChild(resultsDiv);
}
