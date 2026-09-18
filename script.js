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
