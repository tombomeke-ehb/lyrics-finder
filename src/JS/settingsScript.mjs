import { burgerMenu } from './burgerMenu.mjs';
import { PageLoad } from './pageLoad.mjs';
import { applyThemeFromStorage } from './themeUtils.mjs';

// Exporteer een getter voor songLimit voor andere modules
export function getSongLimit() {
  return parseInt(localStorage.getItem('songLimit') || '10', 10);
}

export function setupSettingsPage() {
  burgerMenu();
  PageLoad();
  applyThemeFromStorage();

  // 1. Dark/Light mode toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");
  const currentTheme = localStorage.getItem("theme") || "dark";

  function updateThemeLabel() {
    if (themeToggle.checked) {
      themeLabel.textContent = "Light mode";
    } else {
      themeLabel.textContent = "Dark mode";
    }
  }

  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.checked = true;
  } else {
    document.body.classList.remove("light-mode");
    themeToggle.checked = false;
  }
  updateThemeLabel();

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
    updateThemeLabel();
  });

  // 2. Animatie toggle
  const animToggle = document.getElementById("animation-toggle");
  const animLabel = document.getElementById("animation-label");
  const animSetting = localStorage.getItem("animations") || "on";
  animToggle.checked = animSetting === "on";

  function updateAnimLabel() {
    animLabel.textContent = animToggle.checked ? "Animaties aan" : "Animaties uit";
  }
  updateAnimLabel();

  document.body.classList.toggle("no-animation", animSetting !== "on");

  animToggle.addEventListener("change", () => {
    const enabled = animToggle.checked;
    document.body.classList.toggle("no-animation", !enabled);
    localStorage.setItem("animations", enabled ? "on" : "off");
    updateAnimLabel();
  });

  // 3. Song limit select
  const songLimitSelect = document.getElementById("song-limit");
  const savedLimit = localStorage.getItem("songLimit") || "10";
  songLimitSelect.value = savedLimit;
  songLimitSelect.addEventListener("change", () => {
    localStorage.setItem("songLimit", songLimitSelect.value);
  });

  // 4. Cache/data wissen
  const clearCacheBtn = document.getElementById("clear-cache");
  clearCacheBtn.addEventListener("click", () => {
    if (confirm("Weet je zeker dat je alle instellingen en cache wilt wissen?")) {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  });
}