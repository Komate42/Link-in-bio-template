/* ==========================================================
   Sötét / világos mód
   - Első látogatáskor a rendszer beállítását követi
   - Utána megjegyzi a választást (localStorage)
   ========================================================== */

const STORAGE_KEY = "theme";
const root = document.documentElement;

function getSavedTheme() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function saveTheme(theme) {
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* privát mód: nem baj */ }
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// A téma azonnal beáll (még a body betöltése előtt), így nincs villanás
let currentTheme = getSavedTheme() || systemTheme();
root.setAttribute("data-theme", currentTheme);

function applyTheme(theme) {
  currentTheme = theme;
  root.setAttribute("data-theme", theme);

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Világos mód bekapcsolása" : "Sötét mód bekapcsolása"
    );
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0f0e17" : "#f3f1fa");
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);

  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });

  /* ------------------------------------------------------
     Profilkép tartalék: ha nincs avatar.jpg, a név
     kezdőbetűiből készül egy ideiglenes kép.
     ------------------------------------------------------ */
  const avatar = document.getElementById("avatar");
  if (avatar) {
    avatar.addEventListener("error", () => {
      const name = document.querySelector(".name").textContent.trim();
      const initials = name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112">` +
        `<rect width="112" height="112" fill="#5b4bff"/>` +
        `<text x="50%" y="50%" dy=".35em" text-anchor="middle" ` +
        `font-family="Poppins, Arial, sans-serif" font-size="42" font-weight="600" fill="#fff">${initials}</text>` +
        `</svg>`;
      avatar.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }, { once: true });
  }
});

// Ha a látogató még nem választott, kövesse a rendszer beállítás változását
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!getSavedTheme()) applyTheme(e.matches ? "dark" : "light");
});
