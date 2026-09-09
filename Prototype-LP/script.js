const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

document.documentElement.dataset.theme = isDark ? "dark" : "light";

if (themeToggle) {
  const updateThemeButton = (darkMode) => {
    themeToggle.setAttribute("aria-pressed", String(darkMode));
    themeToggle.setAttribute(
      "aria-label",
      darkMode ? "Activar modo claro" : "Activar modo oscuro",
    );
    themeToggle.querySelector("span").textContent = darkMode ? "☀" : "☾";
  };

  updateThemeButton(isDark);

  themeToggle.addEventListener("click", () => {
    const darkMode = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    updateThemeButton(darkMode);
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();
