// Hero intro, after the studio_works mockup: the hero fades in while its text types out,
// then rises into place as the photo, logos and switch grow in one after another.
(() => {
  window.heroIntro = true; // tells the head script's safety timer this script took over
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  if (!hero || !root.classList.contains("js")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return root.classList.remove("js");

  const anims = [];
  const play = (el, keyframes, options) => {
    const a = el.animate(keyframes, { fill: "both", ...options });
    anims.push(a);
    return a.finished;
  };
  // end state is the plain CSS without .js, so drop the class and the held animation values together
  const finish = () => {
    root.classList.remove("js");
    anims.forEach((a) => a.cancel());
  };

  const nodes = [...hero.querySelectorAll(".line")].flatMap((line) => [...line.childNodes]);

  // screen readers get the sentence once, not letter by letter
  const label = nodes.map((n) => n.alt ?? n.textContent).join(" ");
  hero.setAttribute("aria-label", label.replace(/\s+/g, " ").replace(/ ,/g, ",").trim());

  // one span per text run keeps the flex items (and their gaps) as before; each letter inside gets its own span
  const chars = [];
  for (const node of nodes) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
    const run = document.createElement("span");
    for (const ch of node.textContent) {
      if (/\s/.test(ch)) {
        run.append(ch);
        continue;
      }
      const span = document.createElement("span");
      span.textContent = ch;
      run.append(span);
      chars.push(span);
    }
    node.replaceWith(run);
  }

  const intro = async () => {
    play(hero, { opacity: [0, 1] }, { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)" });
    await Promise.all(chars.map((c, i) => play(c, { opacity: [0, 1] }, { duration: 10, delay: (i * 850) / chars.length })));

    hero.classList.add("grow"); // shows the logos so their final size can be read before collapsing them
    const items = [...hero.querySelectorAll(".hero-photo, .logo, .switch")];
    const ends = items.map((el) => {
      const s = getComputedStyle(el);
      return { width: s.width, marginLeft: s.marginLeft, marginRight: s.marginRight, gap: getComputedStyle(el.parentNode).columnGap };
    });

    await Promise.all([
      play(hero, { transform: ["translateY(40px)", "none"] }, { duration: 1300, easing: "cubic-bezier(.76,0,.24,1)" }),
      ...items.map((el, i) =>
        play(
          el,
          [
            // a zero-width item still adds a flex gap; the negative margin cancels it so the text doesn't jump
            { width: "0px", marginLeft: `-${ends[i].gap}`, marginRight: "0px", opacity: 0, transform: "scale(.88)" },
            { width: ends[i].width, marginLeft: ends[i].marginLeft, marginRight: ends[i].marginRight, opacity: 1, transform: "none" },
          ],
          { duration: 900, delay: i * 100, easing: "cubic-bezier(.215,.61,.355,1)" }
        )
      ),
    ]);
  };

  // wait for the display font so the text types in its real shape, not a fallback that swaps mid-way
  const font = document.fonts ? document.fonts.load('1em "Clash Display"') : Promise.resolve();
  font.catch(() => {}).then(intro).then(finish, finish);
})();
