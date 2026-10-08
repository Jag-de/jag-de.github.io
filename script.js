/* =========================
   FLYING ARROW
========================= */

(() => {
  "use strict";

  const arrow = document.getElementById("arrow");
  const arrowPath = document.getElementById("arrowPath");
  const arrowHead = document.getElementById("arrowHead");

  if (!arrow || !arrowPath || !arrowHead) {
    return;
  }

  const pathLength = arrowPath.getTotalLength();

  arrowPath.style.strokeDasharray = pathLength;
  arrowPath.style.strokeDashoffset = pathLength;

  let animationFrame = null;

  function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
  }

  function updateArrow() {
    const scrollTop = window.scrollY;

    const scrollableHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? clamp(scrollTop / scrollableHeight)
        : 0;

    /* Draw arrow */
    const drawProgress = clamp(progress * 1.25);

    arrowPath.style.strokeDashoffset =
      pathLength * (1 - drawProgress);

    /* Arrow head */
    arrowHead.style.opacity =
      progress > 0.72 ? "1" : "0";

    /* Arrow movement */
    const movement =
      progress * window.innerHeight * 0.55;

    const rotation =
      progress * 8 - 4;

    arrow.style.transform =
      `translate(-50%, ${movement}px) rotate(${rotation}deg)`;

    animationFrame = null;
  }

  function requestUpdate() {
    if (animationFrame !== null) {
      return;
    }

    animationFrame =
      requestAnimationFrame(updateArrow);
  }

  window.addEventListener(
    "scroll",
    requestUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestUpdate,
    { passive: true }
  );

  updateArrow();
})();


/* =========================
   PROJECT PAGINATION
========================= */

(() => {
  "use strict";

  const PER_PAGE = 9;

  const gallery = document.querySelector(".project-gallery");
  const nav = document.getElementById("pagination");

  if (!gallery || !nav) {
    return;
  }

  const cards = Array.from(gallery.querySelectorAll(".project-card"));
  const totalPages = Math.ceil(cards.length / PER_PAGE);

  let current = 1;

  function showPage(page, shouldScroll = true) {
    current = page;

    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    cards.forEach((card, i) => {
      card.hidden = !(i >= start && i < end);
    });

    renderNav();

    /* Only scroll when the user clicks, not on first load */
    if (shouldScroll) {
      gallery.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function makeButton(label, page, className) {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = className;
    btn.textContent = label;

    btn.addEventListener("click", () => showPage(page));

    return btn;
  }

  function renderNav() {
    nav.innerHTML = "";

    if (totalPages <= 1) {
      return;
    }

    /* Projects are listed newest first, so page 1 = newest */
    if (current > 1) {
      nav.appendChild(
        makeButton("\u2190 Newer Projects", current - 1, "pagination-newer")
      );
    }

    if (current < totalPages) {
      nav.appendChild(
        makeButton("Older Projects \u2192", current + 1, "pagination-older")
      );
    }
  }

  showPage(1, false);
})();