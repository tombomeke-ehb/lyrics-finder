window.addEventListener('DOMContentLoaded', function () {
    const zoekLiedjesButton = document.getElementById('zoekLiedjes');
    const loadingOverlay = document.getElementById('loadingOverlay');
  
    // Verberg de overlay zodra de pagina geladen is
    loadingOverlay.style.display = 'none';
  
    // Knop om te zoeken naar liedjes
    zoekLiedjesButton.addEventListener('click', searchSongs);
  
    // Hulpfunctie om te wachten (in milliseconden)
    function wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // 🔍 Zoek liedjes via de iTunes API
    async function searchSongs() {
      const query = document.getElementById('searchInput').value;
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Oude resultaten verwijderen
  
      if (!query.trim()) {
        // Als input leeg is
        zoekLiedjesButton.textContent = "Vul iets in!";
        wait(2000).then(() => {
          zoekLiedjesButton.textContent = "Zoek liedjes";
        });
        return;
      }
  
      // Laat loading overlay zien
      loadingOverlay.style.display = 'flex';
  
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`);
        const data = await response.json();
  
        if (data.results.length === 0) {
          resultsDiv.innerHTML = "<p>Geen resultaten gevonden.</p>";
          return;
        }
  
        // Maak voor elk resultaat een blokje met info
        data.results.forEach(song => {
          const songDiv = document.createElement('div');
          songDiv.className = 'song';
  
          // Let op: GEEN onclick meer!
          songDiv.innerHTML = `
            <img src="${song.artworkUrl100}" alt="Album cover">
            <h3>${song.trackName}</h3>
            <p><strong>Artiest:</strong> ${song.artistName}</p>
            <audio class="preview" controls src="${song.previewUrl}">Preview</audio>
            <button class="toon-lyrics" data-artist="${song.artistName}" data-title="${song.trackName}">Toon lyrics</button>
            <div class="lyrics"></div>
          `;
  
          resultsDiv.appendChild(songDiv);
        });
  
        // Voeg event listeners toe aan de lyrics-knoppen
        document.querySelectorAll('.toon-lyrics').forEach(button => {
          button.addEventListener('click', () => {
            const artist = button.dataset.artist;
            const title = button.dataset.title;
            getLyrics(artist, title, button);
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
  
    // 🎤 Haal lyrics op via lyrics.ovh API
    async function getLyrics(artist, title, buttonElement) {
      const lyricsDiv = buttonElement.nextElementSibling;
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
  });
  