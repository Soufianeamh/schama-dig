const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  const closeMenu = (returnFocus = false) => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    mainNav.classList.remove("is-open");
    if (returnFocus) menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest("a")) return;
    closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (menuToggle.getAttribute("aria-expanded") !== "true") return;
    if (!(event.target instanceof Node) || menuToggle.contains(event.target) || mainNav.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
    closeMenu(true);
  });
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(".service-card, .why-card, .work-card, .process-step, .detail-row");

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.reveal = "visible";
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  revealTargets.forEach((element) => {
    element.dataset.reveal = "pending";
    revealObserver.observe(element);
  });
}

const contactForm = document.querySelector("#contact-form");

if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const phone = String(formData.get("phone") || "").trim();
    const activity = String(formData.get("activity")).trim();
    const project = String(formData.get("project")).trim();
    const message = String(formData.get("message")).trim();
    const recipientEmail = String(contactForm.dataset.recipientEmail || "").trim();
    const status = contactForm.querySelector(".form-status");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      if (status) {
        status.textContent = "Le formulaire n’est pas encore configuré pour transmettre votre demande. Aucune donnée n’a été envoyée.";
      }
      return;
    }

    const subject = encodeURIComponent(`Demande de devis — ${project}`);
    const body = encodeURIComponent(
      `Bonjour Schama Dig,\n\n${message}\n\nActivité : ${activity}\nBesoin : ${project}\n\nNom : ${name}\nE-mail : ${email}${phone ? `\nTéléphone : ${phone}` : ""}`
    );

    if (status) status.textContent = "Votre application de messagerie va s’ouvrir avec le message prérempli.";
    window.location.href = `mailto:${encodeURIComponent(recipientEmail)}?subject=${subject}&body=${body}`;
  });
}
