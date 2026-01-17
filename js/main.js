(function () {
  // Carousel
  const slides = Array.from(document.querySelectorAll(".hero-content"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  let current = slides.findIndex((s) => s.classList.contains("active"));
  if (current === -1) current = 0;
  let timer = null;
  const AUTO_MS = 5000;

  function showSlide(idx) {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    const s = slides[idx];
    const d = dots[idx];
    if (s) s.classList.add("active");
    if (d) d.classList.add("active");
    current = idx;
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, AUTO_MS);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      showSlide(i);
      startAuto();
    });
  });

  // Initialize
  if (slides.length && dots.length) {
    showSlide(current);
    startAuto();
  }

  // Smooth scroll for internal anchors
  document.addEventListener("click", function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (href === "#" || href === "#!") return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // close mobile menus if open
      closeMobileMenus();
    }
  });

  // Mobile bubble menu
  const bubble = document.getElementById("navMobileBubble");
  const bubbleMenu = document.getElementById("navMobileMenu");
  function toggleBubble() {
    if (!bubble || !bubbleMenu) return;
    bubble.classList.toggle("active");
    bubbleMenu.classList.toggle("active");
  }
  function closeMobileMenus() {
    if (!bubble || !bubbleMenu) return;
    bubble.classList.remove("active");
    bubbleMenu.classList.remove("active");
  }
  if (bubble) bubble.addEventListener("click", toggleBubble);

  // Close bubble when clicking outside
  document.addEventListener("click", function (e) {
    if (!bubble || !bubbleMenu) return;
    if (bubble.contains(e.target) || bubbleMenu.contains(e.target)) return;
    bubble.classList.remove("active");
    bubbleMenu.classList.remove("active");
  });

  // Hamburger toggle for nav links on small screens
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      const isShown = getComputedStyle(navLinks).display !== "none";
      navLinks.style.display = isShown ? "none" : "flex";
    });

    // reset on resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        navLinks.style.display = "";
      }
    });
  }

  // Accessibility: pause auto when user focuses carousel
  slides.forEach((s) => {
    s.addEventListener("mouseenter", stopAuto);
    s.addEventListener("mouseleave", startAuto);
    s.addEventListener("focusin", stopAuto);
    s.addEventListener("focusout", startAuto);
  });
})();
