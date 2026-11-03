/**
 * What a long read (blog post or case study) does in the browser: a bar above each code block with its
 * language and a copy button, a "#" link on each ## and ### heading, the table of contents beside the
 * text marking the section being read, and the folded one closing once a section is chosen.
 *
 * `root` holds the text ([data-prose], carrying the labels as data-copy, data-copied, data-anchor) and
 * the table of contents (Contents.astro).
 */
export function enhanceLongRead(root: HTMLElement) {
  const prose = root.querySelector<HTMLElement>("[data-prose]");
  if (!prose) return;

  prose.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
    const block = document.createElement("div");
    block.className = "code";
    const bar = document.createElement("div");
    bar.className = "code-bar";
    const language = document.createElement("span");
    language.textContent = pre.dataset.language && pre.dataset.language !== "plaintext" ? pre.dataset.language : "";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = prose.dataset.copy ?? "Copy";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        copy.textContent = prose.dataset.copied ?? "Copied";
        setTimeout(() => (copy.textContent = prose.dataset.copy ?? "Copy"), 1600);
      } catch {
        // The clipboard can be refused (insecure context, permissions): the code stays selectable.
      }
    });
    bar.append(language, copy);
    pre.replaceWith(block);
    block.append(bar, pre);
  });

  prose.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]").forEach((heading) => {
    const anchor = document.createElement("a");
    anchor.className = "anchor";
    anchor.href = `#${heading.id}`;
    anchor.textContent = "#";
    anchor.setAttribute("aria-label", prose.dataset.anchor ?? "Link to this section");
    heading.append(anchor);
  });

  // The section being read: the last heading that has passed the top third of the screen, computed from
  // the scroll position.
  const links = [...root.querySelectorAll<HTMLAnchorElement>(".contents-side a[data-to]")];
  const targets = links
    .map((link) => document.getElementById(link.dataset.to ?? ""))
    .filter((heading): heading is HTMLElement => heading !== null);
  let frame = 0;
  const mark = () => {
    frame = 0;
    const line = innerHeight / 3;
    let current = -1;
    targets.forEach((heading, i) => {
      if (heading.getBoundingClientRect().top <= line) current = i;
    });
    links.forEach((link, i) => {
      if (i === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  if (links.length) {
    addEventListener("scroll", () => (frame ||= requestAnimationFrame(mark)), { passive: true });
    mark();
  }

  root.querySelectorAll<HTMLAnchorElement>(".contents-fold a").forEach((link) =>
    link.addEventListener("click", () => link.closest("details")?.removeAttribute("open")),
  );
}
