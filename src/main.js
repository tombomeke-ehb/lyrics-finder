import Router from './JS/router.mjs'
import { setupHomePage } from './JS/indexScript.mjs';
import { setupFindLyricsPage } from './JS/testScript.mjs';
import './CSS/style.css'
import logo from '/public/images/logo.png';
import burgerIcon from '/public/images/menu-burger-lightmode.svg';
import closeIcon from '/public/images/close-button-white.svg';
import gearIcon from '/public/images/gear-icon.svg';

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
            <img id="burgerIcon" class="menu" src="${burgerIcon}" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="${closeIcon}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a class="settings"><img src="${gearIcon}"> Settings</a></li>
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
            <img id="burgerIcon" class="menu" src="${burgerIcon}" alt="Open menu">
            <div id="burgerNav" class="">
              <img id="closeIcon" src="${closeIcon}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a class="settings"><img id="gear-icon" src="${gearIcon}"> Settings</a></li>
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