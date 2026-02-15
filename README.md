# Abdullah Elbarrany Portfolio

Retro desktop-style portfolio built with vanilla HTML, CSS, and JavaScript.

## Portfolio flow
1. The app loads `data/about_me.json`.
2. A background `AI Oscilloscope Face` canvas effect starts (waveform -> robot face -> waveform).
3. Desktop icons and Start menu are rendered.
4. The `About` window opens by default.
5. Users navigate apps by double-clicking desktop icons or using Start menu entries.

## Desktop apps
- `About`: slide-style intro, quick stats, featured projects, and CTA buttons.
- `Projects`: explorer + project cards, opens project detail windows.
- `Pictures`: image gallery and picture viewer windows.
- `Publications`: papers, reviewer service, and blog links from JSON.
- `CV`: embedded PDF view with download fallback.
- `Achievements`: awards and milestones.
- `Ask Me.exe`: chat UI that calls an external Ask API.
- `MazeGame.exe`: interactive BFS/DFS maze visualizer with saved state.
- `Contact`: quick links and copy-to-clipboard email.

## Project structure
- `index.html`: app shell and window template.
- `styles.css`: desktop/theme styling, responsive rules, print styles.
- `app.js`: window manager, app rendering, background animation, interactions.
- `data/about_me.json`: profile content, projects, publications, links, Ask config.
- `worker.js`: Cloudflare Worker implementation for `/status` and `/ask`.
- `api/ask_limit.php`: local PHP rate-limit helper (optional/legacy path).
- `assets/`: icons, wallpaper, project images, and static files.

## Ask Me.exe behavior
- Frontend reads Ask settings from `data/about_me.json` under `ask_me`.
- It calls:
  - `GET {api_base}/status`
  - `POST {api_base}/ask`
- Request limit is enforced per IP by the backend.
- The current worker supports Gemini and KV binding `ASK_LIMITS`.


## Content updates
Edit `data/about_me.json` to update:
- `name`, `title`, `location`, `email`, `links`
- `bio_short`, `bio_long`, `skills`, `stats`, `process_steps`
- `projects`, `featured_project_ids`
- `achievements`, `experience`, `education`, `certifications`
- `publications`, `reviewer_service`, `blogs`
- `ask_me` config (`api_base`, prompt, and limits)

## Visual updates
- Background animation logic: `app.js` (`ensureBackgroundOscilloscope`, `startBackgroundOscilloscope`).
- Desktop/window styles: `styles.css`.
- Icons and images: replace files inside `assets/` and keep paths aligned with JSON.

