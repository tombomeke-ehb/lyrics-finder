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

  // DOM elements
  const searchInput = document.getElementById('searchInput');
  const zoekLiedjesButton = document.getElementById('zoekLiedjes');
  const resultsDiv = document.getElementById('results');
  const genreFilter = document.getElementById('genre-filter');
  const yearFilter = document.getElementById('year-filter');
  const sortSelect = document.getElementById('sort-select');
  const resetFiltersBtn = document.getElementById('reset-filters');
  const recentSearchesContainer = document.getElementById('recent-searches');
  const resultsSummary = document.getElementById('results-summary');
  let searchError = document.getElementById('searchError');

  // Create error div if missing
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
  const RECENT_SEARCHES_KEY = 'recentSearches';
  const SAVED_SONGS_KEY = 'savedSongsV2';

  // Observer voor lazy loading images
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

  // Helper functies
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

  function loadSavedSongs() {
    try {
      return JSON.parse(localStorage.getItem(SAVED_SONGS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function isSongSaved(artist, track) {
    const saved = loadSavedSongs();
    return saved.some(s => s.artistName === artist && s.trackName === track);
  }

  function loadRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveRecentSearches(searches) {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  }

  function addRecentSearch(query) {
    if (!query || query.length < 2) return;
    const current = loadRecentSearches().filter(item => item.toLowerCase() !== query.toLowerCase());
    current.unshift(query);
    saveRecentSearches(current.slice(0, 6));
    renderRecentSearches();
  }

  function renderRecentSearches() {
    if (!recentSearchesContainer) return;
    const searches = loadRecentSearches();

    if (!searches.length) {
      recentSearchesContainer.innerHTML = '';
      return;
    }

    recentSearchesContainer.innerHTML = '';

    const title = document.createElement('p');
    title.className = 'recent-search-title';
    title.textContent = 'Recente zoekopdrachten:';

    const list = document.createElement('div');
    list.className = 'recent-search-list';

    searches.forEach(item => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'recent-search-chip';
      chip.dataset.query = item;
      chip.textContent = item;
      list.appendChild(chip);
    });

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'recent-search-clear';
    clearButton.id = 'clearRecentSearches';
    clearButton.textContent = 'Wissen';
    list.appendChild(clearButton);

    recentSearchesContainer.appendChild(title);
    recentSearchesContainer.appendChild(list);
    recentSearchesContainer.querySelectorAll('.recent-search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        searchInput.value = chip.dataset.query || '';
        searchSongs();
      });
    });

    const clearRecentButton = document.getElementById('clearRecentSearches');
    if (clearRecentButton) {
      clearRecentButton.addEventListener('click', () => {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
        renderRecentSearches();
      });
    }
  }

  function renderSkeletonState() {
    if (!resultsDiv) return;
    const placeholders = Array.from({ length: 6 }, () => `
      <article class="result-div skeleton-card" aria-hidden="true">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </article>
    `).join('');
    resultsDiv.innerHTML = `<div class="skeleton-grid">${placeholders}</div>`;
  }

  // Filter en sorteer functies
  function applyFilters(tracks) {
    const genreValue = genreFilter ? genreFilter.value : '';
    const yearValue = yearFilter ? yearFilter.value : '';
    const sortValue = sortSelect ? sortSelect.value : 'relevance';

    // Filteren
    let filtered = tracks.filter(track => {
      const matchesGenre = !genreValue || (track.primaryGenreName && track.primaryGenreName.includes(genreValue));
      const releaseYear = track.releaseDate ? new Date(track.releaseDate).getFullYear() : 0;
      let matchesYear = true;
      
      if (yearValue === '2020') {
        matchesYear = releaseYear >= 2020;
      } else if (yearValue === '2010') {
        matchesYear = releaseYear >= 2010 && releaseYear <= 2019;
      } else if (yearValue === '2000') {
        matchesYear = releaseYear >= 2000 && releaseYear <= 2009;
      }else if (yearValue === '1999'){
        matchesYear = releaseYear <= 1999
      }
      
      return matchesGenre && matchesYear;
    });

    // Sorteren
    return sortTracks(filtered, sortValue);
  }

  function sortTracks(tracks, key) {
    return [...tracks].sort((a, b) => {
      switch(key) {
        case 'date': 
          return (new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
        case 'name':
          return (a.trackName || '').localeCompare(b.trackName || '');
        case 'artist':
          return (a.artistName || '').localeCompare(b.artistName || '');
        default:
          return 0; // Standaard relevantie
      }
    });
  }

  // Reset filters
  function resetFilters() {
    if (genreFilter) genreFilter.value = '';
    console.log('Reset genre filter');
    if (yearFilter) yearFilter.value = '';
    if (sortSelect) sortSelect.value = 'relevance';
    
    // Alleen opnieuw zoeken als er al resultaten zijn
    if (resultsDiv.innerHTML.trim() !== '') {
      searchSongs();
    }
  }

  // Search handler
  const searchSongs = async () => {
    if (!searchInput || !resultsDiv) return;
    const query = searchInput.value.trim();

    // Input validatie - alleen tonen bij initiële search, niet bij filter changes
    if (!query && !resultsDiv.innerHTML) {
      showError('Typ eerst iets in…', 'warning');
      if (resultsSummary) resultsSummary.textContent = '';
      return;
    }
    if (query.length < 2 && !resultsDiv.innerHTML) {
      showError('Voer minimaal 2 tekens in.', 'info');
      if (resultsSummary) resultsSummary.textContent = '';
      return;
    }

    hideError();
    showLoading();
    
    try {
      const songLimit = getSongLimit();
      const cacheKey = `${query.toLowerCase()}|${songLimit}`;
      let trackCacheArr = loadTrackCache();
      let tracks = query ? getCachedTracks(trackCacheArr, cacheKey) : null;
      if (query) addRecentSearch(query);

      if (!tracks && query) {
        const res = await safeFetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${songLimit}`
        );
        const data = await res.json();
        if (!data.results || !data.results.length) {
          showError('Geen resultaten gevonden.', 'info');
          if (resultsSummary) resultsSummary.textContent = '0 resultaten gevonden';
          resultsDiv.innerHTML = `
            <div class="empty-state">
              <h3>Geen liedjes gevonden</h3>
              <p>Probeer een andere zoekterm of controleer je spelling.</p>
            </div>
          `;
          return;
        }
        tracks = data.results;
        trackCacheArr = updateTrackCache(trackCacheArr, cacheKey, tracks);
        saveTrackCache(trackCacheArr);
      } else if (!query) {
        // Als er geen query is maar wel filters, gebruik de laatste resultaten
        const lastSearch = trackCacheArr[0];
        tracks = lastSearch ? lastSearch.tracks : [];
        if (!tracks.length) return;
      }

      const filteredTracks = applyFilters(tracks);
      resultsDiv.innerHTML = '';

      if (resultsSummary) {
        const total = filteredTracks.length;
        resultsSummary.textContent = total
          ? `${total} resultaat${total === 1 ? '' : 'en'} gevonden`
          : 'Geen resultaten voor je huidige filters';
      }

      if (!filteredTracks.length) {
        resultsDiv.innerHTML = `
          <div class="empty-state">
            <h3>Geen liedjes gevonden</h3>
            <p>Probeer een andere artiest, titel of pas de filters aan.</p>
          </div>
        `;
        return;
      }
      
      filteredTracks.forEach(track => {
        const trackElement = createTrackItem(track);
        resultsDiv.appendChild(trackElement);
        
        const img = trackElement.querySelector('img');
        if (img) {
          img.dataset.src = track.artworkUrl100;
          lazyLoadObserver.observe(img);
        }
      });

      Array.from(resultsDiv.children).forEach((card, index) => {
        card.style.setProperty('--stagger-index', String(index));
        card.classList.add('result-enter');
      });

      enableSingleAudioPlayback(resultsDiv);

    } catch (err) {
      console.error('Search error:', err);
      if (err instanceof Error && err.message === 'Geen resultaten gevonden.') {
        showError(err.message, 'info');
      }
    } finally {
      hideLoading();
    }
  };

  // Event listeners
  if (searchInput && zoekLiedjesButton) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchSongs();
    });
    zoekLiedjesButton.addEventListener('click', searchSongs);
  }

  if (genreFilter) {
    genreFilter.addEventListener('change', () => {
      if (resultsDiv.innerHTML) searchSongs();
    });
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', () => {
      if (resultsDiv.innerHTML) searchSongs();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      if (resultsDiv.innerHTML) searchSongs();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
  }

  renderRecentSearches();


  // Loading functions
  function enableSingleAudioPlayback(scope) {
    const players = scope.querySelectorAll('audio.preview');
    players.forEach((player) => {
      player.addEventListener('play', () => {
        players.forEach((other) => {
          if (other !== player) {
            other.pause();
            other.currentTime = 0;
          }
        });
      });
    });
  }

  function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    renderSkeletonState();
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
  }

  function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }

  // Track item creation
  function createTrackItem({ artworkUrl100, trackName, artistName, collectionName, primaryGenreName, releaseDate, previewUrl }) {
    const div = document.createElement('div');
    div.className = 'song';
    const rd = releaseDate ? new Date(releaseDate).toLocaleDateString('nl-BE') : 'Onbekend';
    const saved = isSongSaved(artistName, trackName);

    div.innerHTML = `
      <div class="result-div">
        <div class="result-div-inner">
          <img alt="Album art" loading="lazy">
          <div class="result-text">
            <h3>${trackName || 'Onbekend'}</h3>
            <p><strong>Artiest:</strong> ${artistName || 'Onbekend'}</p>
            <p><strong>Album:</strong> ${collectionName || 'Onbekend'}</p>
            <p><strong>Genre:</strong> ${primaryGenreName || 'Onbekend'}</p>
            <p><strong>Releasedatum:</strong> ${rd}</p>
          </div>
        </div>
        ${previewUrl ? `<div class="preview-shell"><audio class="preview" controls src="${previewUrl}"></audio></div>` : ''}
        <button class="toon-lyrics">Toon lyrics</button>
        <button class="save-song">${saved ? 'Niet meer opslaan' : 'Opslaan'}</button>
        <div class="lyrics-overlay" style="display:none;">
          <button class="close-lyrics" title="Sluiten">&times;</button>
          <div class="lyrics-content">Loading…</div>
        </div>
      </div>
    `;

    const img = div.querySelector('img');
    if (artworkUrl100) {
      img.dataset.src = artworkUrl100;
      lazyLoadObserver.observe(img);
    } else {
      img.style.display = 'none';
    }

    // Lyrics functionality
    const btn = div.querySelector('.toon-lyrics');
    const lyricsOverlay = div.querySelector('.lyrics-overlay');
    const closeBtn = div.querySelector('.close-lyrics');
    const lyricsContent = div.querySelector('.lyrics-content');
    
    if (btn && lyricsOverlay) {
      btn.addEventListener('click', async () => {
        const key = `${artistName}|${trackName}`;
        lyricsOverlay.style.display = 'flex';
        lyricsOverlay.classList.add('active');
        btn.disabled = true;
        if (lyricsCache[key]) {
          lyricsContent.textContent = lyricsCache[key];
        } else {
          try {
            const r = await safeFetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(trackName)}`);
            const d = await r.json();
            lyricsCache[key] = d.lyrics || 'Lyrics niet gevonden.';
            lyricsContent.textContent = lyricsCache[key];
          } catch (e) {
            lyricsContent.textContent = 'Fout bij laden lyrics.';
            console.error('Error fetching lyrics:', e);
            showError('Fout bij laden lyrics.', 'error');
          }
        }
      });
    }
