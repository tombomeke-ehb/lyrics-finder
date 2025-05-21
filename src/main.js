import Router from './JS/router.mjs'
import { setupHomePage } from './JS/homepageScript.mjs';
import { setupFindLyricsPage } from './JS/searchSongsScript.mjs';
import { setupSettingsPage } from './JS/settingsScript.mjs';
import { setupSavedSongsPage } from './JS/savedSongsScript.mjs';
import './CSS/style.css'

// Images

const logo = './images/logo.png'
const logoWhite = './images/logo-white.png'
const favicon = './images/favicon1.png'
const menuBurgerLightMode = './images/menu-burger-lightmode.svg'
const menuBurgerDarkMode = '.c/images/menu-burger-darkmode.svg'
const closeIconLight = './images/close-button-white.svg'
const gearIconLight = './images/gear-icon-light-mode.svg'

const home = (container) => {
  container.innerHTML = `
  <link rel="icon" type="image/png" href="${favicon}" />
  <div>
    <nav class="navbar">
      <div class="logo-container">
        <img src="${logo}" alt="Logo" class="logo" size="100" width="100" height="100">
      </div>
      <ul>
        <li><a href="#/" class="active">Home</a></li>
        <li><a href="#/findlyrics">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer">
            <img id="burgerIcon" class="menu" src="${menuBurgerLightMode}" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="${closeIconLight}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a href="#/settings" class="settings"><img src="${gearIconLight}"> Settings</a>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
  <div class="intro-text">
  <h1>Welkom bij Lyrics Finder!</h1>

  <p>
    Met Lyrics Finder zoek je razendsnel naar je favoriete liedjes én hun songteksten.
    Typ de naam van een artiest of een nummer in het zoekveld, en ontdek direct de bijbehorende tracks.
  </p>

  <p>
    Klik op "Toon lyrics" om de volledige songtekst te bekijken, of luister naar een korte preview van het nummer.
  </p>

  <p>
    Heb je een liedje gevonden dat je wilt bewaren? Sla het eenvoudig op met de "Opslaan"-knop, zodat je het later altijd snel terugvindt onder Saved Songs.
  </p>

  <h2>Handige tips:</h2>
  <ul>
    <li>Gebruik het menu om te navigeren tussen zoeken, opgeslagen liedjes en instellingen.</li>
    <li>In de instellingen kun je het thema wijzigen (licht/donker), animaties aan- of uitzetten, en het aantal zoekresultaten aanpassen.</li>
  </ul>

  <p>
    Veel plezier met het ontdekken van muziek en lyrics!
  </p>
</div>
  `;
  setupHomePage();
};



const findlyrics = (container) => {
  container.innerHTML = `
  <div>
    <nav class="navbar">
      <div class="logo-container"><img src="${logo}" alt="Logo" class="logo" size="100" width="100" height="100"></div>
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#/findlyrics" class="active">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer" class="">
            <img id="burgerIcon" class="menu" src="${menuBurgerLightMode}" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="${closeIconLight}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a href="#/settings" class="settings"><img id='gear-icon' src="${gearIconLight}"> Settings</a>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
<div class="filters-container">
  <div class="filter-group">
    <label for="genre-filter">Genre</label>
    <select id="genre-filter">
      <option value="">Alle genres</option>
      <option value="Pop">Pop</option>
      <option value="Rock">Rock</option>
      <option value="Hip-Hop">Hip-Hop</option>
      <option value="Electronic">Electronic</option>
      <option value="R&B">R&B</option>
      <option value="Alternative">Alternative</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="year-filter">Tijdperk</label>
    <select id="year-filter">
      <option value="">Alle jaren</option>
      <option value="2020">2020 - Heden</option>
      <option value="2010">2010 - 2019</option>
      <option value="2000">2000 - 2009</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="sort-select">Sorteren op</label>
    <select id="sort-select">
      <option value="relevance">Relevantie</option>
      <option value="name">Titel</option>
      <option value="artist">Artiest</option>
      <option value="date">Datum (nieuwste)</option>
    </select>
  </div>

  <button id="reset-filters">Filters resetten</button>
</div>
  <div class="input-container">
    <h1>🎵 Lyrics Finder</h1>

    <input type="text" id="searchInput" minlength="2" required placeholder="Typ artiest of liedtitel..." />
    <button id="zoekLiedjes">Zoek liedjes</button>

    <div id="results"></div>

  </div>

  <div id="burgerNav">
    <h1>Menu</h1>
  </div>
  `;
  setupFindLyricsPage();
};

const savedsongs = (container) => {
  container.innerHTML = `
  <div>
    <nav class="navbar">
      <div class="logo-container">
        <img src="${logo}" alt="Logo" class="logo" size="100" width="100" height="100">
      </div>
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#/findlyrics">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer">
            <img id="burgerIcon" class="menu" src="${menuBurgerLightMode}" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="${closeIconLight}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs" class="active">Saved Songs</a></li>
                <li id="settings"><a href="#/settings" class="settings"><img src="${gearIconLight}"> Settings</a>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
    <div class="input-container" id="input-container">
    <div id="results"></div>
    </div>
  `;
  setupSavedSongsPage();
};

const settings = (container) => {
  container.innerHTML = `
    <div>
      <nav class="navbar">
        <div class="logo-container">
          <img src="${logo}" alt="Logo" class="logo" width="100" height="100">
        </div>
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/findlyrics">Zoek Liedjes</a></li>
          <li>
            <div id="menuContainer">
              <img id="burgerIcon" class="menu" src="${menuBurgerLightMode}" alt="Open menu">
              <div id="burgerNav">
                <img id="closeIcon" src="${closeIconLight}" alt="Sluit menu">
                <h1>Menu</h1>
                <ul class="burgernav">
                  <li><a href="#/savedsongs">Saved Songs</a></li>
                  <li id="settings"><a href="#/settings" class="settings active"><img src="${gearIconLight}"> Settings</a></li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <div class="settings-panel">
        <h1>Settings</h1>
        <div class="setting-row">
  <span>🌗</span>
  <span id="theme-label" class="status-label">Dark mode</span>
  <label class="switch">
    <input type="checkbox" id="theme-toggle">
    <span class="slider"></span>
  </label>
</div>
<div class="setting-row">
  <span>🎞️</span>
  <span id="animation-label" class="status-label">Animaties aan</span>
  <label class="switch">
    <input type="checkbox" id="animation-toggle">
    <span class="slider"></span>
  </label>
</div>
<div class="setting-row">
  <span>🎵 Aantal resultaten</span>
  <select id="song-limit">
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="25">25</option>
  </select>
</div>
  <button id="clear-cache">🧹 Cache/data wissen</button>
  </div>
</div>
  `;
  setupSettingsPage();
}

const notFound = (container) => {
  container.innerHTML = `
  <h1>404 - Pagina niet gevonden</h1>
  <p>Sorry, de pagina die je zoekt bestaat niet.</p>
  <nav>
    <a href="#/">Terug naar home</a>
  `;
};

const router = new Router({
  '/': home,
  '/findlyrics': findlyrics,
  '/savedsongs': savedsongs,
  '/settings': settings,
  '/404': notFound
})