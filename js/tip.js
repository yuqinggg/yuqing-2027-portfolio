// Cursor-following tooltips: any [data-tip] element shows its text below-right of the pointer.
// The CSS ([data-tip]::after) places it from --tip-x/y, measured from inside the element's border.
for (const el of document.querySelectorAll("[data-tip]")) {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    // near the window's right edge it stops following sideways, so it never runs off screen (12px offset + 8px margin)
    const tipWidth = parseFloat(getComputedStyle(el, "::after").width) || 0;
    const x = Math.min(e.clientX, innerWidth - tipWidth - 20);
    el.style.setProperty("--tip-x", x - r.left - el.clientLeft + "px");
    el.style.setProperty("--tip-y", e.clientY - r.top - el.clientTop + "px");
  });
}
