(function () {
    "use strict";
    var STORAGE_KEY = "cbi-theme";
    var mql = window.matchMedia("(prefers-color-scheme: light)");

    function systemTheme() {
        return mql.matches ? "light" : "dark";
    }

    function hasManualPreference() {
        var saved = localStorage.getItem(STORAGE_KEY);
        return saved === "light" || saved === "dark";
    }

    function getPreferredTheme() {
        if (hasManualPreference()) return localStorage.getItem(STORAGE_KEY);
        return systemTheme();
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
    }

    applyTheme(getPreferredTheme());

    mql.addEventListener("change", function () {
        if (!hasManualPreference()) applyTheme(systemTheme());
    });

    window.toggleSiteTheme = function () {
        var current = document.documentElement.getAttribute("data-theme") || "dark";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
    };
})();
