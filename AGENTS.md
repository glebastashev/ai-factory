# ai-factory

- This is the active GitHub checkout for three frontend prototypes. GitHub Pages publishes main:/docs. Run `npm run build:pages` and commit docs alongside source changes.
- Keep `/` with process cards, `/version-2.html` with FlowScene, and `/version-3.html` with OrbitScene. All share App and every section.
- Keep white/cobalt/lime styling and the existing Unbounded / JetBrains Mono font pair.
- Do not render animation pause/play controls. Keep reduced-motion, offscreen and hidden-tab handling. Preserve the useful product scenario launch controls.
- Process cards are 10% smaller; keep the stage labels separate with a clear gap throughout transitions. Cycle every 2.4 seconds with 900ms movement.
- Section order begins hero, solutions, tasks, economics, products.
- Preserve the Telegram-styled founder button and exact channel link/name already in App.
- Model cases and calculator values are examples, not claims of completed client projects.
- Use `assetUrl` and Vite base for public image paths so project-path deployment works.
- Run `npm test` and `npm run build:pages`; verify all three HTML pages and their assets before publishing.
