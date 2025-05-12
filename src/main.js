import Router from './JS/router.mjs'
import { setupHomePage } from './JS/indexScript.mjs';
import { setupFindLyricsPage } from './JS/testScript.mjs';
import './CSS/style.css'

// Images

import logo from './images/logo.png'
import logoWhite from './images/logo-white.png'
import menuBurgerLightMode from './images/menu-burger-lightmode.svg'
import menuBurgerDarkMode from './images/menu-burger-white.svg'
import closeIconLight from './images/close-button-white.svg'
import gearIconLight from './images/gear-icon-light-mode.svg'

const home = (container) => {
  container.innerHTML = `
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
                <li id="settings"><a class="settings"><img src="${gearIconLight}"> Settings</a>
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
        <li><a href="#" class="active">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer" class="">
            <img id="burgerIcon" class="menu" src="${menuBurgerLightMode}" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="${closeIconLight}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a class="settings"><img id='gear-icon' src="${gearIconLight}"> Settings</a>
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
  '/404': notFound
})