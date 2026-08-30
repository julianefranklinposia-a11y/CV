(() => {
  const themeToggle = document.getElementById("themeToggle");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("site-nav");
  const navLinks = nav ? [...nav.querySelectorAll("a")] : [];

  const getTheme = () =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

  const syncThemeToggle = (theme) => {
    if (!themeToggle) return;
    const next = theme === "light" ? "escuro" : "claro";
    themeToggle.setAttribute("aria-label", `Alternar para modo ${next}`);
    themeToggle.setAttribute("title", `Modo ${theme === "light" ? "claro" : "escuro"}`);
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cv-theme", theme);
    syncThemeToggle(theme);
  };

  syncThemeToggle(getTheme());

  themeToggle?.addEventListener("click", () => {
    setTheme(getTheme() === "light" ? "dark" : "light");
  });

  const setNavOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
    navToggle?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  navToggle?.addEventListener("click", () => {
    setNavOpen(!document.body.classList.contains("nav-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const el = document.querySelector(id);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  const markCurrent = () => {
    const offset = 120;
    let current = sections[0];

    for (const item of sections) {
      const top = item.el.getBoundingClientRect().top;
      if (top - offset <= 0) current = item;
    }

    sections.forEach(({ link }) => link.removeAttribute("aria-current"));
    current?.link.setAttribute("aria-current", "page");
  };

  markCurrent();
  window.addEventListener("scroll", markCurrent, { passive: true });
})();
