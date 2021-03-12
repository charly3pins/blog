const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

document.addEventListener("DOMContentLoaded", function(event) {
    var themeSwitcher = document.getElementById("theme-switcher");

    themeSwitcher.onclick = function() {
        var currentTheme = document.documentElement.getAttribute("data-theme");
        var switchToTheme = currentTheme === "dark" ? "light" : "dark"

        document.documentElement.setAttribute("data-theme", switchToTheme);
        localStorage.setItem('theme', switchToTheme);
    }
});