// themeUtils.mjs
export function applyThemeFromStorage() {
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
}

export function applyAnimationsFromStorage() {
  const animSetting = localStorage.getItem("animations") || "on";
  document.body.classList.toggle("no-animation", animSetting !== "on");
}


export function applySongLimitFromStorage() {
  const songLimit = localStorage.getItem("songLimit") || "10";
  const select = document.getElementById("song-limit");
  if (select) {
    select.value = songLimit;
  }
}


export function applySettingsFromStorage() {
  applyThemeFromStorage();
  applyAnimationsFromStorage();
  applySongLimitFromStorage();
}