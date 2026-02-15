// Retro Windows Portfolio SPA
const state = {
  windows: new Map(),
  z: 2,
  data: null,
  mobile: window.matchMedia("(max-width: 720px)").matches,
  pictures: null,
};

const ICONS = {
  about: "assets/icons/window.svg",
  pic: "assets/icons/folder.svg",
  pictures: "assets/icons/pictures.svg",
  cv: "assets/icons/doc.svg",
  achievements: "assets/icons/trophy.svg",
  ask: "assets/icons/app.svg",
  contact: "assets/icons/contact.svg",
  project: "assets/icons/folder.svg",
  publications: "assets/icons/folder.svg",
  maze: "assets/icons/maze.exe.png",
  window: "assets/icons/window.svg",
};
const IMG_PLACEHOLDER = "assets/icons/image-placeholder.svg";

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  ensureBackgroundOrb();
  buildDesktopIcons();
  buildStartMenu();
  wireStartButton();
  wireGlobalShortcuts();
  wireImageZoom();
  startClock();
  openApp("about");
});

function ensureBackgroundOrb() {
  const desktop = document.getElementById("desktop");
  if (!desktop || document.getElementById("bg-orb")) return;
  const orb = document.createElement("div");
  orb.id = "bg-orb";
  orb.setAttribute("aria-hidden", "true");
  desktop.prepend(orb);
}

async function loadData() {
  try {
    const res = await fetch("data/about_me.json");
    state.data = await res.json();
  } catch (err) {
    console.error("Failed to load data", err);
    state.data = {
      name: "Your Name",
      title: "Designer",
      bio_short: "Add your details in data/about_me.json",
      projects: [],
      achievements: [],
      skills: [],
      stats: { years: 0, specialties: [], tools: [] },
      process_steps: [],
      featured_project_ids: [],
      links: [],
      email: "you@example.com",
    };
  }
}

function buildDesktopIcons() {
    const icons = [
    { app: "pic", label: "Projects", icon: ICONS.pic },
    { app: "pictures", label: "Pictures", icon: ICONS.pictures },
    { app: "mazeGame", label: "MazeGame.exe", icon: ICONS.maze },
    { app: "publications", label: "Publications", icon: ICONS.publications },
    { app: "cv", label: "CV", icon: ICONS.cv },
    { app: "achievements", label: "Achievements", icon: ICONS.achievements },
    { app: "ask", label: "Ask Me.exe", icon: ICONS.ask },
  ];
  const wrap = document.getElementById("desktop-icons");
  wrap.innerHTML = "";
  icons.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "icon";
    btn.dataset.app = item.app;
    btn.setAttribute("role", "listitem");
    btn.innerHTML = `
      <img src="${item.icon}" alt="" loading="lazy" />
      <label>${item.label}</label>
    `;
    btn.addEventListener("dblclick", () => openApp(item.app));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openApp(item.app);
      }
    });
    wrap.appendChild(btn);
  });
}

function buildStartMenu() {
  const menu = document.getElementById("start-menu");
    const items = [
    { app: "about", label: "About", icon: ICONS.about },
    { app: "pic", label: "Projects", icon: ICONS.pic },
    { app: "pictures", label: "Pictures", icon: ICONS.pictures },
    { app: "mazeGame", label: "MazeGame.exe", icon: ICONS.maze },
    { app: "publications", label: "Publications", icon: ICONS.publications },
    { app: "cv", label: "CV", icon: ICONS.cv },
    { app: "achievements", label: "Achievements", icon: ICONS.achievements },
    { app: "ask", label: "Ask Me.exe", icon: ICONS.ask },
    { app: "contact", label: "Contact", icon: ICONS.contact },
    { app: "shutdown", label: "Shut down", icon: ICONS.window },
  ];
  menu.innerHTML = "";
  items.forEach((item) => {
    const el = document.createElement("button");
    el.className = "start-menu-item";
    el.role = "menuitem";
    el.innerHTML = `<img src="${item.icon}" alt="" /><span>${item.label}</span>`;
    el.addEventListener("click", () => {
      toggleStartMenu(false);
      if (item.app === "shutdown") return shutdown();
      openApp(item.app);
    });
    menu.appendChild(el);
  });
}

function wireStartButton() {
  const btn = document.getElementById("start-button");
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    toggleStartMenu(!expanded);
  });
  document.addEventListener("click", (e) => {
    const menu = document.getElementById("start-menu");
    if (menu.hidden) return;
    if (btn.contains(e.target) || menu.contains(e.target)) return;
    toggleStartMenu(false);
  });
}

function toggleStartMenu(show) {
  const menu = document.getElementById("start-menu");
  const btn = document.getElementById("start-button");
  menu.hidden = !show;
  btn.setAttribute("aria-expanded", show ? "true" : "false");
}

function wireGlobalShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const active = getTopWindow();
      if (active) closeWindow(active.id);
    }
  });
  window.matchMedia("(max-width: 720px)").addEventListener("change", (e) => {
    state.mobile = e.matches;
    document.body.classList.toggle("mobile-stack", state.mobile);
  });
  document.body.classList.toggle("mobile-stack", state.mobile);
}

function wireImageZoom() {
  ensureZoomOverlay();
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches("img.zoomable")) {
      openImageModal(target.getAttribute("src"), target.getAttribute("alt") || "Image");
    }

    if (target.id === "img-zoom-overlay" || target.classList.contains("img-zoom-close")) {
      closeImageModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeImageModal();
  });
}

