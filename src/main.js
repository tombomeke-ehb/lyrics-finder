import Router from './JS/router.mjs'
import { setupHomePage } from './JS/homepageScript.mjs';
import { setupFindLyricsPage } from './JS/searchSongsScript.mjs';
import { setupSettingsPage } from './JS/settingsScript.mjs';
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

  <div class="input-container">
    <h1>🎵 Lyrics Finder</h1>

    <input type="text" id="searchInput" placeholder="Typ artiest of liedtitel..." />
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
  <h1>Test</h1>
  `;
}

const settings = (container) => {
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
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a href="#/settings" class="settings active"><img src="${gearIconLight}"> Settings</a></li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
    <div class="input-container">
      <h1>Settings</h1>
      <label>
        🌗 <span>Dark mode</span>
        <input type="checkbox" id="theme-toggle">
      </label>
      <br>
      <label>
        🎞️ <span>Animaties aan/uit</span>
        <input type="checkbox" id="animation-toggle">
      </label>
      <br>
      <label>
        🎵 <span>Aantal resultaten</span>
        <select id="song-limit">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
      <br>
      <button id="clear-cache">🧹 Cache/data wissen</button>
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