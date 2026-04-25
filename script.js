const loader = document.getElementById("loader");
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function setupLoader() {
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 350);
  });
}

function setupNavigation() {
  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

function setupScrollEffects() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
}

function setupParallax() {
  const elements = document.querySelectorAll("[data-speed]");

  if (!elements.length) {
    return;
  }

  const updateParallax = () => {
    const viewportHeight = window.innerHeight;

    elements.forEach((element) => {
      const speed = Number(element.dataset.speed || 0);
      const rect = element.getBoundingClientRect();
      const offset = (rect.top - viewportHeight * 0.5) * speed;
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", updateParallax);
}

function setupScroll3DImages() {
  const elements = document.querySelectorAll(".scroll-3d");

  if (!elements.length) {
    return;
  }

  const updateScrollDepth = () => {
    const viewportHeight = window.innerHeight;

    elements.forEach((element) => {
      const image = element.querySelector("img");
      if (!image) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const depth = Number(element.dataset.depth || 0.1);
      const progress = (viewportHeight * 0.5 - rect.top) / viewportHeight;
      const clamped = Math.max(-1, Math.min(1, progress));
      const translateY = clamped * depth * 80;
      const rotateX = clamped * depth * -10;
      const rotateY = clamped * depth * 6;
      const scale = 1.06 + Math.abs(clamped) * depth * 0.16;

      image.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  };

  updateScrollDepth();
  window.addEventListener("scroll", updateScrollDepth, { passive: true });
  window.addEventListener("resize", updateScrollDepth);
}

function setupTiltCards() {
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupBranchMap() {
  const mapFrame = document.getElementById("branchMapFrame");
  const branchItems = document.querySelectorAll(".branch-item");

  if (!mapFrame || !branchItems.length) {
    return;
  }

  branchItems.forEach((item) => {
    item.addEventListener("click", () => {
      const query = item.dataset.mapQuery;
      const title = item.dataset.mapTitle;

      branchItems.forEach((branch) => {
        branch.classList.remove("is-active");
        branch.setAttribute("aria-selected", "false");
      });

      item.classList.add("is-active");
      item.setAttribute("aria-selected", "true");

      mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=11&output=embed`;
      mapFrame.title = `Google map showing ${title}`;
    });
  });
}

function setupContactForm() {
  const form = document.querySelector(".contact-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const defaultText = button.textContent;
    button.textContent = "Request Sent";

    setTimeout(() => {
      button.textContent = defaultText;
      form.reset();
    }, 1700);
  });
}

function setupGalleryTabs() {
  const tabBtns = document.querySelectorAll(".gallery-tab-btn");
  const panels = document.querySelectorAll(".gallery-panel");

  if (!tabBtns.length || !panels.length) {
    return;
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach((p) => {
        p.classList.remove("is-active");
        p.hidden = true;
      });

      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const controls = btn.getAttribute("aria-controls");
      const targetPanel = document.getElementById(controls);
      if (targetPanel) {
        targetPanel.classList.add("is-active");
        targetPanel.hidden = false;

        // Force recalculation of scroll effects on newly visible elements
        window.dispatchEvent(new Event("scroll"));
      }
    });
  });
}

function setupInteractiveModels() {
  const modelHouse = document.getElementById("model-house");
  const modelFurniture = document.getElementById("model-furniture");
  
  if (window.BEST_HOME_GLTF_MODELS) {
    if (modelHouse && window.BEST_HOME_GLTF_MODELS.house) {
      const blobHouse = new Blob([JSON.stringify(window.BEST_HOME_GLTF_MODELS.house)], { type: "application/json" });
      modelHouse.src = URL.createObjectURL(blobHouse);
    }
    
    if (modelFurniture && window.BEST_HOME_GLTF_MODELS.furnitureSet) {
      const blobFurn = new Blob([JSON.stringify(window.BEST_HOME_GLTF_MODELS.furnitureSet)], { type: "application/json" });
      modelFurniture.src = URL.createObjectURL(blobFurn);
    }
  }

  const viewers = document.querySelectorAll(".scroll-3d-model");
  
  if (!viewers.length) return;
  
  const updateModelScrolls = () => {
    const viewportHeight = window.innerHeight;
    
    viewers.forEach(viewer => {
      const rect = viewer.getBoundingClientRect();
      const offsetFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
      const progress = offsetFromCenter / viewportHeight * -1; // -0.5 when at bottom, 0.5 when at top
      
      const clamped = Math.max(-1, Math.min(1, progress));
      const defaultOrbit = viewer.getAttribute("data-initial-orbit");
      if (!defaultOrbit) return;
      
      const parts = defaultOrbit.split(" ");
      const baseTheta = parseFloat(parts[0]) || 0;
      
      // Calculate the new Y-axis orbit angle based on scroll
      const orbitX = baseTheta + (clamped * 90); // Swings 90 degrees mapped to scroll
      
      viewer.cameraOrbit = `${orbitX}deg ${parts[1]} ${parts[2]}`;
    });
  };
  
  updateModelScrolls();
  // Tie the update to scroll explicitly using requestAnimationFrame for performance
  window.addEventListener("scroll", () => requestAnimationFrame(updateModelScrolls), { passive: true });
}

setupLoader();
setupNavigation();
setupScrollEffects();
setupParallax();
setupScroll3DImages();
setupTiltCards();
setupBranchMap();
setupContactForm();
setupGalleryTabs();
setupInteractiveModels();
