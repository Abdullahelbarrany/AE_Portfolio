# Retro Windows Portfolio (Static)

Single-page retro Windows desktop portfolio built with vanilla HTML/CSS/JS. Everything runs client-side and works offline on GitHub Pages (no APIs or secrets).

## Structure
- `index.html` — shell and templates
- `styles.css` — Windows 95-inspired UI + responsive + print
- `app.js` — window manager, desktop apps, Ask Me logic
- `data/about_me.json` — your content/knowledge base
- `assets/` — icons, wallpaper, project images (replace as needed)
- `assets/cv.pdf` (optional) — downloaded from the CV window

## Running locally
Any static server works. Example:
```bash
npx serve .   # or python -m http.server 8000
```
Then open `http://localhost:8000`.

## Deploying to GitHub Pages
1. Commit this repo.
2. In GitHub, enable Pages for the main branch (root folder).
3. All paths are relative, so subpath hosting works without changes.

## Customizing content
Edit `data/about_me.json`:
- Update `name`, `title`, `location`, `email`, `links`.
- Adjust `bio_short`, `bio_long`, `stats`, `skills`, `process_steps`.
- Add projects with `images` and `links`; set `featured_project_ids` (3 items).
- Add achievements, experience, and education entries.

## Updating visuals
- Replace wallpaper: drop a new image in `assets/wallpaper/` and update `styles.css` background URL.
- Swap icons in `assets/icons/` (keep same filenames or update `ICONS` map in `app.js`).
- Replace project art in `assets/projects/` and point `images[]` to the new files.
- Add `assets/cv.pdf` to enable the “Download PDF” button.

## Accessibility & performance
- Semantic HTML, ARIA labels on interactive elements, prefers-reduced-motion respected.
- Lazy loading on project thumbnails; minimal JS, no external requests.

## Troubleshooting
- If Ask Me.exe shows no data, check console for JSON load errors and confirm the file path.
- For mobile overlap, ensure images aren’t oversized; they’re set to responsive width by default.

## Credits
Feel free to adapt the design—just keep the relative paths for GitHub Pages friendliness.
