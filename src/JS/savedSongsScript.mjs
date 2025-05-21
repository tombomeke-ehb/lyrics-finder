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

// Filter- en sorteerfuncties
function applyFilters(tracks, genreValue, yearValue) {
  return tracks.filter(track => {
    const matchesGenre = !genreValue || (track.primaryGenreName && track.primaryGenreName.includes(genreValue));
    const releaseYear = track.releaseDate ? new Date(track.releaseDate).getFullYear() : 0;
    let matchesYear = true;
    if (yearValue === '2020') {
      matchesYear = releaseYear >= 2020;
    } else if (yearValue === '2010') {
      matchesYear = releaseYear >= 2010 && releaseYear <= 2019;
    } else if (yearValue === '2000') {
      matchesYear = releaseYear >= 2000 && releaseYear <= 2009;
    } else if (yearValue === '1999') {
      matchesYear = releaseYear <= 1999;
    }
    return matchesGenre && matchesYear;
  });
}

function sortTracks(tracks, sortKey) {
  return [...tracks].sort((a, b) => {
    switch (sortKey) {
      case 'date':
        return (new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
      case 'name':
        return (a.trackName || '').localeCompare(b.trackName || '');
      case 'artist':
        return (a.artistName || '').localeCompare(b.artistName || '');
      default:
        return 0;
    }
  });
}

function createSavedSongItem(song, removeCallback) {
  const {
    artworkUrl100,
    trackName,
    artistName,
    collectionName,
    primaryGenreName,
    releaseDate,
    previewUrl,
    lyrics
  } = song;
  const rd = releaseDate ? new Date(releaseDate).toLocaleDateString('nl-BE') : 'Onbekend';

  const div = document.createElement('div');
  div.className = 'song';
  div.innerHTML = `
    <div class="result-div">
      <div class="result-div-inner">
        <img src="${artworkUrl100}" alt="Album art">
        <div class="result-text">
          <h3>${trackName || 'Onbekend'}</h3>
          <p><strong>Artiest:</strong> ${artistName || 'Onbekend'}</p>
          <p><strong>Album:</strong> ${collectionName || 'Onbekend'}</p>
          <p><strong>Genre:</strong> ${primaryGenreName || 'Onbekend'}</p>
          <p><strong>Releasedatum:</strong> ${rd}</p>
        </div>
      </div>
      ${previewUrl ? `<audio class="preview" controls src="${previewUrl}"></audio>` : ''}
      <button class="toon-lyrics">Toon lyrics</button>
      <button class="save-song">Niet meer opslaan</button>
      <div class="lyrics-overlay" style="display:none;">
        <button class="close-lyrics" title="Sluiten">&times;</button>
        <div class="lyrics-content">${lyrics ? lyrics : 'Geen lyrics opgeslagen.'}</div>
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
    removeCallback(song, div);
  });

  return div;
}

export function setupSavedSongsPage() {
  burgerMenu();
  PageLoad();
  applySettingsFromStorage();

  const container = document.getElementById('input-container');
  if (!container) return;
  container.innerHTML = '';

  // Filter elementen ophalen
  const genreFilter = document.getElementById('genre-filter');
  const yearFilter = document.getElementById('year-filter');
  const sortSelect = document.getElementById('sort-select');

  function renderSavedSongs() {
    const songs = loadSavedSongs();
    if (!songs.length) {
      container.innerHTML = '<p class="no-saved-songs">Je hebt nog geen liedjes opgeslagen.</p>';
      return;
    }

    // Huidige filterwaarden ophalen
    const genreValue = genreFilter ? genreFilter.value : '';
    const yearValue = yearFilter ? yearFilter.value : '';
    const sortValue = sortSelect ? sortSelect.value : 'relevance';

    // Filteren en sorteren
    let filtered = applyFilters(songs, genreValue, yearValue);
    filtered = sortTracks(filtered, sortValue);

    // Results wrapper
    let resultsDiv = container.querySelector('#results');
    if (!resultsDiv) {
      resultsDiv = document.createElement('div');
      resultsDiv.id = 'results';
      resultsDiv.className = 'results';
      container.appendChild(resultsDiv);
    }
    resultsDiv.innerHTML = '';

    if (!filtered.length) {
      resultsDiv.innerHTML = '<p class="no-saved-songs">Geen liedjes gevonden met deze filters.</p>';
      return;
    }

    filtered.forEach(song => {
      const songDiv = createSavedSongItem(song, (songToRemove, el) => {
        let savedSongs = loadSavedSongs();
        savedSongs = savedSongs.filter(s => !(s.artistName === songToRemove.artistName && s.trackName === songToRemove.trackName));
        saveSavedSongs(savedSongs);
        el.remove();
        if (!loadSavedSongs().length) {
          container.innerHTML = '<p class="no-saved-songs">Je hebt nog geen liedjes opgeslagen.</p>';
        } else {
          renderSavedSongs(); // opnieuw filteren/sorteren na verwijderen
        }
      });
      resultsDiv.appendChild(songDiv);
    });
  }

  // Event listeners voor filters
  if (genreFilter) genreFilter.addEventListener('change', renderSavedSongs);
  if (yearFilter) yearFilter.addEventListener('change', renderSavedSongs);
  if (sortSelect) sortSelect.addEventListener('change', renderSavedSongs);

  // Initieel tonen
  renderSavedSongs();
}