window.addEventListener("DOMContentLoaded", () => {
  if (typeof createAceIcons === "function") {
    createAceIcons({
      "stroke-width": 1.6
    });
  }

  const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
  const railLinks = [...document.querySelectorAll(".side-rail a[href^='#']")];
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const section = id === "top" ? document.querySelector(".hero") : document.getElementById(id);
      return { id, link, section };
    })
    .filter((item) => item.section);

  const setActiveSection = (activeId) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
    railLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
  };

  let ticking = false;
  let manualActiveUntil = 0;
  const updateActiveSection = () => {
    if (Date.now() < manualActiveUntil) {
      ticking = false;
      return;
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 24) {
      setActiveSection(sections[sections.length - 1].id);
      ticking = false;
      return;
    }

    const marker = window.scrollY + window.innerHeight * 0.38;
    const active = sections.reduce((current, item) => {
      if (item.section.offsetTop <= marker) return item;
      return current;
    }, sections[0]);

    setActiveSection(active.id);
    ticking = false;
  };

  const requestActiveUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateActiveSection);
  };

  window.addEventListener("scroll", requestActiveUpdate, { passive: true });
  window.addEventListener("resize", requestActiveUpdate);
  [...navLinks, ...railLinks].forEach((link) => {
    link.addEventListener("click", () => {
      const activeId = link.getAttribute("href").slice(1);
      manualActiveUntil = Date.now() + 900;
      setActiveSection(activeId);
    });
  });
  updateActiveSection();
});
