export function setupFindLyricsPage() {
// JS/testScript.mjs

// Initialize after DOM loaded
  // DOM elements
  const searchInput       = document.getElementById('searchInput');
  const zoekLiedjesButton = document.getElementById('zoekLiedjes');
  const resultsDiv        = document.getElementById('results');
  const loadingOverlay    = document.getElementById('loadingOverlay');
  let searchError         = document.getElementById('searchError');

  // Create error div if missing
  if (!searchError) {
    searchError = document.createElement('div');
    searchError.id = 'searchError';
    searchError.classList.add('searchError');
    // start hidden
    searchError.style.display = 'none';
    document.body.insertBefore(searchError, document.body.firstChild);
  }

  // Burger-menu elements
  const burgerNav     = document.getElementById('burgerNav');
  const burgerIcon    = document.getElementById('burgerIcon');
  const closeIcon     = document.getElementById('closeIcon');
  const menuContainer = document.getElementById('menuContainer');

  // Lyrics-cache
  const lyricsCache = {};

  // Helpers: show/hide
  const showLoading = () => loadingOverlay.style.display = 'flex';
  const hideLoading = () => loadingOverlay.style.display = 'none';
  const showError = msg => {
    searchError.textContent = msg;
    searchError.style.display = 'block';
    setTimeout(hideError, 3000);
  };
  const hideError = () => { searchError.style.display = 'none'; };

  // ENTER to search
  if (searchInput && zoekLiedjesButton) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') zoekLiedjesButton.click();
    });
  }

  // Burger menu toggle
  if (burgerIcon && closeIcon && burgerNav && menuContainer) {
    burgerIcon.addEventListener('click', () => {
      burgerNav.classList.add('active');
      menuContainer.classList.add('open');
      burgerIcon.classList.add('menu-open');
    });

    closeIcon.addEventListener('click', () => {
      burgerNav.classList.remove('active');
      menuContainer.classList.remove('open');
      burgerIcon.classList.remove('menu-open');
    });
  }

  // Initial state
  hideLoading();
  burgerNav && burgerNav.classList.remove('active');
  menuContainer && menuContainer.classList.remove('open');
  burgerIcon && burgerIcon.classList.remove('menu-open');
  hideError();

  // Search songs
  const searchSongs = async () => {
    if (!searchInput || !resultsDiv) return;
    const query = searchInput.value.trim();
    if (!query) { showError('Typ eerst iets in…'); return; }

    hideError();
    resultsDiv.innerHTML = '';
    showLoading();

    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`
      );
      const data = await res.json();
      if (!data.results.length) throw new Error('Geen resultaten gevonden.');

      data.results.forEach(track => resultsDiv.appendChild(createTrackItem(track)));

      // wait for images
      const imgs = Array.from(resultsDiv.querySelectorAll('img'));
      await Promise.all(imgs.map(img => new Promise(r => {
        if (img.complete) return r();
        img.onload = img.onerror = r;
      })));

    } catch (err) {
      showError(err.message);
    } finally {
      hideLoading();
    }
  };
  zoekLiedjesButton && zoekLiedjesButton.addEventListener('click', searchSongs);

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
        lyricsDiv.style.display = 'none'; btn.textContent = 'Toon lyrics'; return;
      }
      lyricsDiv.style.display = 'block'; btn.textContent = 'Verstop lyrics';
      if (lyricsCache[key]) {
        lyricsDiv.textContent = lyricsCache[key];
      } else {
        lyricsDiv.textContent = 'Loading…';
        try {
          const r = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(trackName)}`);
          const d = await r.json();
          if (!d.lyrics) throw new Error('Lyrics niet gevonden.');
          lyricsCache[key] = d.lyrics; lyricsDiv.textContent = d.lyrics;
        } catch (e) { lyricsDiv.textContent = e.message; }
      }
    });
    return div;
  }
}