function ensureZoomOverlay() {
  if (document.getElementById("img-zoom-overlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "img-zoom-overlay";
  overlay.innerHTML = `
    <button class="img-zoom-close" aria-label="Close image">X</button>
    <img src="" alt="Full-size view" />
  `;
  document.body.appendChild(overlay);
}

function openImageModal(src, alt) {
  const overlay = document.getElementById("img-zoom-overlay");
  if (!overlay) return;
  const img = overlay.querySelector("img");
  img.src = src || "";
  img.alt = alt || "Image";
  overlay.classList.add("show");
}

function closeImageModal() {
  const overlay = document.getElementById("img-zoom-overlay");
  if (!overlay) return;
  overlay.classList.remove("show");
}

function applyImageDefaults(root) {
  if (!root) return;
  const imgs = root.querySelectorAll("img:not(.title-icon)");
  imgs.forEach((img) => {
    if (!img.classList.contains("img-thumb") && !img.classList.contains("img-detail") && !img.classList.contains("pub-thumb")) {
      img.classList.add("img-auto");
    }
    if (!img.classList.contains("zoomable")) img.classList.add("zoomable");
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.dataset.fallbackBound) {
      img.dataset.fallbackBound = "true";
      img.addEventListener("error", () => {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = "true";
        img.src = IMG_PLACEHOLDER;
        img.alt = img.alt || "Image unavailable";
      });
    }
  });
}

function startClock() {
  const clock = document.getElementById("taskbar-clock");
  const set = () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    clock.textContent = `${hh}:${mm}`;
  };
  set();
  setInterval(set, 60000);
}

