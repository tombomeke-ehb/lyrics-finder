// themeUtils.mjs

// Aplies the theme from local storage to the document body
export function applyThemeFromStorage() {
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
}

// Aplies the animation setting from local storage to the document body
export function applyAnimationsFromStorage() {
  const animSetting = localStorage.getItem("animations") || "on";
  document.body.classList.toggle("no-animation", animSetting !== "on");
}

// Aplies the song limit from local storage to the select element
export function applySongLimitFromStorage() {
  const songLimit = localStorage.getItem("songLimit") || "10";
  const select = document.getElementById("song-limit");
  if (select) {
    select.value = songLimit;
  }
}

// Applies sidebar animation preference
export function applySidebarAnimationFromStorage() {
  const sidebarAnim = localStorage.getItem("sidebarAnimations") || "on";
  document.body.classList.toggle("sidebar-animation-off", sidebarAnim !== "on");
}

// Applies compact card preference
export function applyCompactCardsFromStorage() {
  const compactCards = localStorage.getItem("compactCards") || "off";
  document.body.classList.toggle("compact-cards", compactCards === "on");
}

function ensureScrollTopButton() {
  let btn = document.getElementById("scrollTopBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "scrollTopBtn";
    btn.className = "scroll-top-btn";
    btn.type = "button";
    btn.textContent = "↑";
    btn.setAttribute("aria-label", "Scroll naar boven");
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return btn;
}

// Applies scroll-to-top button preference and visibility behavior
export function applyScrollTopButtonFromStorage() {
  const setting = localStorage.getItem("scrollTopButton") || "on";
  const button = ensureScrollTopButton();
  const enabled = setting === "on";

  button.classList.toggle("hidden", !enabled);

  if (!window.__lyricsFinderScrollTopHandler) {
    window.__lyricsFinderScrollTopHandler = () => {
      const btn = document.getElementById("scrollTopBtn");
      if (!btn || btn.classList.contains("hidden")) return;
      btn.classList.toggle("is-visible", window.scrollY > 300);
    };
    window.addEventListener("scroll", window.__lyricsFinderScrollTopHandler, { passive: true });
  }

  window.__lyricsFinderScrollTopHandler();
}

// Generic function to apply all settings from local storage
// This function is called when the page loads to set the initial state of the settings
export function applySettingsFromStorage() {
  applyThemeFromStorage();
  applyAnimationsFromStorage();
  applySongLimitFromStorage();
  applySidebarAnimationFromStorage();
  applyCompactCardsFromStorage();
  applyScrollTopButtonFromStorage();
}