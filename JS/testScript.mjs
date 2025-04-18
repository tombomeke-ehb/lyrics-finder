window.addEventListener('DOMContentLoaded', function () {
  const zoekLiedjesButton = document.getElementById('zoekLiedjes');
  const loadingOverlay = document.getElementById('loadingOverlay');

  // Loading overlay verbergen na laden van pagina
  loadingOverlay.style.display = 'none';

  zoekLiedjesButton.addEventListener('click', searchSongs);

  // Functie om te wachten
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Zoek liedjes via de iTunes API
  async function searchSongs() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!query.trim()) {
      // Als de invoer leeg is
      zoekLiedjesButton.textContent = "Vul iets in!";
      wait(2000).then(() => {
        zoekLiedjesButton.textContent = "Zoek liedjes";
      });
      return;
    }

    // Laat de loading overlay zien
    loadingOverlay.style.display = 'flex';

    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`);
      const data = await response.json();

      if (data.results.length === 0) {
        resultsDiv.innerHTML = "<p>Geen resultaten gevonden.</p>";
        return;
      }

      // Maak per nummer een blokje met informatie
      data.results.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';

        songDiv.innerHTML = `
          <img src="${song.artworkUrl100}" alt="Album cover">
          <h3>${song.trackName}</h3>
          <p><strong>Artiest:</strong> ${song.artistName}</p>
          <audio class="preview" controls src="${song.previewUrl}">Preview</audio>
          <button class="toon-lyrics" id="toon-lyrics-${song.trackId}" data-artist="${song.artistName}" data-title="${song.trackName}">
            Toon lyrics
          </button>
          <div class="lyrics" style="display: none;"></div>
        `;
        resultsDiv.appendChild(songDiv);
      });

      // Voeg event listeners toe aan alle "toon-lyrics" knoppen
      document.querySelectorAll('.toon-lyrics').forEach(button => {
        button.addEventListener('click', async () => {
          const artist = button.dataset.artist;
          const title = button.dataset.title;
          const lyricsDiv = button.nextElementSibling;

          // Toggle-functionaliteit:
          if (lyricsDiv.style.display === 'block') {
            lyricsDiv.style.display = 'none';
            button.textContent = "Toon lyrics";
          } else {
            // Haal lyrics op indien ze nog niet zijn geladen
            if (lyricsDiv.textContent.trim() === "") {
              lyricsDiv.textContent = "Lyrics laden...";
              try {
                const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
                const data = await response.json();
  
                if (data.lyrics) {
                  lyricsDiv.textContent = data.lyrics;
                } else {
                  lyricsDiv.textContent = "Lyrics niet gevonden.";
                }
              } catch (error) {
                console.error("Fout bij lyrics ophalen:", error);
                lyricsDiv.textContent = "Er ging iets mis bij het laden van de lyrics.";
              }
            }
            lyricsDiv.style.display = 'block';
            button.textContent = "Verberg lyrics";
          }
        });
      });
  
    } catch (error) {
      console.error("Fout bij zoeken:", error);
      resultsDiv.innerHTML = "<p>Er ging iets mis. Probeer later opnieuw.</p>";
    } finally {
      // Verberg loading overlay
      loadingOverlay.style.display = 'none';
    }
  }
});