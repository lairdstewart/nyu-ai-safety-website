/* The site's only script. CSS can do this alone with a scroll-driven
   animation, but Firefox has none, so the scroll position comes from here and
   the colors stay in style.css: all this sets is --scrolled, 0 to 1. */
(function () {
  var bar = document.querySelector(".topbar");
  if (!bar) return;

  var distance = 0; /* scrolled before the bar is fully off-white */

  /* measured, not restated: --fade is style.css's to set, in any unit it likes */
  function measure() {
    var probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;visibility:hidden;height:calc(var(--fade) - var(--bar-height))";
    document.body.appendChild(probe);
    distance = probe.offsetHeight;
    probe.remove();
    update();
  }

  function update() {
    var progress = distance > 0 ? Math.min(window.scrollY / distance, 1) : 0;
    bar.style.setProperty("--scrolled", progress);
  }

  var queued = false; /* scroll outruns the repaint; one update per frame */
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      update();
    });
  }

  measure();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", measure); /* --fade is a vh */
})();
