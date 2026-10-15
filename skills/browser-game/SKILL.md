---
name: browser-game
description: Make a small, polished game that runs in the browser (arcade, puzzle, clicker, snake, platformer) with HTML5 canvas and plain JavaScript. Use when the user asks for a game.
license: MIT
---

# Browser game playbook

## Shape
- Files: `index.html` (canvas + minimal UI), `game.js`, optional `styles.css`. No libraries unless the user asks.
- One fixed-timestep loop: `update(dt)` then `render()`, driven by `requestAnimationFrame`; clamp `dt` to avoid jumps after tab switches.
- Game states: `menu → playing → paused → gameover`, with a visible way to start and restart.

## Feel (this is what makes it fun)
- Input: keyboard AND touch/mouse so it works on phones; show the controls on the menu screen.
- Juice: screen shake on hits, particles on scoring, easing on movement, a tiny squash/stretch. Keep it subtle.
- Difficulty ramps up over time; first 10 seconds should be easy.
- Score + best score saved in `localStorage` (wrap in try/catch).
- Sound is optional: generate simple beeps with the Web Audio API instead of loading files; add a mute toggle.

## Canvas details
- Handle high-DPI screens: scale the canvas by `devicePixelRatio`.
- Resize with the window; keep the play area aspect ratio and letterbox if needed.
- Draw with simple shapes and a cohesive palette (3–5 colors) — no external image URLs.

## Finish
- Play-test mentally: can the player lose? win? restart? Does pause work?
- Tell the user how to play in two lines and suggest fun upgrades (levels, power-ups, leaderboard).
