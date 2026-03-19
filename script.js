(() => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // --- Smooth scrolling (with sticky-nav offset) ---
  const stickyNav = document.querySelector("[data-sticky-nav]");
  const getNavOffset = () => {
    if (!stickyNav) return 0;
    return Math.max(0, stickyNav.getBoundingClientRect().height + 14);
  };

  // --- Mobile menu (hamburger) ---
  const menuBtn = document.getElementById("menuBtn");
  const primaryNav = document.getElementById("primaryNav");

  const closeMenu = () => {
    primaryNav?.classList.remove("is-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    if (!primaryNav) return;
    const nextOpen = !primaryNav.classList.contains("is-open");
    primaryNav.classList.toggle("is-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(nextOpen));
  };

  menuBtn?.addEventListener("click", toggleMenu);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });

  const scrollToTarget = (targetEl) => {
    const offset = getNavOffset();
    const y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: Math.max(0, y),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  document.addEventListener("click", (event) => {
    const link = event.target?.closest?.('a[href^="#"], button[data-scroll-link], a[data-scroll-link]');
    if (!link) return;

    const href = link.getAttribute?.("href");
    if (!href) return;
    if (href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    // Only intercept links marked for smooth behavior, plus nav links.
    const shouldHandle = link.hasAttribute("data-scroll-link") || link.hasAttribute("data-nav-link");
    if (!shouldHandle) return;

    event.preventDefault();
    closeMenu();
    history.pushState(null, "", href);
    scrollToTarget(target);
  });

  // --- Scroll reveal animations ---
  const revealEls = document.querySelectorAll("[data-reveal].reveal");
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // --- Active section highlight in the sticky nav ---
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link][href^='#']"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const ratioById = new Map();

    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          ratioById.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratioById.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (!bestId) return;
        navLinks.forEach((a) => {
          const isActive = a.getAttribute("href") === `#${bestId}`;
          a.classList.toggle("is-active", isActive);
        });
      },
      {
        threshold: [0.15, 0.35, 0.55],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    sections.forEach((sec) => activeObserver.observe(sec));
  }

  // --- Minimal i18n (language switcher) ---
  const dictionary = {
    en: {
      navAbout: "About",
      navProjects: "Projects",
      navAchievements: "Achievements",
      navTeam: "Team",
      navContact: "Contact",
      langToggle: "EN",
      heroTag: "First Lego League Team",
      heroSub:
        "We build solutions with creativity, discipline, and teamwork—turning ideas into real impact.",
      heroLearnMore: "Learn More",
      heroSeeProjects: "See Projects",
      metaFocus: "Design",
      metaFocusLabel: "Strategy + Engineering",
      metaTeam: "Teamwork",
      metaTeamLabel: "Collaboration-first",
      metaValues: "Values",
      metaValuesLabel: "Respect + Integrity",
      aboutTitle: "About Our Team",
      aboutSubtitle:
        "Obalduyes is a First Lego League team focused on thoughtful design, clear communication, and measurable progress.",
      fllWhatTitle: "What is FLL?",
      fllWhat:
        "First Lego League (FLL) is an inspiring robotics program where teams solve real-world challenges through research, building, and presenting their solutions.",
      goalsTitle: "Our goals and values",
      projectsTitle: "Our Projects",
      projectsSubtitle:
        "A selection of the challenges we’ve explored. Each project combines engineering work with research and storytelling.",
      achievementsTitle: "Achievements",
      achievementsSubtitle:
        "Awards and competitions that reflect our progress, teamwork, and communication.",
      teamTitle: "Team Members",
      teamSubtitle:
        "A small, focused crew with roles that keep our workflow calm and efficient.",
      contactTitle: "Contact",
      contactSubtitle:
        "Minimal, direct ways to connect. Update the links below with your team details.",
      viewMore: "View More",
      emailBtn: "Email",
      youtubeBtn: "YouTube",
      translatorBtn: "Translator",
      footerMeta: "Modern portfolio for an FLL team.",
    },
    ru: {
      navAbout: "О нас",
      navProjects: "Проекты",
      navAchievements: "Достижения",
      navTeam: "Команда",
      navContact: "Контакты",
      langToggle: "RU",
      heroTag: "Команда First Lego League",
      heroSub:
        "Мы создаём решения с креативом, дисциплиной и командной работой — превращаем идеи в реальный эффект.",
      heroLearnMore: "Узнать больше",
      heroSeeProjects: "Проекты",
      metaFocus: "Дизайн",
      metaFocusLabel: "Стратегия + инженерия",
      metaTeam: "Командность",
      metaTeamLabel: "Работа в команде",
      metaValues: "Ценности",
      metaValuesLabel: "Уважение + честность",
      aboutTitle: "О нашей команде",
      aboutSubtitle:
        "Obalduyes — команда First Lego League, которая уделяет внимание продуманному дизайну, ясной коммуникации и измеримому прогрессу.",
      fllWhatTitle: "Что такое FLL?",
      fllWhat:
        "First Lego League (FLL) — вдохновляющая программа, где команды решают реальные задачи через исследования, сборку и презентацию решений.",
      goalsTitle: "Наши цели и ценности",
      projectsTitle: "Наши проекты",
      projectsSubtitle:
        "Небольшая подборка задач, которые мы исследовали. Каждый проект сочетает инженерную работу, исследования и сторителлинг.",
      achievementsTitle: "Достижения",
      achievementsSubtitle:
        "Награды и конкурсы, которые отражают наш прогресс, командную работу и коммуникацию.",
      teamTitle: "Участники команды",
      teamSubtitle:
        "Небольшая, сфокусированная команда с ролями, которые помогают держать процесс спокойным и эффективным.",
      contactTitle: "Контакты",
      contactSubtitle:
        "Минимальные и прямые способы связи. Обновите ссылки ниже данными вашей команды.",
      viewMore: "Подробнее",
      emailBtn: "Почта",
      youtubeBtn: "YouTube",
      translatorBtn: "Переводчик",
      footerMeta: "Современное портфолио для команды FLL.",
    },
  };

  const setLanguage = (lang) => {
    const dict = dictionary[lang] ?? dictionary.en;
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("obalduyesLang", lang);
    } catch {
      // Ignore storage errors (private mode, etc.)
    }

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      if (!(key in dict)) return;
      el.textContent = dict[key];
    });
  };

  const langToggle = document.getElementById("langToggle");
  const translatorBtn = document.getElementById("translatorBtn");

  const savedLang = (() => {
    try {
      return localStorage.getItem("obalduyesLang");
    } catch {
      return null;
    }
  })();

  const initialLang = savedLang === "ru" ? "ru" : "en";
  setLanguage(initialLang);

  const toggleLang = () => {
    const current = document.documentElement.lang === "ru" ? "ru" : "en";
    setLanguage(current === "ru" ? "en" : "ru");
  };

  langToggle?.addEventListener("click", toggleLang);
  translatorBtn?.addEventListener("click", toggleLang);
})();

