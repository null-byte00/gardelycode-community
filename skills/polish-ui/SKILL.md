---
name: polish-ui
description: Make an existing interface look premium — spacing, typography, color, states and motion — without changing what it does. Use when the user says it looks plain, ugly, old, or asks to "make it beautiful".
license: MIT
---

# UI polish playbook

Work in small, reviewable edits. Never rewrite the app's logic while polishing.

## Pass 1 — foundation
- Introduce design tokens (`--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--radius`, spacing scale 4/8/12/16/24/32/48) and replace hard-coded values with them.
- One font family for UI (system stack is fine), consistent sizes: 12 / 14 / 16 / 20 / 28 / 40.
- Align everything to the spacing scale; give sections room to breathe.

## Pass 2 — hierarchy & color
- One primary action per screen; secondary actions are quieter (ghost/outline).
- Limit color: neutrals + one accent + semantic colors (success/warn/error). Check contrast ≥ 4.5:1.
- Group related things with whitespace before reaching for borders.

## Pass 3 — states
- Every interactive element: hover, focus-visible ring, active, disabled.
- Empty, loading (skeletons), and error states that tell the user what to do next.

## Pass 4 — motion
- 150–250 ms ease-out transitions on `transform`/`opacity` only; no layout-thrashing animations.
- Respect `prefers-reduced-motion`.

## Finish
- Compare before/after in the preview at desktop and phone widths.
- List the changes in plain words so a beginner understands why it looks better.
