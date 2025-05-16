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
  const themeLabel = themeToggle.parentElement.querySelector('span');
  const currentTheme = localStorage.getItem("theme") || "dark";

  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.checked = true;
    if (themeLabel) themeLabel.textContent = "Light mode";
  } else {
    document.body.classList.remove("light-mode");
    themeToggle.checked = false;
    if (themeLabel) themeLabel.textContent = "Dark mode";
  }

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
      if (themeLabel) themeLabel.textContent = "Light mode";
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
      if (themeLabel) themeLabel.textContent = "Dark mode";
    }
  });

  // 2. Animatie toggle
  const animToggle = document.getElementById("animation-toggle");
  const animLabel = animToggle.parentElement.querySelector('span');
  const animSetting = localStorage.getItem("animations") || "on";
  animToggle.checked = animSetting === "on";
  animLabel.textContent = animToggle.checked ? "Animaties aan" : "Animaties uit";

  // Zet class op body bij laden
  document.body.classList.toggle("no-animation", animSetting !== "on");

  animToggle.addEventListener("change", () => {
    const enabled = animToggle.checked;
    document.body.classList.toggle("no-animation", !enabled);
    localStorage.setItem("animations", enabled ? "on" : "off");
    animLabel.textContent = enabled ? "Animaties aan" : "Animaties uit";
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
