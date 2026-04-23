(function themeModule() {
  "use strict";

  var THEME_KEY = "mediababa-theme";

  function resolvePreferredTheme() {
    try {
      var stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") {
        return stored;
      }

      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }

      return "light";
    } catch (error) {
      console.error("Theme preference lookup failed.", error);
      return "light";
    }
  }

  function applyTheme(theme) {
    try {
      var root = document.documentElement;
      var normalized = theme === "dark" ? "dark" : "light";

      root.setAttribute("data-theme", normalized);

      var toggle = document.querySelector("[data-theme-toggle]");
      if (toggle) {
        toggle.setAttribute("aria-pressed", String(normalized === "dark"));
        toggle.textContent = normalized === "dark" ? "Light" : "Dark";
      }

      localStorage.setItem(THEME_KEY, normalized);
    } catch (error) {
      console.error("Theme apply failed.", error);
    }
  }

  function initTheme() {
    var initial = resolvePreferredTheme();
    applyTheme(initial);

    document.addEventListener("click", function onThemeToggle(event) {
      var toggle = event.target.closest("[data-theme-toggle]");
      if (!toggle) {
        return;
      }

      var active = document.documentElement.getAttribute("data-theme");
      applyTheme(active === "dark" ? "light" : "dark");
    });
  }

  window.MediababaTheme = {
    initTheme: initTheme,
    applyTheme: applyTheme
  };
})();
