import { burgerMenu } from './burgerMenu.mjs';
import { PageLoad } from './pageLoad.mjs';
import {
  applyThemeFromStorage,
  applySidebarAnimationFromStorage,
  applyCompactCardsFromStorage,
  applyScrollTopButtonFromStorage
} from './themeUtils.mjs';

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
  if (!themeToggle || !themeLabel) {
    console.warn("Settings: theme-toggle or theme-label element not found, skipping theme section.");
  } else {
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
  }

  // 2. Animatie toggle
  const animToggle = document.getElementById("animation-toggle");
  const animLabel = document.getElementById("animation-label");
  if (!animToggle || !animLabel) {
    console.warn("Settings: animation-toggle or animation-label element not found, skipping animation section.");
  } else {
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
  }

  // 3. Song limit select
  const sidebarAnimToggle = document.getElementById("sidebar-animation-toggle");
  const sidebarAnimLabel = document.getElementById("sidebar-animation-label");
  if (sidebarAnimToggle && sidebarAnimLabel) {
    const sidebarAnimSetting = localStorage.getItem("sidebarAnimations") || "on";
    sidebarAnimToggle.checked = sidebarAnimSetting === "on";
    const updateSidebarAnimLabel = () => {
      sidebarAnimLabel.textContent = sidebarAnimToggle.checked
        ? "Sidebar animatie aan"
        : "Sidebar animatie uit";
    };
    updateSidebarAnimLabel();

    sidebarAnimToggle.addEventListener("change", () => {
      localStorage.setItem("sidebarAnimations", sidebarAnimToggle.checked ? "on" : "off");
      applySidebarAnimationFromStorage();
      updateSidebarAnimLabel();
    });
  }

  const compactCardsToggle = document.getElementById("compact-cards-toggle");
  const compactCardsLabel = document.getElementById("compact-cards-label");
  if (compactCardsToggle && compactCardsLabel) {
    const compactCardsSetting = localStorage.getItem("compactCards") || "off";
    compactCardsToggle.checked = compactCardsSetting === "on";
    const updateCompactCardsLabel = () => {
      compactCardsLabel.textContent = compactCardsToggle.checked
        ? "Compacte kaarten aan"
        : "Compacte kaarten uit";
    };
    updateCompactCardsLabel();

    compactCardsToggle.addEventListener("change", () => {
      localStorage.setItem("compactCards", compactCardsToggle.checked ? "on" : "off");
      applyCompactCardsFromStorage();
      updateCompactCardsLabel();
    });
  }

  const scrollTopToggle = document.getElementById("scroll-top-toggle");
  const scrollTopLabel = document.getElementById("scroll-top-label");
  if (scrollTopToggle && scrollTopLabel) {
    const scrollTopSetting = localStorage.getItem("scrollTopButton") || "on";
    scrollTopToggle.checked = scrollTopSetting === "on";
    const updateScrollTopLabel = () => {
      scrollTopLabel.textContent = scrollTopToggle.checked
        ? "Scroll knop aan"
        : "Scroll knop uit";
    };
    updateScrollTopLabel();

    scrollTopToggle.addEventListener("change", () => {
      localStorage.setItem("scrollTopButton", scrollTopToggle.checked ? "on" : "off");
      applyScrollTopButtonFromStorage();
      updateScrollTopLabel();
    });
  }

  // 4. Song limit select
  const songLimitSelect = document.getElementById("song-limit");
  if (!songLimitSelect) {
    console.warn("Settings: song-limit element not found, skipping song limit section.");
  } else {
    const savedLimit = localStorage.getItem("songLimit") || "10";
    songLimitSelect.value = savedLimit;
    songLimitSelect.addEventListener("change", () => {
      localStorage.setItem("songLimit", songLimitSelect.value);
    });
  }

  // 5. Cache/data wissen
  const clearCacheBtn = document.getElementById("clear-cache");
  if (!clearCacheBtn) {
    console.warn("Settings: clear-cache element not found, skipping cache clear section.");
  } else {
    clearCacheBtn.addEventListener("click", () => {
      if (confirm("Weet je zeker dat je alle instellingen en cache wilt wissen?")) {
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
      }
    });
  }
}