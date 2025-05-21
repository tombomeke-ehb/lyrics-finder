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

// Generic function to apply all settings from local storage
// This function is called when the page loads to set the initial state of the settings
export function applySettingsFromStorage() {
  applyThemeFromStorage();
  applyAnimationsFromStorage();
  applySongLimitFromStorage();
}