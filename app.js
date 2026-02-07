// Retro Windows Portfolio SPA
const state = {
  windows: new Map(),
  z: 2,
  data: null,
  mobile: window.matchMedia("(max-width: 720px)").matches,
};

const ICONS = {
  about: "assets/icons/window.svg",
  pic: "assets/icons/folder.svg",
  cv: "assets/icons/doc.svg",
  achievements: "assets/icons/trophy.svg",
  ask: "assets/icons/app.svg",
  contact: "assets/icons/contact.svg",
  project: "assets/icons/folder.svg",
  window: "assets/icons/window.svg",
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  buildDesktopIcons();
  buildStartMenu();
  wireStartButton();
  wireGlobalShortcuts();
  startClock();
  openApp("about");
});

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
    { app: "pic", label: "PIC", icon: ICONS.pic },
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
    { app: "pic", label: "PIC", icon: ICONS.pic },
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
        title: "PIC",
        icon: ICONS.pic,
        render: (el) => renderPicExplorer(el, payload),
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
    case "contact":
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
  el.innerHTML = `
    <div class="section-grid">
      <div class="about-header">
        <div>
          <h2>${data.name}</h2>
          <p>${data.title} — ${data.location || ""}</p>
          <p>${data.bio_short}</p>
        </div>
        <div class="button-row">
          <button class="btn primary" data-action="open-cv">Open CV</button>
          <button class="btn" data-action="open-ask">Open Ask Me.exe</button>
          <button class="btn" data-action="contact">Contact</button>
        </div>
      </div>
      <div>
        <h3>Featured Projects</h3>
        <div class="file-grid" id="featured-grid"></div>
      </div>
      <div>
        <h3>Quick Stats</h3>
        <div class="stat-grid">
          <div class="stat-card"><strong>Years</strong><br>${data.stats.years}</div>
          <div class="stat-card"><strong>Focus</strong><br>${data.stats.specialties.join(", ")}</div>
          <div class="stat-card"><strong>Tools</strong><br>${data.stats.tools.slice(0,6).join(", ")}</div>
        </div>
      </div>
    </div>
  `;
  const grid = el.querySelector("#featured-grid");
  featured.forEach((proj) => {
    const card = document.createElement("div");
    card.className = "file-card";
    card.innerHTML = `
      <img src="${proj.images[0] || "assets/projects/placeholder.svg"}" alt="${proj.name}" loading="lazy" />
      <strong>${proj.name}</strong>
      <div class="project-meta"><span>${proj.year}</span><span>${proj.role}</span></div>
    `;
    card.addEventListener("click", () => openApp("pic", { tag: proj.tags[0], focusId: proj.id }));
    card.addEventListener("dblclick", () => openApp("project", { id: proj.id, name: proj.name }));
    grid.appendChild(card);
  });

  el.querySelector('[data-action="open-cv"]').onclick = () => openApp("cv");
  el.querySelector('[data-action="open-ask"]').onclick = () => openApp("ask");
  el.querySelector('[data-action="contact"]').onclick = () => openApp("contact");
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
      <img src="${proj.images[0] || "assets/projects/placeholder.svg"}" alt="${proj.name}" loading="lazy"/>
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
        <img src="${project.images[0] || "assets/projects/placeholder.svg"}" alt="${project.name}" loading="lazy" />
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
          .map((img) => `<img src="${img}" alt="${project.name} detail" loading="lazy" />`)
          .join("")}
      </div>
      <div class="button-row">
        ${project.links
          .map((link) => `<a class="btn" href="${link.url}" target="_blank" rel="noreferrer noopener">${link.label}</a>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderCV(el, data) {
  el.innerHTML = `
    <div class="section-grid">
      <h2>${data.name} — ${data.title}</h2>
      <p>${data.bio_long}</p>
      <h3>Experience</h3>
      <ul>
        ${data.experience
          .map((exp) => `<li><strong>${exp.role}</strong> @ ${exp.company} (${exp.years}) — ${exp.summary}</li>`)
          .join("")}
      </ul>
      <h3>Education</h3>
      <ul>
        ${data.education.map((ed) => `<li>${ed.degree} — ${ed.school} (${ed.years})</li>`).join("")}
      </ul>
      <h3>Skills</h3>
      <div class="meta-list">${data.skills.map((s) => `<span class="badge">${s}</span>`).join("")}</div>
      <h3>Tools</h3>
      <div class="meta-list">${data.stats.tools.map((t) => `<span class="badge">${t}</span>`).join("")}</div>
      <div class="button-row">
        <a class="btn primary" href="assets/cv.pdf" download>Download PDF</a>
        <button class="btn" id="print-cv">Print</button>
      </div>
    </div>
  `;
  const printBtn = el.querySelector("#print-cv");
  printBtn?.addEventListener("click", () => window.print());
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
  el.innerHTML = `
    <div class="chat">
      <div class="chat-log" aria-live="polite"></div>
      <div class="chips" id="suggested"></div>
      <div class="chat-input">
        <input type="text" id="chat-text" placeholder="Ask about projects, process, tools..." aria-label="Ask me" />
        <button class="btn primary" id="chat-send">Send</button>
      </div>
      <div class="button-row">
        <button class="btn" id="chat-clear">Clear</button>
        <button class="btn" id="chat-export">Export chat as .txt</button>
      </div>
      <details class="prompt-box">
        <summary>Show system prompt</summary>
        <p>You are the portfolio guide. Answer only with info from the local knowledge base. Link to windows when helpful. Keep it concise and friendly.</p>
      </details>
    </div>
  `;
  const log = el.querySelector(".chat-log");
  const input = el.querySelector("#chat-text");
  const sendBtn = el.querySelector("#chat-send");
  const clearBtn = el.querySelector("#chat-clear");
  const exportBtn = el.querySelector("#chat-export");
  const suggestions = [
    "What kind of designer are you?",
    "What projects are you most proud of?",
    "What's your process?",
    "What tools do you use?",
    "How can I contact you?",
  ];
  const chipsWrap = el.querySelector("#suggested");
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
  clearBtn.addEventListener("click", () => (log.innerHTML = ""));
  exportBtn.addEventListener("click", () => exportChat(log));

  appendChat(log, "bot", "Hi! Ask me about my work, projects, process, tools, or achievements.");

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendChat(log, "me", text);
    input.value = "";
    const reply = askMeRespond(text, data);
    appendChat(log, "bot", reply.text, reply.sources);
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

function exportChat(logEl) {
  const text = [...logEl.querySelectorAll(".chat-message")]
    .map((m) => {
      const who = m.classList.contains("me") ? "You" : "Guide";
      const body = m.querySelector(".bubble")?.textContent || "";
      const src = m.querySelector(".sources")?.textContent || "";
      return `${who}: ${body}${src ? ` (${src})` : ""}`;
    })
    .join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ask-me-chat.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function askMeRespond(userText, data) {
  const q = userText.toLowerCase();
  const res = { text: "", sources: "" };
  const topProjects = data.projects.slice(0, 3);

  if (q.includes("project")) {
    res.text = topProjects
      .map((p) => `• ${p.name} (${p.year}) — ${p.summary}`)
      .join("<br>");
    res.text += `<br><br>Open PIC to view more or double-click a project file.`;
    res.sources = "Projects";
    return res;
  }
  if (q.includes("process")) {
    res.text = data.process_steps.map((step, i) => `${i + 1}. ${step}`).join("<br>");
    res.sources = "Process";
    return res;
  }
  if (q.includes("tool") || q.includes("skill")) {
    res.text = `Tools: ${data.stats.tools.join(", ")}<br>Skills: ${data.skills.join(", ")}`;
    res.sources = "Tools, Skills";
    return res;
  }
  if (q.includes("award") || q.includes("achievement")) {
    res.text = data.achievements.map((a) => `${a.year}: ${a.title} (${a.org})`).join("<br>");
    res.text += "<br>Open the Achievements window for details.";
    res.sources = "Achievements";
    return res;
  }
  if (q.includes("contact") || q.includes("email")) {
    res.text = `You can email me at ${data.email}. Links: ${data.links.map((l) => l.label).join(", ")}.`;
    res.sources = "Contact";
    return res;
  }
  res.text =
    "I can answer about my work, projects, skills, tools, process, and achievements. Try asking about projects or my process!";
  res.sources = "Bio";
  return res;
}

function shutdown() {
  const overlay = document.getElementById("screen-overlay");
  overlay.innerHTML = `<div>Shutting down...<br><small>Refresh to wake.</small></div>`;
  overlay.hidden = false;
  setTimeout(() => {
    overlay.hidden = true;
    // close windows
    [...state.windows.keys()].forEach(closeWindow);
  }, 1600);
}
