const SITE_CONFIG = {
  canonicalUrl: "https://onehonestconversation.com/",
  title: "One Honest Conversation",
  subtitle: "A Journey Through Curiosity, Relationship and Experience",
  author: "Aleksandar Tomovski",
  images: {
    cover: "assets/one-honest-conversation-front.jpg",
    wide: "assets/the%20third%20mind%20clean.jpg",
    author: "assets/selfportrait.jpg"
  },
  editions: {
    digital: {
      label: "Kindle eBook",
      price: "$8.99",
      url: "https://www.amazon.com/dp/B0H874VSVF"
    },
    paperback: {
      label: "Paperback",
      price: "$22.99",
      url: "https://www.amazon.com/dp/B0H854WQY2"
    },
    hardcover: {
      label: "Hardcover",
      price: "$34.99",
      url: "https://www.amazon.com/dp/B0H85GK9NF"
    }
  }
};

function applyConfiguredLinks() {
  document.querySelectorAll("[data-buy-link]").forEach((link) => {
    const edition = SITE_CONFIG.editions[link.dataset.buyLink];

    if (!edition) {
      return;
    }

    link.href = edition.url;

    if (edition.url.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#editions";
      link.removeAttribute("target");
      link.setAttribute("aria-disabled", "true");
      link.title = "Kindle eBook link coming soon";
      link.classList.add("button--disabled");
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });
}

function applyConfiguredPrices() {
  document.querySelectorAll("[data-price]").forEach((node) => {
    const edition = SITE_CONFIG.editions[node.dataset.price];

    if (edition) {
      node.textContent = edition.price;
    }
  });
}

function applyConfiguredImages() {
  document.querySelectorAll("[data-config-image]").forEach((image) => {
    const imagePath = SITE_CONFIG.images[image.dataset.configImage];

    if (imagePath) {
      image.src = imagePath;
    }
  });
}

function addStructuredData() {
  const absoluteUrl = (path) => new URL(path, SITE_CONFIG.canonicalUrl).href;
  const offers = Object.values(SITE_CONFIG.editions)
    .filter((edition) => edition.url.startsWith("http"))
    .map((edition) => ({
      "@type": "Offer",
      name: edition.label,
      price: edition.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      url: edition.url,
      availability: "https://schema.org/InStock"
    }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: SITE_CONFIG.title,
    alternateName: SITE_CONFIG.subtitle,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author
    },
    bookFormat: ["EBook", "Paperback", "Hardcover"],
    image: absoluteUrl(SITE_CONFIG.images.cover),
    url: SITE_CONFIG.canonicalUrl,
    description:
      "A philosophical dialogue about consciousness, perception, art, AI, relationships, and the quiet space where meaning appears.",
    offers
  };
  const script = document.createElement("script");

  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.append(script);
}

function setCurrentYear() {
  const yearNode = document.querySelector("[data-current-year]");

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

function initScrollNavigation() {
  const topbar = document.querySelector(".topbar");
  const toTop = document.querySelector(".to-top");
  const sections = Array.from(document.querySelectorAll("[data-nav-section]"));
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  let ticking = false;

  if (!topbar || sections.length === 0 || navLinks.length === 0) {
    return;
  }

  function setActiveSection(sectionId) {
    navLinks.forEach((link) => {
      const isActive = link.dataset.navLink === sectionId;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateScrollUi() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.36;
    const currentSection = sections.reduce((current, section) => {
      return section.offsetTop <= scrollPosition ? section : current;
    }, sections[0]);

    topbar.classList.toggle("topbar--scrolled", window.scrollY > 60);
    toTop?.classList.toggle("is-visible", window.scrollY > 650);
    setActiveSection(currentSection.dataset.navSection);
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUi);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateScrollUi();
}

applyConfiguredLinks();
applyConfiguredPrices();
applyConfiguredImages();
addStructuredData();
setCurrentYear();
initScrollNavigation();
