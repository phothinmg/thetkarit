(function () {
  const htmlElement = document.querySelector("html");
  const themeBtn = document.getElementById("themebtn");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const storedTheme = localStorage.getItem("theme") || preferredTheme;

  htmlElement.classList.add(storedTheme);
  localStorage.setItem("theme", storedTheme);

  themeBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.classList.contains("dark") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.classList.replace(currentTheme, newTheme);
    localStorage.setItem("theme", newTheme);
  });
})();
