// BMEO · sitio público: menú móvil, sección activa, demo de vitrina, preguntas y animaciones.
(function () {
  document.documentElement.classList.add("js");

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ── Header con borde al bajar ──
  const header = $("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ── Menú móvil ──
  const menu = $("[data-menu]");
  const toggle = $("[data-menu-toggle]");
  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle?.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  document.addEventListener("click", (e) => {
    if (menu?.classList.contains("is-open") && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  // ── Sección activa en el menú ──
  const navLinks = $$('.main-nav a[href^="#"]');
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // ── Demo de la vitrina: cambiar colores ──
  const demo = $(".vitrina-demo");
  $$("[data-theme-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [c1, c2] = btn.dataset.themePick.split(",");
      demo?.style.setProperty("--c1", c1);
      demo?.style.setProperty("--c2", c2);
      $$("[data-theme-pick]").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
    });
  });

  // ── Preguntas: abrir una cierra las demás ──
  const faqs = $$(".faq details");
  faqs.forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) faqs.forEach((o) => o !== d && (o.open = false));
    })
  );

  // ── Aparición suave al hacer scroll (las clases .reveal vienen en el HTML) ──
  const revealTargets = $$(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // ── Año del pie de página ──
  const year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