function createWindow(type, props = {}) {
  // reuse if existing unique window type
  const existing = [...state.windows.values()].find((w) => w.type === type && w.unique);
  if (existing) {
    focusWindow(existing.id);
    if (existing.minimized) minimizeWindow(existing.id, false);
    return existing.id;
  }

  const template = document.getElementById("window-template");
  const node = template.content.firstElementChild.cloneNode(true);
  const id = props.id || `win-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  node.id = id;
  node.dataset.type = type;
  node.style.zIndex = state.z++;
  const unique = props.unique === false ? false : true;
  if (state.mobile) {
    node.style.position = "relative";
    node.style.width = "100%";
    node.style.left = "0";
    node.style.top = "0";
  } else {
    if (type === "about" && state.windows.size === 0) {
      node.style.left = `calc(50% - var(--window-width) / 2)`;
      node.style.top = "80px";
    } else {
      node.style.left = `${20 + state.windows.size * 12}px`;
      node.style.top = `${32 + state.windows.size * 12}px`;
    }
  }

  const titleBar = node.querySelector(".title-bar");
  const titleText = node.querySelector(".title-text");
  const iconEl = node.querySelector(".title-icon");
  titleText.textContent = props.title || "Window";
  iconEl.src = props.icon || ICONS[type] || ICONS.about;
  iconEl.alt = "";

  const content = node.querySelector(".window-content");
  content.innerHTML = "";
  if (props.render) props.render(content);
  applyImageDefaults(content);

  // Controls
  node.querySelector(".btn-close").addEventListener("click", () => closeWindow(id));
  node.querySelector(".btn-min").addEventListener("click", () => minimizeWindow(id, true));
  node.querySelector(".btn-max").addEventListener("click", () => toggleMaximize(node));

  // Dragging
  if (!state.mobile) enableDrag(node, titleBar);

  // Focus behavior
  node.addEventListener("mousedown", () => focusWindow(id));
  node.addEventListener("focusin", () => focusWindow(id));

  document.getElementById("desktop").appendChild(node);
  addTaskbarButton(id, titleText.textContent, iconEl.src);
  state.windows.set(id, { id, type, node, minimized: false, unique });
  focusWindow(id);
  return id;
}

function enableDrag(win, handle) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const onMouseMove = (e) => {
    if (!dragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    win.style.left = `${Math.max(0, x)}px`;
    win.style.top = `${Math.max(0, y)}px`;
  };

  handle.addEventListener("mousedown", (e) => {
    if (e.target.closest(".window-controls")) return;
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    handle.style.cursor = "grabbing";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
      dragging = false;
      handle.style.cursor = "grab";
      document.removeEventListener("mousemove", onMouseMove);
    }, { once: true });
  });
}

function focusWindow(id) {
  const meta = state.windows.get(id);
  if (!meta) return;
  state.windows.forEach(({ node }) => node.classList.remove("active"));
  meta.node.classList.add("active");
  meta.node.style.zIndex = state.z++;
  updateTaskbarActive(id);
}

function minimizeWindow(id, setMin = true) {
  const meta = state.windows.get(id);
  if (!meta) return;
  meta.minimized = setMin;
  meta.node.style.display = setMin ? "none" : "grid";
  updateTaskbarActive(setMin ? null : id);
}

function closeWindow(id) {
  const meta = state.windows.get(id);
  if (!meta) return;
  if (meta.type === "mazeGame" && state.maze) {
    if (state.maze.timer) clearInterval(state.maze.timer);
    state.maze.timer = null;
    state.maze.running = false;
  }
  meta.node.remove();
  removeTaskbarButton(id);
  state.windows.delete(id);
}

function toggleMaximize(node) {
  const maximized = node.dataset.maximized === "true";
  if (maximized) {
    node.style.left = node.dataset.prevLeft;
    node.style.top = node.dataset.prevTop;
    node.style.width = node.dataset.prevWidth;
    node.style.height = node.dataset.prevHeight;
    node.dataset.maximized = "false";
  } else {
    node.dataset.prevLeft = node.style.left;
    node.dataset.prevTop = node.style.top;
    node.dataset.prevWidth = node.style.width;
    node.dataset.prevHeight = node.style.height;
    node.style.left = "0px";
    node.style.top = "0px";
    node.style.width = "100vw";
    node.style.height = `calc(100vh - var(--bar-height))`;
    node.dataset.maximized = "true";
  }
}

function addTaskbarButton(id, label, icon) {
  const wrap = document.getElementById("taskbar-windows");
  const btn = document.createElement("button");
  btn.className = "task-button";
  btn.dataset.win = id;
  btn.innerHTML = `<img src="${icon}" alt="" width="16" height="16" loading="lazy" /> ${label}`;
  btn.addEventListener("click", () => {
    const meta = state.windows.get(id);
    if (!meta) return;
    if (meta.minimized) {
      minimizeWindow(id, false);
      focusWindow(id);
    } else if (getTopWindow()?.id === id) {
      minimizeWindow(id, true);
    } else {
      focusWindow(id);
    }
  });
  wrap.appendChild(btn);
}

function removeTaskbarButton(id) {
  const wrap = document.getElementById("taskbar-windows");
  const btn = wrap.querySelector(`[data-win="${id}"]`);
  if (btn) btn.remove();
}

function updateTaskbarActive(id) {
  const wrap = document.getElementById("taskbar-windows");
  wrap.querySelectorAll(".task-button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.win === id);
  });
}

function getTopWindow() {
  let top = null;
  state.windows.forEach((meta) => {
    const z = parseInt(meta.node.style.zIndex, 10) || 0;
    if (!top || z > top.z) top = { ...meta, z };
  });
  return top;
}

function openApp(appName, payload) {
  const data = state.data;
  switch (appName) {
    case "about":
      return createWindow("about", {
        title: "About",
        icon: ICONS.about,
        render: (el) => renderAbout(el, data),
      });
    case "pic":
      return createWindow("pic", {
        title: "Projects",
        icon: ICONS.pic,
        render: (el) => renderPicExplorer(el, payload),
      });
    case "pictures":
      return createWindow("pictures", {
        title: "Pictures",
        icon: ICONS.pictures,
        render: (el) => renderPictures(el),
      });
    case "pictureViewer":
      return createWindow("pictureViewer", {
        title: payload?.name || "Picture Viewer",
        icon: ICONS.pictures,
        render: (el) => renderPictureViewer(el, payload),
        unique: false,
      });
    case "project":
      return createWindow("project", {
        title: payload?.name || "Project",
        icon: ICONS.pic,
        render: (el) => renderProjectViewer(el, payload?.id),
        unique: false,
      });
    case "cv":
      return createWindow("cv", {
        title: "CV",
        icon: ICONS.cv,
        render: (el) => renderCV(el, data),
      });
    case "achievements":
      return createWindow("achievements", {
        title: "Achievements",
        icon: ICONS.achievements,
        render: (el) => renderAchievements(el, data),
      });
    case "ask":
      return createWindow("ask", {
        title: "Ask Me.exe",
        icon: ICONS.ask,
        render: (el) => renderAskMe(el, data),
      });
    case "publications":
      return createWindow("publications", {
        title: "Publications",
        icon: ICONS.publications,
        render: (el) => renderPublications(el, data),
      });    case "mazeGame":
      return createWindow("mazeGame", {
        title: "MazeGame.exe - MazeSearch",
        icon: ICONS.maze,
        render: (el) => renderMazeGame(el),
      });    case "contact":
      return createWindow("contact", {
        title: "Contact",
        icon: ICONS.contact,
        render: (el) => renderContact(el, data),
      });
    default:
      break;
  }
}

// Rendering functions
function renderAbout(el, data) {
  const featured = data.featured_project_ids
    .map((id) => data.projects.find((p) => p.id === id))
    .filter(Boolean);
  const primaryRole = (data.title || "").split(" & ")[0] || data.title || "Engineer";
  const homeBase = data.location || "Earth";
  const slideThemes = ["theme-1", "theme-2", "theme-3", "theme-4", "theme-5"];
  const slides = [
    {
      title: "Hi, I’m " + data.name,
      body: `
        <div class="hero-layout">
          <div class="hero-right">
            <div class="hero-heading">
              <h1>${data.name}</h1>
              <h2>${data.title}</h2>
            </div>
            <div class="avatar-caption">Based in ${homeBase}</div>
            <p class="hero-lead">${data.bio_short}</p>
            <div class="chip-row hero-chips">${data.skills.slice(0, 6).map((s) => `<span class="chip">${s}</span>`).join("")}</div>
            <div class="status-strip" role="status" aria-live="polite">
              <span class="status-dot" aria-hidden="true"></span>
              <span>Ready</span>
              <span aria-hidden="true">•</span>
              <span>${primaryRole}</span>
              <span aria-hidden="true">•</span>
              <span>Open to opportunities</span>
              <span class="status-caret" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      `,
    },
    {
      title: "Quick Stats",
      body: `
        <div class="stat-grid slide-grid">
          <div class="stat-card"><strong>Years</strong><br>${data.stats.years}</div>
          <div class="stat-card"><strong>Focus</strong><br>${data.stats.specialties.join(", ")}</div>
          <div class="stat-card"><strong>Tools</strong><br>${data.stats.tools.slice(0, 6).join(", ")}</div>
        </div>
      `,
    },
    {
      title: "Featured Projects",
      body: `
        <div class="file-grid slide-grid" id="featured-grid">
          ${featured
            .map(
              (proj) => `
              <div class="file-card" data-proj="${proj.id}">
                <img class="img-thumb zoomable" src="${proj.images[0] || "assets/projects/placeholder.svg"}" alt="${proj.name}" loading="lazy" />
                <strong>${proj.name}</strong>
                <div class="project-meta"><span>${proj.year}</span><span>${proj.role}</span></div>
              </div>`
            )
            .join("")}
        </div>
        <div class="button-row">
          <button class="btn primary" data-action="open-projects">View projects</button>
        </div>
      `,
    },
    {
      title: "How I Work",
      body: `
        <ol class="timeline">
          ${data.process_steps.map((step, i) => `<li><span>${i + 1}</span>${step}</li>`).join("")}
        </ol>
      `,
    },
    {
      title: "Let’s Talk",
      body: `
        <div class="cta-stack">
          <button class="btn primary" data-action="open-cv">Open CV</button>
          <button class="btn" data-action="open-ask">Open Ask Me.exe</button>
          <button class="btn" data-action="contact">Contact</button>
          <div class="link-row">
            ${data.links.map((l) => `<a class="btn ghost" href="${l.url}" target="_blank" rel="noreferrer noopener">${l.label}</a>`).join("")}
          </div>
        </div>
      `,
    },
  ];

  el.innerHTML = `
    <div class="about-deck">
      <div class="deck-header">
        <div>
          <h2>About</h2>
          <p>${data.name}</p>
        </div>
        <div class="deck-actions">
          <span class="wip-badge" aria-label="Work in progress">In progress</span>
          <button class="btn" data-action="open-cv">CV</button>
          <button class="btn" data-action="contact">Contact</button>
        </div>
      </div>
      <div class="slide-frame" aria-live="polite">
        ${slides
          .map(
            (s, i) => `
            <section class="slide ${slideThemes[i % slideThemes.length]} ${i === 0 ? "active" : ""}" data-idx="${i}">
              <header class="slide-header">
                <span class="pill">${i + 1}/${slides.length}</span>
                <h3>${s.title}</h3>
              </header>
              <div class="slide-body">${s.body}</div>
            </section>
          `
            )
            .join("")}
      </div>
      <div class="slide-nav">
        <button class="btn" data-nav="-1" aria-label="Previous slide">◀ Prev</button>
        <div class="dots">
          ${slides.map((_, i) => `<button class="dot ${i === 0 ? "active" : ""}" data-dot="${i}" aria-label="Go to slide ${i + 1}"></button>`).join("")}
        </div>
        <button class="btn primary" data-nav="1" aria-label="Next slide">Next ▶</button>
      </div>
    </div>
  `;

  const slideEls = [...el.querySelectorAll(".slide")];
  const dotEls = [...el.querySelectorAll(".dot")];
  const navBtns = el.querySelectorAll("[data-nav]");
  const total = slideEls.length;
  let current = 0;

  function show(idx) {
    current = (idx + total) % total;
    slideEls.forEach((s, i) => s.classList.toggle("active", i === current));
    dotEls.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  navBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const step = Number(btn.dataset.nav);
      show(current + step);
    })
  );
  dotEls.forEach((dot) =>
    dot.addEventListener("click", () => show(Number(dot.dataset.dot)))
  );
  el.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  el.querySelectorAll('[data-action="open-cv"]').forEach((btn) => (btn.onclick = () => openApp("cv")));
  el.querySelectorAll('[data-action="open-ask"]').forEach((btn) => (btn.onclick = () => openApp("ask")));
  el.querySelectorAll('[data-action="contact"]').forEach((btn) => (btn.onclick = () => openApp("contact")));
  el.querySelectorAll('[data-action="open-projects"]').forEach((btn) => (btn.onclick = () => openApp("pic")));

  el.querySelectorAll("[data-proj]").forEach((card) => {
    const id = card.dataset.proj;
    card.addEventListener("click", () => openApp("project", { id }));
    card.addEventListener("dblclick", () => openApp("project", { id }));
  });

  applyImageDefaults(el);
}

function renderPicExplorer(el, options = {}) {
  const { projects } = state.data;
  const tag = typeof options === "string" ? options : options.tag;
  const highlightId = typeof options === "object" ? options.focusId : null;
  const tags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();
  const activeTag = tag || "All";
  el.innerHTML = `
    <div class="file-explorer">
      <aside class="sidebar" aria-label="Project categories"></aside>
      <div>
        <div class="file-grid" id="project-grid"></div>
      </div>
    </div>
  `;
  const sidebar = el.querySelector(".sidebar");
  const btnAll = document.createElement("button");
  btnAll.textContent = "All";
  btnAll.classList.toggle("active", activeTag === "All");
  btnAll.onclick = () => renderPicExplorer(el, "All");
  sidebar.appendChild(btnAll);
  tags.forEach((tag) => {
    const b = document.createElement("button");
    b.textContent = tag;
    b.classList.toggle("active", activeTag === tag);
    b.onclick = () => renderPicExplorer(el, tag);
    sidebar.appendChild(b);
  });

  const grid = el.querySelector("#project-grid");
  const filtered = activeTag === "All" ? projects : projects.filter((p) => p.tags.includes(activeTag));
  filtered.forEach((proj) => {
    const card = document.createElement("div");
    card.className = "file-card";
    card.dataset.id = proj.id;
    card.innerHTML = `
      <img class="img-thumb zoomable" src="${proj.images[0] || "assets/projects/placeholder.svg"}" alt="${proj.name}" loading="lazy"/>
      <strong>${proj.name}</strong>
      <div class="project-meta">
        <span>${proj.year}</span>
        <span>${proj.role}</span>
      </div>
    `;
    card.addEventListener("click", () => openApp("project", { id: proj.id, name: proj.name }));
    grid.appendChild(card);
    if (highlightId && proj.id === highlightId) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("active");
      setTimeout(() => card.classList.remove("active"), 1000);
    }
  });
  applyImageDefaults(el);
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|svg|heic|heif)$/i;

async function renderPictures(el) {
  el.innerHTML = `
    <div class="photo-wrap">
      <div class="photo-toolbar">
        <strong>Pictures</strong>
        <span class="hint">Double-click an image to open it.</span>
      </div>
      <div class="photo-grid" id="photo-grid">
        <div class="loading">Loading pictures...</div>
      </div>
    </div>
  `;

  const grid = el.querySelector("#photo-grid");
  const files = await loadPicturesList();

  if (!files.length) {
    grid.innerHTML = `<p class="muted">No images found in assets/pics/. Add files (png, jpg, gif, webp, bmp, svg, heic) or update manifest.json.</p>`;
    return;
  }

  grid.innerHTML = "";
  files.forEach((src) => {
    const name = src.split("/").pop();
    const card = document.createElement("button");
    card.className = "photo-card";
    card.innerHTML = `
      <img class="img-thumb photo-thumb zoomable" src="${src}" alt="${name}" loading="lazy" />
      <span class="photo-name">${name}</span>
    `;
    card.addEventListener("click", () => {
      grid.querySelectorAll(".photo-card").forEach((btn) => btn.classList.remove("selected"));
      card.classList.add("selected");
    });
    card.addEventListener("dblclick", () => openApp("pictureViewer", { src, name }));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openApp("pictureViewer", { src, name });
      }
    });
    grid.appendChild(card);
  });

  applyImageDefaults(el);
}

async function loadPicturesList() {
  if (Array.isArray(state.pictures) && state.pictures.length) return state.pictures;
  const base = "assets/pics/";

  const fromListing = await fetchDirectoryListing(base);
  const pics = fromListing.length ? fromListing : await fetchManifestList(base);

  state.pictures = pics;
  return pics;
}

async function fetchDirectoryListing(base) {
  try {
    const res = await fetch(base);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) throw new Error("No directory listing");
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const links = [...doc.querySelectorAll("a")];
    const files = links
      .map((a) => a.getAttribute("href") || "")
      .filter((href) => IMAGE_EXT.test(href) && !href.startsWith("../"))
      .map((href) => normalizePicturePath(href, base));
    return [...new Set(files)];
  } catch (err) {
    console.warn("Picture directory scan failed", err);
    return [];
  }
}

async function fetchManifestList(base) {
  const fromJson = await fetchManifestJson(base);
  if (fromJson.length) return fromJson;
  return fetchManifestModule(base);
}

async function fetchManifestJson(base) {
  try {
    const res = await fetch(`${base}manifest.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => typeof item === "string" && IMAGE_EXT.test(item))
      .map((item) => normalizePicturePath(item, base));
  } catch (err) {
    console.warn("Picture manifest load failed", err);
    return [];
  }
}

