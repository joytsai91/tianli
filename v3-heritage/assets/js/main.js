(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var toTopBtn = document.getElementById("toTop");
  var navLinks = document.querySelectorAll(".main-nav a");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    toTopBtn.classList.toggle("is-visible", window.scrollY > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener("click", function () {
    var isOpen = header.classList.toggle("nav-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      header.classList.remove("nav-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  toTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 60 + "ms";
      revealObserver.observe(el);
    });

    /* Failsafe: catch instant/large scroll jumps that IntersectionObserver's
       async batching can miss (e.g. scrollbar drag). */
    var pending = true;
    function sweepVisible() {
      var vh = window.innerHeight;
      var stillHidden = false;
      revealEls.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add("is-visible");
          revealObserver.unobserve(el);
        } else {
          stillHidden = true;
        }
      });
      pending = stillHidden;
    }
    document.addEventListener(
      "scroll",
      function () {
        if (pending) window.requestAnimationFrame(sweepVisible);
      },
      { passive: true }
    );
    sweepVisible();
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
