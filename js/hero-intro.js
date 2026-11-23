// Page intro, after the studio_works mockup: the [data-intro] block (homepage hero, About intro) fades in
// while its heading types out, then rises into place as its pictures grow in one after another
// and any paragraphs below the heading rise in line by line.
(() => {
  window.heroIntro = true; // tells the head script's safety timer this script took over
  const root = document.documentElement;
  const block = document.querySelector("[data-intro]");
  if (!block || !root.classList.contains("js")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return root.classList.remove("js");

  const anims = [];
  const play = (el, keyframes, options) => {
    const a = el.animate(keyframes, { fill: "both", ...options });
    anims.push(a);
    return a.finished;
  };

  // homepage hero: screen readers get the sentence once with the logo names, not letter by letter
  const lines = [...block.querySelectorAll(".line")];
  if (lines.length) {
    const label = lines.flatMap((line) => [...line.childNodes]).map((n) => n.alt ?? n.textContent).join(" ");
    block.setAttribute("aria-label", label.replace(/\s+/g, " ").replace(/ ,/g, ",").trim());
  }

  // each text run becomes one span (so the homepage's flex items and gaps stay as they were). Inside it, the heading
  // gets a span per letter (it types out); other text (About's paragraphs) a span per word (it rises in line by line)
  const texts = [];
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) if (walker.currentNode.textContent.trim()) texts.push(walker.currentNode);
  const runs = [];
  const letters = [];
  const words = [];
  for (const node of texts) {
    const inHeading = node.parentElement.closest("h1");
    const run = document.createElement("span");
    for (const piece of node.textContent.match(inHeading ? /\s+|\S/gu : /\s+|\S+/gu)) {
      if (/^\s/.test(piece)) {
        run.append(piece);
        continue;
      }
      const span = document.createElement("span");
      span.textContent = piece;
      if (!inHeading) span.style.display = "inline-block"; // lets a word move up; spaces stay text, so lines wrap as before
      run.append(span);
      (inHeading ? letters : words).push(span);
    }
    node.replaceWith(run);
    runs.push(run);
  }

  // end state is the plain CSS without .js, so drop the class and the held animation values together,
  // and turn the letter and word spans back into plain text (proper kerning, and screen readers read words again)
  const finish = () => {
    root.classList.remove("js");
    anims.forEach((a) => a.cancel());
    runs.forEach((run) => run.replaceWith(run.textContent));
  };

  const intro = async () => {
    // paragraph lines: words that share a visual line rise together. Measured now (fonts loaded, nothing moved yet),
    // so the lines match however the text wraps at this screen width
    const tops = words.map((w) => Math.round(w.getBoundingClientRect().top));
    const lineTops = [...new Set(tops)].sort((a, b) => a - b);

    play(block, { opacity: [0, 1] }, { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)" });
    // the heading types out in 0.85s, like the homepage hero
    const typed = Promise.all(letters.map((c, i) => play(c, { opacity: [0, 1] }, { duration: 10, delay: (i * 850) / letters.length })));
    // then the paragraphs come in line by line: up 30px and fading in, 0.8s each, 0.2s apart, power2.out easing
    const lined = Promise.all(
      words.map((w, i) =>
        play(w, { transform: ["translateY(30px)", "none"], opacity: [0, 1] }, { duration: 800, delay: 850 + lineTops.indexOf(tops[i]) * 200, easing: "cubic-bezier(.25,.46,.45,.94)" })
      )
    );
    await typed;

    block.classList.add("grow"); // shows the pictures so their final size can be read before collapsing them
    const items = [...block.querySelectorAll(".hero-photo, .logo, .switch, .about-photo")];
    const ends = items.map((el) => {
      const s = getComputedStyle(el);
      return { width: s.width, marginLeft: s.marginLeft, marginRight: s.marginRight, gap: parseFloat(getComputedStyle(el.parentNode).columnGap) || 0 };
    });

    // the block rises and the pictures grow while any paragraph lines are still coming in
    await Promise.all([
      lined,
      play(block, { transform: ["translateY(40px)", "none"] }, { duration: 1300, easing: "cubic-bezier(.76,0,.24,1)" }),
      ...items.map((el, i) =>
        play(
          el,
          [
            // a zero-width item still adds a flex gap; the negative margin cancels it so the text doesn't jump
            { width: "0px", marginLeft: `-${ends[i].gap}px`, marginRight: "0px", opacity: 0, transform: "scale(.88)" },
            { width: ends[i].width, marginLeft: ends[i].marginLeft, marginRight: ends[i].marginRight, opacity: 1, transform: "none" },
          ],
          { duration: 900, delay: i * 100, easing: "cubic-bezier(.215,.61,.355,1)" }
        )
      ),
    ]);
  };

  // wait for both fonts so the text types in its real shape, not a fallback that swaps mid-way
  const fonts = document.fonts ? Promise.all(['1em "Clash Display"', '1em "Clash Grotesk"'].map((f) => document.fonts.load(f))) : Promise.resolve();
  fonts.catch(() => {}).then(intro).then(finish, finish);
})();