async function fetchManifestModule(base) {
  try {
    const mod = await import(`./${base}manifest.js`);
    const data = mod.default || mod.PICTURE_MANIFEST || [];
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => typeof item === "string" && IMAGE_EXT.test(item))
      .map((item) => normalizePicturePath(item, base));
  } catch (err) {
    console.warn("Picture manifest.js load failed", err);
    return [];
  }
}

function normalizePicturePath(path, base) {
  if (/^https?:/i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith(base)) return path;
  const clean = path.replace(/^\/+/, "");
  return `${base}${clean}`;
}

function renderPictureViewer(el, payload = {}) {
  const src = payload?.src || IMG_PLACEHOLDER;
  const name = payload?.name || "Image";
  el.innerHTML = `
    <div class="picture-viewer">
      <div class="picture-stage">
        <img class="img-detail" src="${src}" alt="${name}" loading="lazy" />
      </div>
      <div class="photo-name">${name}</div>
    </div>
  `;
  applyImageDefaults(el);
}

function renderProjectViewer(el, projectId) {
  const project = state.data.projects.find((p) => p.id === projectId) || state.data.projects[0];
  if (!project) {
    el.textContent = "No project found.";
    return;
  }
  el.innerHTML = `
    <div class="project-view">
      <div class="hero">
        <img class="img-detail zoomable" src="${project.images[0] || "assets/projects/placeholder.svg"}" alt="${project.name}" loading="lazy" />
      </div>
      <h2>${project.name} (${project.year})</h2>
      <div class="meta-list">
        <span class="badge">${project.role}</span>
        ${project.tools.map((t) => `<span class="badge">${t}</span>`).join("")}
      </div>
      <p>${project.summary}</p>
      <h4>Problem</h4><p>${project.problem}</p>
      <h4>Approach</h4><p>${project.approach}</p>
      <h4>Outcome</h4><p>${project.outcome}</p>
      <div class="file-grid">
        ${project.images
          .slice(1)
          .map((img) => `<img class="img-detail zoomable" src="${img}" alt="${project.name} detail" loading="lazy" />`)
          .join("")}
      </div>
      <div class="button-row">
        ${project.links
          .map((link) => `<a class="btn" href="${link.url}" target="_blank" rel="noreferrer noopener">${link.label}</a>`)
          .join("")}
      </div>
    </div>
  `;
  applyImageDefaults(el);
}

