document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("darkMode") === "true";
  if (savedTheme) {
    html.classList.add("dark-mode");
  }
});
