---
name: landing-page
description: Build a beautiful, fast, responsive one-page website (landing page, portfolio, café, product launch) with plain HTML/CSS/JS. Use when the user asks for a site, landing, homepage or promo page.
license: MIT
---

# Landing page playbook

Goal: a page that looks professionally designed on the first try, works on phones, and needs no build step.

## Structure
1. `index.html`, `styles.css`, `script.js` in the project root (or reuse what exists).
2. Sections, in this order unless the user wants otherwise: header with logo + nav → hero (headline, one-sentence promise, primary button) → 3–6 feature/benefit cards → social proof or gallery → call to action (form or button) → footer.
3. Semantic HTML: `header`, `nav`, `main`, `section` with `id`s for anchor links, `footer`. One `h1`.

## Design rules
- Pick ONE accent color and derive tints; neutral background; text contrast ≥ 4.5:1.
- Define tokens on `:root` (`--bg`, `--text`, `--accent`, `--radius`, `--space`) and use them everywhere.
- Type scale: body 16–18px, line-height 1.6; headings with `clamp()` so they scale on phones.
- Generous spacing: sections `padding-block: clamp(56px, 10vw, 120px)`; max content width ~1100px, centered.
- Cards: soft border or very soft shadow, 12–16px radius, hover lift via `transform` only.
- Mobile first: single column under 720px, no horizontal scroll, buttons ≥ 44px tall.
- Use real-sounding copy for the user's business — never lorem ipsum. Keep emojis out unless the brand is playful.
- Images: use CSS gradients/SVG illustrations instead of external image URLs unless the user provides images.

## Forms
- Label every input, use proper `type` (`email`, `tel`, `date`), `required` where it matters.
- Without a backend: validate in `script.js`, show a friendly confirmation in place of the form, and tell the user how to connect a real form service later.

## Motion
- Subtle fade/slide-in on scroll with `IntersectionObserver`; disable under `prefers-reduced-motion`.

## Finish
- Open the preview, check desktop and phone widths, fix overflow.
- Summarize what was built and suggest 2–3 next steps (real images, a form service, a custom domain).