function renderCV(el, data) {
  el.innerHTML = `
    <div class="section-grid">
      <h2>${data.name} � ${data.title}</h2>
      <p>${data.bio_long}</p>
      <h3>Experience</h3>
      <ul>
        ${data.experience
          .map((exp) => `<li><strong>${exp.role}</strong> @ ${exp.company} (${exp.years}) � ${exp.summary}</li>`)
          .join("")}
      </ul>
      <h3>Education</h3>
      <ul>
        ${data.education.map((ed) => `<li>${ed.degree} � ${ed.school} (${ed.years})</li>`).join("")}
      </ul>
      <div class="pdf-frame">
        <object data="cv.pdf#toolbar=0" type="application/pdf" aria-label="CV preview"></object>
        <div class="button-row">
          <a class="btn primary" href="cv.pdf" target="_blank" rel="noreferrer noopener">Open CV (PDF)</a>
          <a class="btn" href="cv.pdf" download>Download PDF</a>
          <button class="btn" id="print-cv">Print</button>
        </div>
      </div>
      <h3>Skills</h3>
      <div class="meta-list">${data.skills.map((s) => `<span class="badge">${s}</span>`).join("")}</div>
      <h3>Tools</h3>
      <div class="meta-list">${data.stats.tools.map((t) => `<span class="badge">${t}</span>`).join("")}</div>
    </div>
  `;
  const printBtn = el.querySelector("#print-cv");
  printBtn?.addEventListener("click", () => window.print());
}

function renderPublications(el, data) {
  const pubs = data.publications || [];
  const blogs = data.blogs || [];
  const reviews = data.reviewer_service || [];
  el.innerHTML = `
    <div class="section-grid">
      <h2>Publications</h2>
      <div class="pub-list">
        ${pubs.length ? pubs.map((p) => `<div class="pub-card"><strong>${p.year}</strong> — ${p.title}${p.venue ? `, <em>${p.venue}</em>` : ""}${p.link ? ` — <a href="${p.link}" target="_blank" rel="noreferrer noopener">Link</a>` : ""}</div>`).join("") : "<p>No publications yet. Add them in data/about_me.json.</p>"}
      </div>
      <h3>Peer Review</h3>
      <div class="pub-list">
        ${
          reviews.length
            ? reviews
                .map(
                  (r) =>
                    `<div class="pub-card review-card">
                      <img class="pub-thumb${r.image ? " zoomable" : ""}" src="${r.image || IMG_PLACEHOLDER}" alt="${r.journal || "Reviewer image"}" loading="lazy" />
                      <div>
                        <strong>${r.year || "Year"}</strong> — ${r.journal || "Journal"}${r.role ? ` (${r.role})` : ""}
                        ${r.link ? ` — <a href="${r.link}" target="_blank" rel="noreferrer noopener">Link</a>` : ""}
                      </div>
                    </div>`
                )
                .join("")
            : '<p>No reviewer roles yet. Add them in data/about_me.json under "reviewer_service".</p>'
        }
      </div>
      <h3>Blogs</h3>
      <div class="pub-list">
        ${blogs.length ? blogs.map((b) => `<div class="pub-card"><strong>${b.year}</strong> — ${b.title}${b.platform ? ` (${b.platform})` : ""}${b.link ? ` — <a href="${b.link}" target="_blank" rel="noreferrer noopener">Read</a>` : ""}</div>`).join("") : "<p>No blog posts yet. Add them in data/about_me.json.</p>"}
      </div>
    </div>
  `;
  applyImageDefaults(el);
}