// Close lyrics overlay
    if (closeBtn && lyricsOverlay) {
      closeBtn.addEventListener('click', () => {
        lyricsOverlay.classList.remove('active');
        lyricsOverlay.style.display = 'none';
        if (btn) btn.disabled = false;
      });

      lyricsOverlay.addEventListener('click', (event) => {
        if (event.target === lyricsOverlay) {
          lyricsOverlay.classList.remove('active');
          lyricsOverlay.style.display = 'none';
          if (btn) btn.disabled = false;
        }
      });
    }

    // Save song functionality
    const saveBtn = div.querySelector('.save-song');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        let savedSongs = loadSavedSongs();
        const alreadySaved = isSongSaved(artistName, trackName);

        if (alreadySaved) {
          savedSongs = savedSongs.filter(s => !(s.artistName === artistName && s.trackName === trackName));
          saveBtn.textContent = 'Opslaan';
        } else {
          let lyrics = lyricsCache[`${artistName}|${trackName}`];
          if (!lyrics && trackName && artistName) {
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
          savedSongs = savedSongs.slice(0, 20);
          saveBtn.textContent = 'Niet meer opslaan';
        }
        localStorage.setItem(SAVED_SONGS_KEY, JSON.stringify(savedSongs));
      });
    }

    return div;
  }
}