function renderAchievements(el, data) {
  el.innerHTML = `
    <div class="achievement-list">
      ${data.achievements
        .map(
          (a) => `
        <div class="achievement-item" tabindex="0">
          <strong>${a.year} — ${a.title}</strong>
          <div>${a.org}</div>
          ${a.details ? `<p>${a.details}</p>` : ""}
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderContact(el, data) {
  el.innerHTML = `
    <div class="section-grid">
      <h2>Contact</h2>
      <p>Email: <button class="btn" data-copy="${data.email}">${data.email}</button></p>
      <div class="button-row">
        ${data.links
          .map((l) => `<a class="btn" href="${l.url}" target="_blank" rel="noreferrer noopener">${l.label}</a>`)
          .join("")}
      </div>
    </div>
  `;
  el.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(btn.dataset.copy || "");
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = btn.dataset.copy), 1200);
    });
  });
}

function renderAskMe(el, data) {
  const askConfig = data.ask_me || {};
  const questionLimit = Number(askConfig.question_limit_per_ip) || 5;
  const apiBase = (askConfig.api_base || "https://loginunit.jhonmorrisonhbl.workers.dev").replace(/\/+$/, "");
  const personaPrompt =
    askConfig.persona_prompt ||
    `You are ${data.name || "the portfolio owner"}. Answer in first person and reflect personal habits, working style, and project experience with specific details.`;
  const suggestions = askConfig.suggestions || [
    "What are your daily work habits as an ML engineer?",
    "How do you approach model debugging in production?",
    "What kind of projects are you strongest at?",
    "How do you balance speed vs quality in delivery?",
    "What tools do you rely on most and why?",
  ];

  el.innerHTML = `
    <div class="chat">
      <div class="ask-limit" id="ask-limit" aria-live="polite">Checking question limit...</div>
      <div class="chat-log" aria-live="polite"></div>
      <div class="chips" id="suggested"></div>
      <div class="chat-input">
        <input type="text" id="chat-text" placeholder="Ask me anything..." aria-label="Ask me" />
        <button class="btn primary" id="chat-send">Ask</button>
      </div>
      <p class="ask-note">Each IP can send up to ${questionLimit} questions total.</p>
    </div>
  `;
  const log = el.querySelector(".chat-log");
  const limitLine = el.querySelector("#ask-limit");
  const input = el.querySelector("#chat-text");
  const sendBtn = el.querySelector("#chat-send");
  const chipsWrap = el.querySelector("#suggested");
  const conversationHistory = [];

  suggestions.forEach((s) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = s;
    chip.addEventListener("click", () => {
      input.value = s;
      sendMessage();
    });
    chipsWrap.appendChild(chip);
  });

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  refreshLimitStatus();

  appendChat(log, "bot", "Ask a question. I will answer using Gemini with my profile prompt.");

  async function refreshLimitStatus() {
    const status = await getAskLimitStatus();
    if (!status) {
      limitLine.textContent = `Limit check failed. Max allowed per IP: ${questionLimit}`;
      return;
    }
    limitLine.textContent = `Questions remaining for this IP: ${status.remaining}/${status.limit}`;
  }

  async function getAskLimitStatus() {
    try {
      const res = await fetch(`${apiBase}/status`, { cache: "no-store" });
      if (!res.ok) throw new Error("status request failed");
      return await res.json();
    } catch (err) {
      console.error("Ask limit status failed", err);
      return null;
    }
  }

  async function askViaWorker(question, history) {
    try {
      const res = await fetch(`${apiBase}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          persona: personaPrompt,
          history,
        }),
      });
      if (!res.ok) {
        let details = "";
        try {
          const errJson = await res.json();
          details = errJson?.error ? ` (${errJson.error})` : "";
        } catch (_) {
          // ignore JSON parse errors for non-JSON responses
        }
        throw new Error(`ask request failed${details}`);
      }
      return await res.json();
    } catch (err) {
      console.error("Ask worker request failed", err);
      return null;
    }
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendChat(log, "me", text);
    conversationHistory.push({ role: "user", content: text });
    input.value = "";

    const response = await askViaWorker(text, conversationHistory.slice(0, -1));
    if (!response) {
      appendChat(log, "bot", "I could not process your request right now. Please try again.");
      return;
    }
    limitLine.textContent = `Questions remaining for this IP: ${response.remaining}/${response.limit}`;

    if (!response.ok || response.allowed === false) {
      appendChat(log, "bot", "This IP has reached the 5-question cap.");
      return;
    }

    const answer = response.answer || "No answer returned.";
    appendChat(log, "bot", answer);
    conversationHistory.push({ role: "assistant", content: answer });
    log.scrollTop = log.scrollHeight;
  }
}

function appendChat(container, role, text, sources = "") {
  const msg = document.createElement("div");
  msg.className = `chat-message ${role}`;
  msg.innerHTML = `
    <div class="bubble">${text}</div>
    ${sources ? `<div class="sources">Source: ${sources}</div>` : ""}
  `;
  container.appendChild(msg);
}
function getDefaultMazeState() {
  const rows = 21;
  const cols = 21;
  return {
    rows,
    cols,
    grid: Array.from({ length: rows }, () => Array(cols).fill(0)),
    start: { r: 10, c: 5 },
    goal: { r: 10, c: 15 },
    visited: new Set(),
    path: new Set(),
    parents: {},
    queue: [],
    stack: [],
    mode: "start",
    algo: "bfs",
    running: false,
    timer: null,
    status: "Ready",
    speed: 5,
  };
}

function loadMazeState() {
  try {
    const raw = localStorage.getItem("mazeGameState");
    if (!raw) return getDefaultMazeState();
    const data = JSON.parse(raw);
    const maze = getDefaultMazeState();
    maze.grid = data.grid || maze.grid;
    maze.start = data.start || maze.start;
    maze.goal = data.goal || maze.goal;
    maze.algo = data.algo || "bfs";
    maze.mode = data.mode || "start";
    return maze;
  } catch (err) {
    console.warn("Maze load failed", err);
    return getDefaultMazeState();
  }
}

function saveMazeState(maze) {
  try {
    const payload = {
      grid: maze.grid,
      start: maze.start,
      goal: maze.goal,
      algo: maze.algo,
      mode: maze.mode,
    };
    localStorage.setItem("mazeGameState", JSON.stringify(payload));
  } catch (err) {
    console.warn("Maze save failed", err);
  }
}

function renderMazeGame(el) {
  state.maze = state.maze || loadMazeState();
  const maze = state.maze;
  if (maze.timer) {
    clearInterval(maze.timer);
    maze.timer = null;
    maze.running = false;
  }

  el.innerHTML = `
    <div class="maze-wrapper">
      <div class="maze-toolbar">
        <div class="tool-group" id="maze-modes">
          <button class="btn small" data-mode="start">Place Start</button>
          <button class="btn small" data-mode="goal">Place Goal</button>
          <button class="btn small" data-mode="wall">Place Wall</button>
          <button class="btn small" data-mode="erase">Erase</button>
        </div>
        <div class="tool-group">
          <label class="inline-label">Algo
            <select id="maze-algo">
              <option value="bfs">BFS (shortest)</option>
              <option value="dfs">DFS</option>
            </select>
          </label>
        </div>
        <div class="tool-group">
          <button class="btn small" id="maze-run">Run</button>
          <button class="btn small" id="maze-step">Step</button>
          <button class="btn small" id="maze-pause">Pause/Resume</button>
          <button class="btn small" id="maze-clear">Clear Visited</button>
          <button class="btn small" id="maze-reset">Reset Grid</button>
          <button class="btn small" id="maze-example">Load Example</button>
        </div>
        <div class="tool-group">
          <label class="inline-label">Speed
            <input type="range" id="maze-speed" min="1" max="10" value="${maze.speed}" />
          </label>
        </div>
        <div class="status" id="maze-status" aria-live="polite">${maze.status}</div>
      </div>
      <div class="maze-grid" id="maze-grid" role="grid" aria-label="Maze grid"></div>
      <div class="maze-legend">
        <span><span class="legend swatch start"></span>Start (Blue)</span>
        <span><span class="legend swatch goal"></span>Goal (Green)</span>
        <span><span class="legend swatch wall"></span>Wall</span>
        <span><span class="legend swatch visited"></span>Visited</span>
        <span><span class="legend swatch path"></span>Path</span>
      </div>
    </div>
  `;

  const gridEl = el.querySelector("#maze-grid");
  const statusEl = el.querySelector("#maze-status");
  const modeButtons = [...el.querySelectorAll('[data-mode]')];
  const algoSelect = el.querySelector("#maze-algo");
  const speedInput = el.querySelector("#maze-speed");

  algoSelect.value = maze.algo;
  setMode(maze.mode);
  renderGrid();

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setMode(btn.dataset.mode);
    });
  });

  el.querySelector("#maze-run").addEventListener("click", () => startRun(false));
  el.querySelector("#maze-step").addEventListener("click", () => startRun(true));
  el.querySelector("#maze-pause").addEventListener("click", togglePause);
  el.querySelector("#maze-clear").addEventListener("click", () => {
    clearVisited();
    renderGrid();
    setStatus("Ready");
  });
  el.querySelector("#maze-reset").addEventListener("click", () => {
    const fresh = getDefaultMazeState();
    Object.assign(maze, fresh);
    saveMazeState(maze);
    renderGrid();
    setStatus("Grid reset");
  });
  el.querySelector("#maze-example").addEventListener("click", () => {
    buildExampleMaze(maze);
    saveMazeState(maze);
    renderGrid();
    setStatus("Example loaded");
  });

  speedInput.addEventListener("input", () => {
    maze.speed = Number(speedInput.value);
    if (maze.running && maze.timer) {
      clearInterval(maze.timer);
      maze.timer = setInterval(() => stepOnce(), speedToDelay(maze.speed));
    }
  });

  algoSelect.addEventListener("change", () => {
    maze.algo = algoSelect.value;
    saveMazeState(maze);
  });

  function setMode(mode) {
    maze.mode = mode;
    modeButtons.forEach((b) => b.classList.toggle("primary", b.dataset.mode === mode));
    saveMazeState(maze);
  }

  function renderGrid() {
    gridEl.innerHTML = "";
    gridEl.style.setProperty("--cols", maze.cols);
    for (let r = 0; r < maze.rows; r++) {
      for (let c = 0; c < maze.cols; c++) {
        const btn = document.createElement("button");
        btn.className = "maze-cell";
        btn.setAttribute("role", "gridcell");
        btn.setAttribute("aria-label", `Cell ${r + 1}, ${c + 1}`);
        btn.dataset.r = r;
        btn.dataset.c = c;
        const key = mazeKey({ r, c });
        if (maze.start && maze.start.r === r && maze.start.c === c) btn.classList.add("cell-start");
        else if (maze.goal && maze.goal.r === r && maze.goal.c === c) btn.classList.add("cell-goal");
        else if (maze.grid[r][c] === 1) btn.classList.add("cell-wall");
        else if (maze.path.has(key)) btn.classList.add("cell-path");
        else if (maze.visited.has(key)) btn.classList.add("cell-visited");

        btn.addEventListener("click", () => applyTool(r, c));
        btn.addEventListener("keydown", (e) => handleGridKey(e, r, c, btn));
        gridEl.appendChild(btn);
      }
    }
  }

  function handleGridKey(e, r, c, btn) {
    const move = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (move) {
      e.preventDefault();
      const [dr, dc] = move;
      const nr = Math.max(0, Math.min(maze.rows - 1, r + dr));
      const nc = Math.max(0, Math.min(maze.cols - 1, c + dc));
      const next = gridEl.querySelector(`[data-r="${nr}"][data-c="${nc}"]`);
      next?.focus();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      applyTool(r, c);
    }
  }

  function applyTool(r, c) {
    const cellKey = mazeKey({ r, c });
    if (maze.mode === "start") {
      if (maze.grid[r][c] === 1) maze.grid[r][c] = 0;
      maze.start = { r, c };
    } else if (maze.mode === "goal") {
      if (maze.grid[r][c] === 1) maze.grid[r][c] = 0;
      maze.goal = { r, c };
    } else if (maze.mode === "wall") {
      if (maze.start && maze.start.r === r && maze.start.c === c) return setStatus("Cannot place wall on start");
      if (maze.goal && maze.goal.r === r && maze.goal.c === c) return setStatus("Cannot place wall on goal");
      maze.grid[r][c] = 1;
    } else if (maze.mode === "erase") {
      maze.grid[r][c] = 0;
      if (maze.start && maze.start.r === r && maze.start.c === c) maze.start = null;
      if (maze.goal && maze.goal.r === r && maze.goal.c === c) maze.goal = null;
    }
    clearVisited();
    saveMazeState(maze);
    renderGrid();
    setStatus("Ready");
  }

  function clearVisited() {
    maze.visited = new Set();
    maze.path = new Set();
    maze.parents = {};
    maze.queue = [];
    maze.stack = [];
    maze.running = false;
    if (maze.timer) {
      clearInterval(maze.timer);
      maze.timer = null;
    }
  }

  function startRun(stepOnly) {
    if (!maze.start || !maze.goal) {
      setStatus("Place start and goal first");
      return;
    }
    if (!maze.running) {
      clearVisited();
      maze.visited.add(mazeKey(maze.start));
      maze.queue.push(maze.start);
      maze.stack.push(maze.start);
    }
    maze.running = true;
    const delay = speedToDelay(maze.speed);
    if (maze.timer) clearInterval(maze.timer);
    if (stepOnly) {
      stepOnce();
    } else {
      maze.timer = setInterval(() => stepOnce(), delay);
    }
  }

  function togglePause() {
    if (maze.running) {
      maze.running = false;
      if (maze.timer) {
        clearInterval(maze.timer);
        maze.timer = null;
      }
      setStatus("Paused");
      return;
    }
    // resume if we have progress
    if (!maze.queue.length && !maze.stack.length) {
      startRun(false);
      return;
    }
    maze.running = true;
    if (maze.timer) clearInterval(maze.timer);
    maze.timer = setInterval(() => stepOnce(), speedToDelay(maze.speed));
    setStatus("Running...");
  }

  function stepOnce() {
    const result = maze.algo === "bfs" ? bfsStep() : dfsStep();
    renderGrid();
    if (result === "goal") {
      setStatus("Path found");
      stopRun();
    } else if (result === "dead") {
      setStatus("No path found");
      stopRun();
    } else {
      setStatus("Running...");
    }
  }

  function stopRun() {
    maze.running = false;
    if (maze.timer) {
      clearInterval(maze.timer);
      maze.timer = null;
    }
  }

  function bfsStep() {
    if (!maze.queue.length) return "dead";
    const current = maze.queue.shift();
    const cKey = mazeKey(current);
    if (current.r === maze.goal.r && current.c === maze.goal.c) {
      buildPath(cKey);
      return "goal";
    }
    for (const n of mazeNeighbors(current, maze.rows, maze.cols)) {
      const nKey = mazeKey(n);
      if (maze.grid[n.r][n.c] === 1) continue;
      if (maze.visited.has(nKey)) continue;
      maze.visited.add(nKey);
      maze.parents[nKey] = cKey;
      maze.queue.push(n);
    }
    return maze.queue.length ? "running" : "dead";
  }

  function dfsStep() {
    if (!maze.stack.length) return "dead";
    const current = maze.stack.pop();
    const cKey = mazeKey(current);
    if (current.r === maze.goal.r && current.c === maze.goal.c) {
      buildPath(cKey);
      return "goal";
    }
    for (const n of mazeNeighbors(current, maze.rows, maze.cols)) {
      const nKey = mazeKey(n);
      if (maze.grid[n.r][n.c] === 1) continue;
      if (maze.visited.has(nKey)) continue;
      maze.visited.add(nKey);
      maze.parents[nKey] = cKey;
      maze.stack.push(n);
    }
    return maze.stack.length ? "running" : "dead";
  }

  function buildPath(goalKey) {
    maze.path = new Set();
    let cursor = goalKey;
    while (maze.parents[cursor]) {
      maze.path.add(cursor);
      cursor = maze.parents[cursor];
    }
  }

  function setStatus(text) {
    maze.status = text;
    statusEl.textContent = text;
  }
}

function mazeKey(pos) {
  return `${pos.r},${pos.c}`;
}

function mazeNeighbors(pos, rows, cols) {
  return [
    { r: pos.r - 1, c: pos.c },
    { r: pos.r + 1, c: pos.c },
    { r: pos.r, c: pos.c - 1 },
    { r: pos.r, c: pos.c + 1 },
  ].filter((p) => p.r >= 0 && p.r < rows && p.c >= 0 && p.c < cols);
}

function speedToDelay(speed) {
  const clamped = Math.max(1, Math.min(10, speed));
  return 650 - clamped * 55; // 595ms down to ~100ms
}

function buildExampleMaze(maze) {
  const rows = maze.rows;
  const cols = maze.cols;
  maze.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 2; r < rows - 2; r++) {
    maze.grid[r][Math.floor(cols / 2)] = 1;
    if (r % 2 === 0 && r < rows - 4) maze.grid[r][Math.floor(cols / 2) - 2] = 1;
  }
  maze.start = { r: rows - 3, c: 2 };
  maze.goal = { r: 2, c: cols - 3 };
  clearVisited();
  function clearVisited() {
    maze.visited = new Set();
    maze.path = new Set();
    maze.parents = {};
    maze.queue = [];
    maze.stack = [];
    maze.running = false;
    if (maze.timer) {
      clearInterval(maze.timer);
      maze.timer = null;
    }
  }
}
function shutdown() {
  const overlay = document.getElementById("screen-overlay");
  overlay.innerHTML = `<div>Shutting down...<br><small>Refresh to wake.</small></div>`;
  overlay.hidden = false;

  const closeOverlay = () => {
    overlay.hidden = true;
    overlay.removeEventListener("click", closeOverlay);
    document.removeEventListener("keydown", escClose);
  };
  const escClose = (e) => {
    if (e.key === "Escape") closeOverlay();
  };

  overlay.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", escClose);

  setTimeout(() => {
    closeOverlay();
    [...state.windows.keys()].forEach(closeWindow);
  }, 1200);
}














