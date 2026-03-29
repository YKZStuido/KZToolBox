const HOME_CATEGORY = "主页";
const FIXED_LIST_STORAGE_KEY = "fixed_list";
const NOTES_STORAGE_KEY = "notes_md_preview";
const APP_VERSION_DISPLAY = ["0.1.0", "preview", "build1"];
const DEFAULT_FIXED_TOOL_IDS = ["system-overview", "network-check", "text-stats"];
const DEFAULT_NOTES_CONTENT = "# 笔记\n\n在这里记录常用命令、排查结论或待办事项。\n\n- 支持 Markdown 标题\n- 支持列表与引用\n- 支持代码块\n\n> 主页会自动保存到 notes.md。";

const categories = [
  HOME_CATEGORY,
  "系统工具",
  "文本工具",
  "文档工具",
  "图片工具",
  "数学工具",
  "开发者工具",
];

const tools = [
  {
    id: "system-overview",
    name: "系统概括",
    category: "系统工具",
    state: "可用",
    desc: "聚合 msinfo32、systeminfo 和硬件信息，尽可能完整展示系统状态。",
    render: renderSystemOverview,
  },
  {
    id: "network-check",
    name: "网络检查",
    category: "系统工具",
    state: "可用",
    desc: "查看网卡与 IP 配置，并检测国内/国外目标网站连通情况。",
    render: renderNetworkCheck,
  },
  {
    id: "display-manage",
    name: "屏幕显示管理",
    category: "系统工具",
    state: "可用",
    desc: "查看显卡信息、显示器信息和当前分辨率参数。",
    render: renderDisplayManager,
  },
  {
    id: "text-transform",
    name: "文本转换",
    category: "文本工具",
    state: "可用",
    desc: "大小写转换、去空行、行去重，适合日常文本处理。",
    render: renderTextTransform,
  },
  {
    id: "json-format",
    name: "JSON 格式化",
    category: "文本工具",
    state: "可用",
    desc: "验证 JSON 并格式化，快速定位结构错误。",
    render: renderJsonFormatter,
  },
  {
    id: "code-format",
    name: "代码格式化",
    category: "文本工具",
    state: "可用",
    desc: "支持 JSON 精确格式化，并提供 JS/CSS/HTML 基础缩进整理。",
    render: renderCodeFormatter,
  },
  {
    id: "base64-tool",
    name: "Base64 编解码",
    category: "文本工具",
    state: "可用",
    desc: "支持 UTF-8 文本编码/解码，用于接口调试与日志处理。",
    render: renderBase64Tool,
  },
  {
    id: "timestamp-tool",
    name: "时间戳转换",
    category: "文本工具",
    state: "可用",
    desc: "毫秒级 Unix 时间戳与本地时间双向转换。",
    render: renderTimestampTool,
  },
  {
    id: "url-codec",
    name: "URL 编解码",
    category: "文本工具",
    state: "可用",
    desc: "对 URL 字符串进行 encode/decode，方便参数调试。",
    render: renderUrlCodec,
  },
  {
    id: "aes-tool",
    name: "AES 加解密",
    category: "文本工具",
    state: "可用",
    desc: "使用 AES-GCM 进行文本加密与解密（Base64 输出）。",
    render: renderAesTool,
  },
  {
    id: "rsa-tool",
    name: "RSA 加解密",
    category: "文本工具",
    state: "可用",
    desc: "在本地生成 RSA 密钥并进行文本加解密。",
    render: renderRsaTool,
  },
  {
    id: "password-generator",
    name: "随机密码生成",
    category: "文本工具",
    state: "可用",
    desc: "按长度和字符集生成随机密码。",
    render: renderPasswordGenerator,
  },
  {
    id: "file-hash",
    name: "文件哈希",
    category: "文本工具",
    state: "可用",
    desc: "计算文件 SHA-256 / SHA-1 / SHA-512 摘要。",
    render: renderFileHashTool,
  },
  {
    id: "text-stats",
    name: "文本字数统计",
    category: "文本工具",
    state: "可用",
    desc: "统计字符数、中文数、英文词数、行数等信息。",
    render: renderTextStatsTool,
  },
  {
    id: "radix-convert",
    name: "进制转换",
    category: "数学工具",
    state: "可用",
    desc: "十进制与二进制/八进制/十六进制互相转换。",
    render: renderRadixTool,
  },
  {
    id: "scientific-calculator",
    name: "科学计算器",
    category: "数学工具",
    state: "可用",
    desc: "支持三角函数、对数、幂、括号与常量的表达式计算。",
    render: renderScientificCalculator,
  },
  {
    id: "function-plot",
    name: "函数图像",
    category: "数学工具",
    state: "可用",
    desc: "输入 f(x) 表达式并绘制二维函数曲线。",
    render: renderFunctionPlot,
  },
  {
    id: "random-number",
    name: "随机数生成",
    category: "数学工具",
    state: "可用",
    desc: "按区间、数量和小数位生成随机数序列。",
    render: renderRandomNumberTool,
  },
  {
    id: "dns-query",
    name: "DNS 查询",
    category: "开发者工具",
    state: "可用",
    desc: "使用系统 DNS 解析目标域名，支持多种记录类型。",
    render: renderDnsQuery,
  },
  {
    id: "ip-query",
    name: "IP 查询",
    category: "开发者工具",
    state: "可用",
    desc: "查询本机或目标 IP 的地理位置、网络供应商等信息。",
    render: renderIpQuery,
  },
  {
    id: "markdown-tool",
    name: "Markdown 工具",
    category: "文档工具",
    state: "可用",
    desc: "支持 Markdown 编辑、实时预览，并转换为 HTML 输出。",
    render: renderMarkdownTool,
  },
  {
    id: "image-info",
    name: "图片信息查看",
    category: "图片工具",
    state: "可用",
    desc: "查看图片尺寸、格式、像素数量和本地预览。",
    render: renderImageInfoTool,
  },
  {
    id: "image-resize",
    name: "图片缩放导出",
    category: "图片工具",
    state: "可用",
    desc: "调整尺寸并导出 PNG / JPEG / WebP，可优先保存到原图目录。",
    render: renderImageResizeTool,
  },
  {
    id: "image-compress",
    name: "图片压缩",
    category: "图片工具",
    state: "可用",
    desc: "通过 JPEG / WebP 质量压缩图片体积，并展示压缩前后大小。",
    render: renderImageCompressTool,
  },
  {
    id: "image-base64-convert",
    name: "图片-Base64 互转",
    category: "图片工具",
    state: "可用",
    desc: "本地图片转 Base64，或将 Base64 还原为图片并下载。",
    render: renderImageBase64Tool,
  },
  {
    id: "qr-generate",
    name: "二维码生成",
    category: "图片工具",
    state: "可用",
    desc: "将文本或链接生成二维码图片。",
    render: renderQrGenerateTool,
  },
  {
    id: "qr-scan",
    name: "二维码识别",
    category: "图片工具",
    state: "可用",
    desc: "从图片识别二维码内容并以表格展示。",
    render: renderQrScanTool,
  },
];

const state = {
  category: HOME_CATEGORY,
  keyword: "",
  activeToolId: "",
  fixedToolIds: loadFixedToolIds(),
};

const categoryNav = document.getElementById("categoryNav");
const sidebarVersion = document.getElementById("sidebarVersion");
const overviewGrid = document.getElementById("overviewGrid");
const overviewTitle = document.getElementById("overviewTitle");
const overviewHint = document.getElementById("overviewHint");
const toolSearch = document.getElementById("toolSearch");
const panelTitle = document.getElementById("panelTitle");
const panelBody = document.getElementById("panelBody");
const resetBtn = document.getElementById("resetBtn");
const cardTemplate = document.getElementById("cardTemplate");
const cardContextMenu = document.getElementById("cardContextMenu");
const toggleFixedBtn = document.getElementById("toggleFixedBtn");
let panelTransitionTimer = 0;
let contextMenuToolId = "";
let notesSaveTimer = 0;
const backgroundImages = [
  ["res/background1.png", "background1.png"],
  ["res/background2.png", "background2.png"],
  ["res/background3.png", "background3.png"],
];
let backgroundRotationTimer = 0;
const backgroundResolvedUrlCache = new Map();

initialize();

function initialize() {
  setupBackgroundRotation();
  renderSidebarVersion();
  setupCardContextMenu();
  renderCategories();
  renderCards();
  toolSearch.addEventListener("input", (event) => {
    state.keyword = event.target.value.trim();
    renderCards();
  });
  resetBtn.addEventListener("click", () => {
    if (!state.activeToolId) {
      renderDefaultPanelForCurrentView();
      return;
    }
    const tool = getToolById(state.activeToolId);
    if (!tool) {
      clearActiveToolSelection();
      return;
    }
    renderPanelContent(() => {
      tool.render(panelBody);
    });
  });
  renderDefaultPanelForCurrentView(true);
}

function renderSidebarVersion() {
  if (!sidebarVersion) {
    return;
  }
  sidebarVersion.innerHTML = APP_VERSION_DISPLAY.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
}

function setupBackgroundRotation() {
  if (!backgroundImages.length) {
    return;
  }

  let currentIndex = Math.floor(Math.random() * backgroundImages.length);
  applyToolboxBackground(currentIndex);

  if (backgroundRotationTimer) {
    window.clearInterval(backgroundRotationTimer);
  }

  backgroundRotationTimer = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % backgroundImages.length;
    applyToolboxBackground(currentIndex);
  }, 5 * 60 * 1000);

  // Allow manual switching for testing via Ctrl+Shift+B
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "b") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % backgroundImages.length;
      applyToolboxBackground(currentIndex);
    }
  });
}

function applyToolboxBackground(index) {
  const imageCandidates = backgroundImages[index];
  if (!imageCandidates || !imageCandidates.length) {
    return;
  }

  resolveBackgroundImageUrl(index, imageCandidates)
    .then((imageUrl) => {
      document.documentElement.style.setProperty("--toolbox-bg-image", `url("${imageUrl}")`);
    })
    .catch(() => {
      document.documentElement.style.setProperty("--toolbox-bg-image", "none");
    });
}

function resolveBackgroundImageUrl(index, imageCandidates) {
  const cacheKey = String(index);
  const cached = backgroundResolvedUrlCache.get(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  const urlList = imageCandidates.map((path) => new URL(path, window.location.href).href);
  return tryResolveFirstReachableImage(urlList).then((resolvedUrl) => {
    backgroundResolvedUrlCache.set(cacheKey, resolvedUrl);
    return resolvedUrl;
  });
}

function tryResolveFirstReachableImage(urlList) {
  if (!urlList.length) {
    return Promise.reject(new Error("No background image URL candidates."));
  }

  return new Promise((resolve, reject) => {
    const tryAt = (position) => {
      if (position >= urlList.length) {
        reject(new Error("All background image URL candidates failed."));
        return;
      }

      const url = urlList[position];
      const image = new Image();
      image.onload = () => resolve(url);
      image.onerror = () => tryAt(position + 1);
      image.src = url;
    };
    tryAt(0);
  });
}


function renderCategories() {
  categoryNav.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category-btn${state.category === category ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      selectCategory(category);
    });
    categoryNav.appendChild(button);
  });
}

function renderCards() {
  overviewGrid.innerHTML = "";
  syncOverviewCopy();
  const filteredTools = getVisibleTools();

  if (!filteredTools.length) {
    overviewGrid.innerHTML = createEmptyState(
      state.category === HOME_CATEGORY
        ? "主页暂无已固定工具。\n在任意工具卡片上右键，选择“固定到主页”。"
        : "没有匹配项，请调整搜索关键词或分类。",
    );
    return;
  }

  filteredTools.forEach((tool, index) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.style.animationDelay = `${index * 45}ms`;
    card.dataset.toolId = tool.id;
    card.querySelector(".tool-card-category").textContent = tool.category;
    card.querySelector(".tool-card-state").textContent = tool.state;
    card.querySelector(".tool-card-title").textContent = tool.name;
    card.querySelector(".tool-card-desc").textContent = tool.desc;
    if (tool.id === state.activeToolId) {
      card.classList.add("active");
    }
    card.addEventListener("click", () => {
      hideCardContextMenu();
      activateTool(tool.id);
    });
    card.addEventListener("contextmenu", (event) => {
      showCardContextMenu(event, tool.id);
    });
    overviewGrid.appendChild(card);
  });
}

function selectCategory(category) {
  state.category = category;
  hideCardContextMenu();
  const activeTool = getToolById(state.activeToolId);
  if (!activeTool || !isToolVisible(activeTool)) {
    state.activeToolId = "";
    renderDefaultPanelForCurrentView();
  }
  renderCategories();
  renderCards();
}

function activateTool(toolId) {
  const tool = getToolById(toolId);
  if (!tool) {
    return;
  }
  state.activeToolId = tool.id;
  panelTitle.textContent = `${tool.name} · ${tool.category}`;
  renderPanelContent(() => {
    tool.render(panelBody);
  });
  renderCards();
}

function clearActiveToolSelection() {
  state.activeToolId = "";
  renderDefaultPanelForCurrentView();
  renderCards();
}

function renderDefaultPanelForCurrentView(immediate = false) {
  panelTitle.textContent = state.category === HOME_CATEGORY ? "笔记" : "请选择一个工具";
  renderPanelContent(
    () => {
      if (state.category === HOME_CATEGORY) {
        renderHomePanel(panelBody);
        return;
      }
      panelBody.innerHTML = createEmptyState("从上方工具卡片中选择一个模块，查看 Demo 交互。\n左侧分类和顶部搜索会实时筛选卡片。");
    },
    { immediate },
  );
}

function renderHomePanel(container) {
  container.innerHTML = `
    <div class="home-notes-shell">
      <div class="home-notes-head">
        <span id="homeNotesStatus" class="home-notes-status">准备就绪</span>
      </div>
      <div class="home-notes-surface">
        <textarea id="homeNotesInput" class="home-notes-input" placeholder="# 笔记\n\n在这里输入 Markdown 内容"></textarea>
        <div id="homeNotesPreview" class="home-notes-preview">${createEmptyState("输入 Markdown 后，这里会实时显示预览。")}</div>
      </div>
    </div>
  `;

  const input = document.getElementById("homeNotesInput");
  const preview = document.getElementById("homeNotesPreview");
  const status = document.getElementById("homeNotesStatus");
  let renderToken = 0;

  const updateStatus = (text, stateName = "") => {
    status.textContent = text;
    status.dataset.state = stateName;
  };

  const renderPreview = async () => {
    const token = ++renderToken;
    const source = input.value.replace(/\r\n/g, "\n");
    if (!source.trim()) {
      preview.innerHTML = createEmptyState("输入 Markdown 后，这里会实时显示预览。");
      return;
    }
    const renderedHtml = await markdownToSafeHtml(source);
    if (token !== renderToken) {
      return;
    }
    preview.innerHTML = `<article class="markdown-rendered home-notes-rendered">${renderedHtml}</article>`;
  };

  const saveNotes = async () => {
    const content = input.value;
    updateStatus("保存中...", "saving");
    const saved = await persistNotesContent(content);
    updateStatus(saved ? "已保存到 notes.md" : "预览模式已暂存", saved ? "saved" : "fallback");
  };

  const queueSave = () => {
    if (notesSaveTimer) {
      window.clearTimeout(notesSaveTimer);
    }
    notesSaveTimer = window.setTimeout(() => {
      notesSaveTimer = 0;
      void saveNotes();
    }, 320);
  };

  input.addEventListener("input", () => {
    void renderPreview();
    queueSave();
  });

  loadNotesContent()
    .then(async (content) => {
      input.value = content;
      await renderPreview();
      updateStatus(isTauriRuntime() ? "已加载 notes.md" : "预览模式已加载", isTauriRuntime() ? "saved" : "fallback");
    })
    .catch(async (error) => {
      input.value = DEFAULT_NOTES_CONTENT;
      await renderPreview();
      updateStatus(`加载失败：${error.message || error}`, "error");
    });
}

function syncOverviewCopy() {
  if (!overviewTitle || !overviewHint) {
    return;
  }
  if (state.category === HOME_CATEGORY) {
    overviewTitle.textContent = HOME_CATEGORY;
    overviewHint.textContent = "";
    return;
  }
  overviewTitle.textContent = `${state.category}列表`;
  overviewHint.textContent = "点击卡片打开功能；右键卡片可固定到主页。";
}

function getVisibleTools() {
  const sourceTools = state.category === HOME_CATEGORY ? getPinnedTools() : tools.filter((tool) => tool.category === state.category);
  const q = state.keyword.toLowerCase();
  return sourceTools.filter((tool) => !q || tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q));
}

function isToolVisible(tool) {
  return getVisibleTools().some((item) => item.id === tool.id);
}

function getPinnedTools() {
  const pinnedIdSet = new Set(state.fixedToolIds);
  return state.fixedToolIds
    .map((toolId) => getToolById(toolId))
    .filter((tool) => Boolean(tool) && pinnedIdSet.has(tool.id));
}

function isToolPinned(toolId) {
  return state.fixedToolIds.includes(toolId);
}

function togglePinnedTool(toolId) {
  if (!toolId || !getToolById(toolId)) {
    return;
  }
  if (isToolPinned(toolId)) {
    state.fixedToolIds = state.fixedToolIds.filter((id) => id !== toolId);
    if (state.category === HOME_CATEGORY && state.activeToolId === toolId) {
      state.activeToolId = "";
      renderDefaultPanelForCurrentView();
    }
  } else {
    state.fixedToolIds = [...state.fixedToolIds, toolId];
  }
  persistFixedToolIds(state.fixedToolIds);
  renderCards();
}

function setupCardContextMenu() {
  if (!cardContextMenu || !toggleFixedBtn) {
    return;
  }
  toggleFixedBtn.addEventListener("click", () => {
    if (!contextMenuToolId) {
      return;
    }
    togglePinnedTool(contextMenuToolId);
    hideCardContextMenu();
  });
  document.addEventListener("click", (event) => {
    if (cardContextMenu.hidden) {
      return;
    }
    if (!cardContextMenu.contains(event.target)) {
      hideCardContextMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideCardContextMenu();
    }
  });
  window.addEventListener("resize", hideCardContextMenu);
  document.addEventListener("scroll", hideCardContextMenu, true);
}

function showCardContextMenu(event, toolId) {
  if (!cardContextMenu || !toggleFixedBtn) {
    return;
  }
  event.preventDefault();
  contextMenuToolId = toolId;
  toggleFixedBtn.textContent = isToolPinned(toolId) ? "取消固定" : "固定到主页";
  cardContextMenu.hidden = false;
  cardContextMenu.style.left = "0px";
  cardContextMenu.style.top = "0px";
  const { offsetWidth, offsetHeight } = cardContextMenu;
  const clampedLeft = Math.max(12, Math.min(event.clientX, window.innerWidth - offsetWidth - 12));
  const clampedTop = Math.max(12, Math.min(event.clientY, window.innerHeight - offsetHeight - 12));
  cardContextMenu.style.left = `${clampedLeft}px`;
  cardContextMenu.style.top = `${clampedTop}px`;
}

function hideCardContextMenu() {
  if (!cardContextMenu) {
    return;
  }
  cardContextMenu.hidden = true;
  contextMenuToolId = "";
}

function loadFixedToolIds() {
  const validIdSet = new Set(tools.map((tool) => tool.id));
  const legacyDefaultIds = ["system-overview", "network-check", "radix-convert", "text-stats"];
  try {
    const raw = window.localStorage.getItem(FIXED_LIST_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_FIXED_TOOL_IDS.slice();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_FIXED_TOOL_IDS.slice();
    }
    const deduped = [];
    parsed.forEach((toolId) => {
      if (typeof toolId === "string" && validIdSet.has(toolId) && !deduped.includes(toolId)) {
        deduped.push(toolId);
      }
    });
    if (deduped.length === legacyDefaultIds.length && legacyDefaultIds.every((toolId, index) => deduped[index] === toolId)) {
      return DEFAULT_FIXED_TOOL_IDS.slice();
    }
    return deduped.length ? deduped : DEFAULT_FIXED_TOOL_IDS.slice();
  } catch (_) {
    return DEFAULT_FIXED_TOOL_IDS.slice();
  }
}

function persistFixedToolIds(toolIds) {
  try {
    window.localStorage.setItem(FIXED_LIST_STORAGE_KEY, JSON.stringify(toolIds));
    return true;
  } catch (_) {
    return false;
  }
}

async function loadNotesContent() {
  if (isTauriRuntime()) {
    try {
      const result = await invoke("read_notes_md");
      if (result && typeof result === "object") {
        if (result.exists && typeof result.content === "string") {
          return result.content;
        }
        if (result.exists === false) {
          return DEFAULT_NOTES_CONTENT;
        }
      }
    } catch (error) {
      console.warn("读取 notes.md 失败，改用本地暂存。", error);
    }
  }

  try {
    const cached = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (cached && cached.trim()) {
      return cached;
    }
  } catch (error) {
    console.warn("读取本地暂存笔记失败。", error);
  }

  return DEFAULT_NOTES_CONTENT;
}

async function persistNotesContent(content) {
  const normalized = String(content || "").replace(/\r\n/g, "\n");
  if (isTauriRuntime()) {
    try {
      await invoke("write_notes_md", { content: normalized });
      return true;
    } catch (error) {
      console.warn("写入 notes.md 失败，改用本地暂存。", error);
    }
  }

  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, normalized);
  } catch (error) {
    console.warn("写入本地暂存笔记失败。", error);
    return false;
  }
  return false;
}

function getToolById(toolId) {
  return tools.find((tool) => tool.id === toolId) || null;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function renderPanelContent(renderContent, options = {}) {
  const { immediate = false } = options;

  if (panelTransitionTimer) {
    window.clearTimeout(panelTransitionTimer);
    panelTransitionTimer = 0;
  }

  panelBody.classList.remove("is-switching", "is-entering");

  const animateIn = () => {
    renderContent();
    if (prefersReducedMotion()) {
      return;
    }
    void panelBody.offsetWidth;
    panelBody.classList.add("is-entering");
    panelTransitionTimer = window.setTimeout(() => {
      panelBody.classList.remove("is-entering");
      panelTransitionTimer = 0;
    }, 260);
  };

  if (immediate || prefersReducedMotion() || !panelBody.children.length) {
    animateIn();
    return;
  }

  panelBody.classList.add("is-switching");
  panelTransitionTimer = window.setTimeout(() => {
    panelBody.classList.remove("is-switching");
    animateIn();
  }, 120);
}

function createEmptyState(text) {
  return `<div class="empty">${text.replace(/\n/g, "<br />")}</div>`;
}

function isTauriRuntime() {
  const invokeFromApi = window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function";
  const invokeFromInternals = window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === "function";
  return Boolean(invokeFromApi || invokeFromInternals);
}

async function invoke(command, args = {}) {
  if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function") {
    return window.__TAURI__.core.invoke(command, args);
  }
  if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === "function") {
    return window.__TAURI_INTERNALS__.invoke(command, args);
  }
  if (!isTauriRuntime()) {
    throw new Error("当前是浏览器预览模式，未连接 Tauri 后端。");
  }
  throw new Error("未找到可用的 Tauri invoke 接口。");
}

function setLoading(container, text = "正在加载，请稍候...") {
  container.innerHTML = `<div class="empty">${text}</div>`;
}

function renderError(container, message) {
  container.innerHTML = `<div class="empty">${escapeHtml(message)}</div>`;
}

async function renderSystemOverview(container) {
  container.innerHTML = `
    <div class="tool-actions">
      <button id="refreshSystemOverview">刷新系统信息</button>
    </div>
    <div id="systemOverviewContent"></div>
  `;

  const refreshButton = document.getElementById("refreshSystemOverview");
  const content = document.getElementById("systemOverviewContent");

  refreshButton.addEventListener("click", () => {
    loadSystemOverview(content, true);
  });

  loadSystemOverview(content, false);
}

let cachedSystemOverviewReport = null;

function renderSystemOverviewReport(content, report) {
  const hardware = report.hardware || {};
  const os = normalizeArray(hardware.os)[0] || {};
  const computer = normalizeArray(hardware.computer)[0] || {};
  const bios = normalizeArray(hardware.bios)[0] || {};
  const cpu = normalizeArray(hardware.cpu)[0] || {};

  const summaryItems = [
    { key: "计算机名", value: os.CSName || computer.CSName || "未知" },
    { key: "系统版本", value: `${os.Caption || "未知"} ${os.Version || ""}`.trim() },
    { key: "系统架构", value: os.OSArchitecture || computer.SystemType || "未知" },
    { key: "设备型号", value: `${computer.Manufacturer || ""} ${computer.Model || ""}`.trim() || "未知" },
    { key: "CPU", value: cpu.Name || "未知" },
    {
      key: "物理内存",
      value: computer.TotalPhysicalMemory ? formatBytes(Number(computer.TotalPhysicalMemory)) : "未知",
    },
    { key: "BIOS 版本", value: bios.SMBIOSBIOSVersion || "未知" },
    { key: "开机时间", value: formatWmiDate(os.LastBootUpTime) },
  ];

  const memoryRows = normalizeArray(hardware.memory)
    .map(
      (item) => `${item.Manufacturer || "未知"} ${item.PartNumber || ""} · 容量 ${formatBytes(Number(item.Capacity || 0))} · 频率 ${item.ConfiguredClockSpeed || item.Speed || "未知"} MHz`,
    )
    .filter(Boolean)
    .join("\n");

  const diskRows = normalizeArray(hardware.logicalDisk)
    .map(
      (item) => `${item.DeviceID || "未知"} ${item.VolumeName || ""} · ${item.FileSystem || ""} · 总 ${formatBytes(Number(item.Size || 0))} · 可用 ${formatBytes(Number(item.FreeSpace || 0))}`,
    )
    .filter(Boolean)
    .join("\n");

  const networkRows = normalizeArray(hardware.network)
    .map(
      (item) => `${item.Description || "未知"}\nMAC: ${item.MACAddress || "未知"}\nIP: ${normalizeArray(item.IPAddress).join(", ") || "未知"}`,
    )
    .join("\n\n");

  content.innerHTML = `
    <div class="kv-grid">
      ${summaryItems
        .map(
          (item) => `
        <article class="kv-item">
          <p>${item.key}</p>
          <h5>${escapeHtml(item.value)}</h5>
        </article>
      `,
        )
        .join("")}
    </div>

    <details class="details-block">
      <summary>内存条明细</summary>
      <pre class="result-box">${escapeHtml(memoryRows || "无数据")}</pre>
    </details>

    <details class="details-block">
      <summary>磁盘分区明细</summary>
      <pre class="result-box">${escapeHtml(diskRows || "无数据")}</pre>
    </details>

    <details class="details-block">
      <summary>已启用网络适配器（系统信息）</summary>
      <pre class="result-box">${escapeHtml(networkRows || "无数据")}</pre>
    </details>

    <details class="details-block">
      <summary>systeminfo 原始输出</summary>
      <pre class="result-box">${escapeHtml(report.systeminfoText || "无数据")}</pre>
    </details>

    <details class="details-block">
      <summary>msinfo32 原始输出</summary>
      <pre class="result-box">${escapeHtml(report.msinfo32Text || "无数据")}</pre>
    </details>
  `;
}

async function loadSystemOverview(content, forceRefresh = false) {
  setLoading(content, "正在采集系统信息（包括 msinfo32），首次可能需要 10-40 秒...");

  if (!isTauriRuntime()) {
    const now = new Date();
    const infoItems = [
      { key: "浏览器平台", value: navigator.platform || "未知" },
      { key: "用户代理", value: navigator.userAgent },
      { key: "系统语言", value: navigator.language || "未知" },
      { key: "CPU 线程", value: navigator.hardwareConcurrency || "未知" },
      { key: "设备内存", value: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "未知" },
      { key: "在线状态", value: navigator.onLine ? "已连接" : "离线" },
      { key: "屏幕分辨率", value: `${window.screen.width} x ${window.screen.height}` },
      { key: "当前时间", value: formatDateTime(now) },
    ];
    content.innerHTML = `
      <div class="kv-grid">
        ${infoItems
          .map(
            (item) => `
          <article class="kv-item">
            <p>${item.key}</p>
            <h5>${escapeHtml(item.value)}</h5>
          </article>
        `,
          )
          .join("")}
      </div>
      <p class="hint">当前是浏览器模式。请使用 <code>npm run dev</code> 启动 Tauri 后可获取完整 Windows 系统信息。</p>
    `;
    return;
  }

  if (cachedSystemOverviewReport && !forceRefresh) {
    renderSystemOverviewReport(content, cachedSystemOverviewReport);
    return;
  }

  try {
    const report = await invoke("get_system_overview");
    cachedSystemOverviewReport = report;
    renderSystemOverviewReport(content, report);
  } catch (error) {
    renderError(content, `系统信息采集失败：${error.message || error}`);
  }
}

async function renderNetworkCheck(container) {
  container.innerHTML = `
    <div class="tool-actions">
      <button id="refreshNetwork">刷新网络检查</button>
    </div>
    <div id="networkContent"></div>
  `;

  const refreshButton = document.getElementById("refreshNetwork");
  const content = document.getElementById("networkContent");

  refreshButton.addEventListener("click", () => {
    loadNetworkReport(content);
  });

  loadNetworkReport(content);
}

async function loadNetworkReport(content) {
  setLoading(content, "正在检测网卡和目标网站连通情况，这一步可能需要一些时间...");

  if (!isTauriRuntime()) {
    content.innerHTML = `
      <div class="kv-grid">
        <article class="kv-item"><p>在线状态</p><h5>${navigator.onLine ? "在线" : "离线"}</h5></article>
        <article class="kv-item"><p>连接类型</p><h5>${navigator.connection?.effectiveType || "未知"}</h5></article>
        <article class="kv-item"><p>往返延迟</p><h5>${navigator.connection?.rtt ? `${navigator.connection.rtt} ms` : "未知"}</h5></article>
        <article class="kv-item"><p>下行速率</p><h5>${navigator.connection?.downlink ? `${navigator.connection.downlink} Mbps` : "未知"}</h5></article>
      </div>
      <p class="hint">当前是浏览器模式。请在 Tauri 中运行以获取网卡列表和站点连通性检测。</p>
    `;
    return;
  }

  try {
    const report = await invoke("get_network_report");
    const adapters = normalizeArray(report.adapters);
    const ipConfigurations = normalizeArray(report.ipConfigurations);
    const domestic = normalizeArray(report.domestic);
    const foreign = normalizeArray(report.foreign);

    const adapterRows = adapters
      .map(
        (item) => `
      <tr>
        <td>${escapeHtml(item.Name || "-")}</td>
        <td>${escapeHtml(item.Status || "-")}</td>
        <td>${escapeHtml(item.MacAddress || "-")}</td>
        <td>${escapeHtml(item.LinkSpeed || "-")}</td>
      </tr>`,
      )
      .join("");

    const ipRows = ipConfigurations
      .map(
        (item) => `
      <tr>
        <td>${escapeHtml(item.InterfaceAlias || "-")}</td>
        <td>${escapeHtml(item.IPv4Address || "-")}</td>
        <td>${escapeHtml(item.DefaultGateway || "-")}</td>
        <td>${escapeHtml(item.DnsServer || "-")}</td>
      </tr>`,
      )
      .join("");

    content.innerHTML = `
      <h4 class="panel-subtitle">网卡信息</h4>
      ${adapters.length ? createSimpleTable(["名称", "状态", "MAC", "链路速率"], adapterRows) : createEmptyState("未读取到网卡信息")}

      <h4 class="panel-subtitle">IP 配置</h4>
      ${ipConfigurations.length ? createSimpleTable(["接口", "IPv4", "网关", "DNS"], ipRows) : createEmptyState("未读取到 IP 配置")}

      <h4 class="panel-subtitle">国内网站连通性</h4>
      ${createSiteGrid(domestic)}

      <h4 class="panel-subtitle">国外网站连通性</h4>
      ${createSiteGrid(foreign)}
    `;
  } catch (error) {
    renderError(content, `网络检测失败：${error.message || error}`);
  }
}

async function renderDisplayManager(container) {
  container.innerHTML = `
    <div class="tool-actions">
      <button id="refreshDisplay">刷新显示信息</button>
    </div>
    <div id="displayContent"></div>
  `;

  const refreshButton = document.getElementById("refreshDisplay");
  const content = document.getElementById("displayContent");

  refreshButton.addEventListener("click", () => {
    loadDisplayReport(content);
  });

  loadDisplayReport(content);
}

async function loadDisplayReport(content) {
  setLoading(content, "正在采集显卡和显示器信息...");

  if (!isTauriRuntime()) {
    content.innerHTML = `
      <div class="kv-grid">
        <article class="kv-item"><p>当前分辨率</p><h5>${window.screen.width} x ${window.screen.height}</h5></article>
        <article class="kv-item"><p>颜色深度</p><h5>${window.screen.colorDepth} bit</h5></article>
      </div>
      <p class="hint">当前是浏览器模式。请在 Tauri 中运行以获取显卡和显示器硬件信息。</p>
    `;
    return;
  }

  try {
    const report = await invoke("get_display_report");
    const gpuList = normalizeArray(report.gpu);
    const monitorList = normalizeArray(report.desktopMonitors);
    const monitorIds = normalizeArray(report.monitorIds);

    const gpuRows = gpuList
      .map(
        (item) => `
      <tr>
        <td>${escapeHtml(item.Name || "-")}</td>
        <td>${escapeHtml(item.VideoProcessor || "-")}</td>
        <td>${escapeHtml(formatBytes(Number(item.AdapterRAM || 0)))}</td>
        <td>${escapeHtml(item.DriverVersion || "-")}</td>
        <td>${escapeHtml(formatResolution(item.CurrentHorizontalResolution, item.CurrentVerticalResolution, item.CurrentRefreshRate))}</td>
      </tr>`,
      )
      .join("");

    const monitorRows = monitorList
      .map(
        (item) => `
      <tr>
        <td>${escapeHtml(item.Name || "-")}</td>
        <td>${escapeHtml(item.MonitorType || "-")}</td>
        <td>${escapeHtml(formatResolution(item.ScreenWidth, item.ScreenHeight))}</td>
        <td>${escapeHtml(item.Status || "-")}</td>
        <td class="command-cell">${escapeHtml(item.PNPDeviceID || "-")}</td>
      </tr>`,
      )
      .join("");

    const monitorIdRows = monitorIds
      .map(
        (item) => `
      <tr>
        <td>${escapeHtml(item.Manufacturer || "-")}</td>
        <td>${escapeHtml(item.ProductCode || "-")}</td>
        <td>${escapeHtml(item.SerialNumber || "-")}</td>
        <td>${escapeHtml(item.Active ? "是" : "否")}</td>
      </tr>`,
      )
      .join("");

    content.innerHTML = `
      <h4 class="panel-subtitle">显卡信息</h4>
      ${gpuList.length ? createSimpleTable(["名称", "图形处理器", "显存", "驱动", "当前模式"], gpuRows) : createEmptyState("未读取到显卡信息")}

      <h4 class="panel-subtitle">显示器信息</h4>
      ${monitorList.length ? createSimpleTable(["名称", "类型", "分辨率", "状态", "PNP 设备 ID"], monitorRows) : createEmptyState("未读取到显示器信息")}

      <h4 class="panel-subtitle">显示器厂商识别</h4>
      ${monitorIds.length ? createSimpleTable(["厂商", "产品码", "序列号", "激活"], monitorIdRows) : createEmptyState("未读取到 WmiMonitorID 信息")}
    `;
  } catch (error) {
    renderError(content, `显示信息采集失败：${error.message || error}`);
  }
}

function createSimpleTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table class="info-table">
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function createSiteGrid(items) {
  if (!items.length) {
    return createEmptyState("无连通性结果");
  }

  return `
    <div class="site-grid">
      ${items
        .map((item) => {
          const reachable = Boolean(item.reachable);
          const pingSucceeded = Boolean(item.pingSucceeded);
          const badgeClass = reachable ? "site-ok" : "site-fail";
          const badgeText = reachable ? "可达" : "不可达";
          const latency = item.latencyMs === null || item.latencyMs === undefined ? "-" : `${item.latencyMs} ms`;
          const pingText = pingSucceeded ? "成功" : item.pingError ? `失败（${item.pingError}）` : "失败";
          return `
          <article class="site-item">
            <div class="site-head">
              <h5>${escapeHtml(item.label || "-")}</h5>
              <span class="site-badge ${badgeClass}">${badgeText}</span>
            </div>
            <p class="site-host">${escapeHtml(item.host || "-")}</p>
            <p>TCP 443：${reachable ? "通过" : "失败"}</p>
            <p>Ping：${escapeHtml(pingText)}</p>
            <p>延迟：${escapeHtml(latency)}</p>
            <p>DNS：${escapeHtml(item.dnsAddress || "-")}</p>
            <p>远端：${escapeHtml(item.remoteAddress || "-")}</p>
          </article>
        `;
        })
        .join("")}
    </div>
  `;
}

function renderTextTransform(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="textInput">输入文本</label>
      <textarea id="textInput" placeholder="输入多行文本，用于转换或去重"></textarea>
    </div>
    <div class="tool-actions">
      <button id="btnUpper">转大写</button>
      <button id="btnLower">转小写</button>
      <button id="btnTrim" class="alt">去空行</button>
      <button id="btnDedup" class="alt">按行去重</button>
    </div>
    <div class="control-row">
      <label for="textOutput">输出结果</label>
      <textarea id="textOutput" placeholder="转换结果"></textarea>
    </div>
  `;

  const input = document.getElementById("textInput");
  const output = document.getElementById("textOutput");
  document.getElementById("btnUpper").addEventListener("click", () => {
    output.value = input.value.toUpperCase();
  });
  document.getElementById("btnLower").addEventListener("click", () => {
    output.value = input.value.toLowerCase();
  });
  document.getElementById("btnTrim").addEventListener("click", () => {
    output.value = input.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .join("\n");
  });
  document.getElementById("btnDedup").addEventListener("click", () => {
    const unique = [...new Set(input.value.split("\n"))];
    output.value = unique.join("\n");
  });
}

function renderJsonFormatter(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="jsonInput">JSON 输入</label>
      <textarea id="jsonInput" placeholder='例如：{"name":"KZ","version":"0.1.0"}'></textarea>
    </div>
    <div class="tool-actions">
      <button id="jsonFormat">格式化</button>
      <button id="jsonMinify" class="alt">压缩</button>
    </div>
    <pre id="jsonResult" class="result-box">等待输入...</pre>
  `;

  const input = document.getElementById("jsonInput");
  const result = document.getElementById("jsonResult");
  document.getElementById("jsonFormat").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(input.value);
      result.textContent = JSON.stringify(parsed, null, 2);
    } catch (error) {
      result.textContent = `解析失败：${error.message}`;
    }
  });
  document.getElementById("jsonMinify").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(input.value);
      result.textContent = JSON.stringify(parsed);
    } catch (error) {
      result.textContent = `解析失败：${error.message}`;
    }
  });
}

function renderCodeFormatter(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="codeLang">代码类型</label>
      <select id="codeLang">
        <option value="javascript">JavaScript</option>
        <option value="json">JSON</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
      </select>
    </div>
    <div class="control-row">
      <label for="codeInput">代码输入</label>
      <textarea id="codeInput" placeholder="粘贴代码内容"></textarea>
    </div>
    <div class="tool-actions">
      <button id="codeFormatBtn">格式化</button>
      <button id="codeCompressBtn" class="alt">压缩一行</button>
    </div>
    <p class="hint">已集成 Prettier（JS/JSON/CSS/HTML/Java）。C/C++/C# 目前使用基础缩进整理。</p>
    <div id="codeOutput" class="result-box">等待输入...</div>
  `;

  const langInput = document.getElementById("codeLang");
  const codeInput = document.getElementById("codeInput");
  const output = document.getElementById("codeOutput");

  document.getElementById("codeFormatBtn").addEventListener("click", async () => {
    const lang = langInput.value;
    const source = codeInput.value;
    if (!source.trim()) {
      output.textContent = "请输入代码内容。";
      return;
    }
    output.textContent = "格式化中，请稍候...";
    try {
      const formatted = await formatCodeByLanguage(source, lang, true);
      renderHighlightedCode(output, formatted, lang);
    } catch (error) {
      output.textContent = `格式化失败：${error.message || error}`;
    }
  });

  document.getElementById("codeCompressBtn").addEventListener("click", async () => {
    const lang = langInput.value;
    const source = codeInput.value;
    if (!source.trim()) {
      output.textContent = "请输入代码内容。";
      return;
    }
    output.textContent = "压缩中，请稍候...";
    try {
      const compressed = await formatCodeByLanguage(source, lang, false);
      renderHighlightedCode(output, compressed, lang);
    } catch (error) {
      output.textContent = `压缩失败：${error.message || error}`;
    }
  });
}

function renderBase64Tool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="b64Input">输入内容</label>
      <textarea id="b64Input" placeholder="输入 UTF-8 文本"></textarea>
    </div>
    <div class="tool-actions">
      <button id="encodeBtn">编码</button>
      <button id="decodeBtn" class="alt">解码</button>
    </div>
    <pre id="b64Result" class="result-box">等待输入...</pre>
  `;

  const input = document.getElementById("b64Input");
  const result = document.getElementById("b64Result");
  document.getElementById("encodeBtn").addEventListener("click", () => {
    result.textContent = utf8ToBase64(input.value);
  });
  document.getElementById("decodeBtn").addEventListener("click", () => {
    try {
      result.textContent = base64ToUtf8(input.value);
    } catch (error) {
      result.textContent = `解码失败：${error.message}`;
    }
  });
}

function renderTimestampTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="tsInput">时间戳（毫秒）</label>
      <input id="tsInput" type="text" placeholder="例如：1711545600000" />
    </div>
    <div class="tool-actions">
      <button id="toDateBtn">转日期</button>
      <button id="nowBtn" class="alt">填入当前时间戳</button>
      <button id="toTsBtn" class="warn">日期转时间戳</button>
    </div>
    <div class="control-row">
      <label for="dateInput">日期时间（本地）</label>
      <input id="dateInput" type="datetime-local" />
    </div>
    <pre id="tsResult" class="result-box">等待输入...</pre>
  `;

  const tsInput = document.getElementById("tsInput");
  const dateInput = document.getElementById("dateInput");
  const result = document.getElementById("tsResult");

  document.getElementById("toDateBtn").addEventListener("click", () => {
    const value = Number(tsInput.value);
    if (!Number.isFinite(value)) {
      result.textContent = "请输入有效数字时间戳。";
      return;
    }
    result.textContent = formatDateTime(new Date(value));
  });

  document.getElementById("nowBtn").addEventListener("click", () => {
    const now = Date.now();
    tsInput.value = String(now);
    result.textContent = `当前时间戳：${now}`;
  });

  document.getElementById("toTsBtn").addEventListener("click", () => {
    if (!dateInput.value) {
      result.textContent = "请先选择日期时间。";
      return;
    }
    const ts = new Date(dateInput.value).getTime();
    result.textContent = `转换结果：${ts}`;
  });
}

function renderUrlCodec(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="urlCodecInput">输入内容</label>
      <textarea id="urlCodecInput" placeholder="例如：https://example.com/?q=你好 world"></textarea>
    </div>
    <div class="tool-actions">
      <button id="urlEncodeBtn">URL 编码</button>
      <button id="urlDecodeBtn" class="alt">URL 解码</button>
    </div>
    <pre id="urlCodecOutput" class="result-box">等待输入...</pre>
  `;

  const input = document.getElementById("urlCodecInput");
  const output = document.getElementById("urlCodecOutput");

  document.getElementById("urlEncodeBtn").addEventListener("click", () => {
    output.textContent = encodeURIComponent(input.value);
  });

  document.getElementById("urlDecodeBtn").addEventListener("click", () => {
    try {
      output.textContent = decodeURIComponent(input.value);
    } catch (error) {
      output.textContent = `解码失败：${error.message}`;
    }
  });
}

function renderAesTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="aesInput">输入文本</label>
      <textarea id="aesInput" placeholder="输入需要加密或解密的文本"></textarea>
    </div>
    <div class="control-row">
      <label for="aesPassword">密码</label>
      <input id="aesPassword" type="password" placeholder="输入加密密码" />
    </div>
    <div class="tool-actions">
      <button id="aesEncryptBtn">AES 加密</button>
      <button id="aesDecryptBtn" class="alt">AES 解密</button>
    </div>
    <pre id="aesOutput" class="result-box">等待输入...</pre>
  `;

  const input = document.getElementById("aesInput");
  const password = document.getElementById("aesPassword");
  const output = document.getElementById("aesOutput");

  document.getElementById("aesEncryptBtn").addEventListener("click", async () => {
    if (!password.value) {
      output.textContent = "请输入密码。";
      return;
    }
    try {
      output.textContent = await aesEncryptText(input.value, password.value);
    } catch (error) {
      output.textContent = `加密失败：${error.message || error}`;
    }
  });

  document.getElementById("aesDecryptBtn").addEventListener("click", async () => {
    if (!password.value) {
      output.textContent = "请输入密码。";
      return;
    }
    try {
      output.textContent = await aesDecryptText(input.value.trim(), password.value);
    } catch (error) {
      output.textContent = `解密失败：${error.message || error}`;
    }
  });
}

function renderRsaTool(container) {
  container.innerHTML = `
    <div class="tool-actions">
      <button id="rsaGenKeyBtn">生成 RSA 密钥对</button>
    </div>
    <div class="control-row">
      <label for="rsaPublicKey">公钥（Base64 SPKI）</label>
      <textarea id="rsaPublicKey" placeholder="点击“生成 RSA 密钥对”后自动填充"></textarea>
    </div>
    <div class="control-row">
      <label for="rsaPrivateKey">私钥（Base64 PKCS8）</label>
      <textarea id="rsaPrivateKey" placeholder="点击“生成 RSA 密钥对”后自动填充"></textarea>
    </div>
    <div class="control-row">
      <label for="rsaInput">输入文本 / Base64 密文</label>
      <textarea id="rsaInput" placeholder="加密时输入明文；解密时输入 Base64 密文"></textarea>
    </div>
    <div class="tool-actions">
      <button id="rsaEncryptBtn">RSA 加密</button>
      <button id="rsaDecryptBtn" class="alt">RSA 解密</button>
    </div>
    <pre id="rsaOutput" class="result-box">等待输入...</pre>
  `;

  const publicKeyInput = document.getElementById("rsaPublicKey");
  const privateKeyInput = document.getElementById("rsaPrivateKey");
  const input = document.getElementById("rsaInput");
  const output = document.getElementById("rsaOutput");

  document.getElementById("rsaGenKeyBtn").addEventListener("click", async () => {
    try {
      const keyPair = await generateRsaKeyPair();
      publicKeyInput.value = keyPair.publicKeyBase64;
      privateKeyInput.value = keyPair.privateKeyBase64;
      output.textContent = "RSA 密钥对已生成。";
    } catch (error) {
      output.textContent = `生成密钥失败：${error.message || error}`;
    }
  });

  document.getElementById("rsaEncryptBtn").addEventListener("click", async () => {
    try {
      const cipher = await rsaEncryptText(input.value, publicKeyInput.value.trim());
      output.textContent = cipher;
    } catch (error) {
      output.textContent = `加密失败：${error.message || error}`;
    }
  });

  document.getElementById("rsaDecryptBtn").addEventListener("click", async () => {
    try {
      const plain = await rsaDecryptText(input.value.trim(), privateKeyInput.value.trim());
      output.textContent = plain;
    } catch (error) {
      output.textContent = `解密失败：${error.message || error}`;
    }
  });
}

function renderPasswordGenerator(container) {
  container.innerHTML = `
    <div class="control-grid-two">
      <div class="control-row">
        <label for="pwdLength">长度</label>
        <input id="pwdLength" type="number" min="4" max="128" value="16" />
      </div>
      <div class="control-row inline-check-row">
        <label class="inline-check"><input id="pwdUpper" type="checkbox" checked /> 大写字母</label>
        <label class="inline-check"><input id="pwdLower" type="checkbox" checked /> 小写字母</label>
        <label class="inline-check"><input id="pwdNumber" type="checkbox" checked /> 数字</label>
        <label class="inline-check"><input id="pwdSymbol" type="checkbox" checked /> 符号</label>
      </div>
    </div>
    <div class="tool-actions">
      <button id="genPwdBtn">生成密码</button>
    </div>
    <pre id="pwdOutput" class="result-box">等待生成...</pre>
  `;

  const lengthInput = document.getElementById("pwdLength");
  const upper = document.getElementById("pwdUpper");
  const lower = document.getElementById("pwdLower");
  const number = document.getElementById("pwdNumber");
  const symbol = document.getElementById("pwdSymbol");
  const output = document.getElementById("pwdOutput");

  document.getElementById("genPwdBtn").addEventListener("click", () => {
    const length = Number(lengthInput.value);
    if (!Number.isInteger(length) || length < 4 || length > 128) {
      output.textContent = "长度请输入 4-128 之间的整数。";
      return;
    }
    try {
      output.textContent = generatePassword(length, {
        upper: upper.checked,
        lower: lower.checked,
        number: number.checked,
        symbol: symbol.checked,
      });
    } catch (error) {
      output.textContent = error.message || String(error);
    }
  });
}

function renderFileHashTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="hashFileInput">选择文件</label>
      <input id="hashFileInput" type="file" />
    </div>
    <div class="control-row">
      <label for="hashAlgo">算法</label>
      <select id="hashAlgo">
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-1">SHA-1</option>
        <option value="SHA-512">SHA-512</option>
      </select>
    </div>
    <div class="tool-actions">
      <button id="calcHashBtn">计算哈希</button>
    </div>
    <pre id="hashOutput" class="result-box">请选择文件并计算...</pre>
  `;

  const fileInput = document.getElementById("hashFileInput");
  const algoInput = document.getElementById("hashAlgo");
  const output = document.getElementById("hashOutput");

  document.getElementById("calcHashBtn").addEventListener("click", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      output.textContent = "请先选择文件。";
      return;
    }

    output.textContent = "计算中，请稍候...";
    try {
      const buffer = await file.arrayBuffer();
      const digest = await crypto.subtle.digest(algoInput.value, buffer);
      output.textContent = `${algoInput.value}\n${toHex(digest)}`;
    } catch (error) {
      output.textContent = `计算失败：${error.message || error}`;
    }
  });
}

function renderTextStatsTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="statsInput">输入文本</label>
      <textarea id="statsInput" placeholder="粘贴要统计的文本"></textarea>
    </div>
    <p class="hint">实时统计：输入时自动更新，无需点击按钮。</p>
    <div id="statsOutput"></div>
  `;

  const input = document.getElementById("statsInput");
  const output = document.getElementById("statsOutput");

  const renderStats = () => {
    const text = input.value;
    const lines = text ? text.split(/\r?\n/) : [];
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const letters = (text.match(/[A-Za-z]/g) || []).length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const digits = (text.match(/[0-9]/g) || []).length;

    output.innerHTML = `
      <div class="kv-grid">
        <article class="kv-item"><p>字符总数（含空格）</p><h5>${text.length}</h5></article>
        <article class="kv-item"><p>字符总数（不含空格）</p><h5>${text.replace(/\s/g, "").length}</h5></article>
        <article class="kv-item"><p>中文字符</p><h5>${chineseChars}</h5></article>
        <article class="kv-item"><p>英文字母</p><h5>${letters}</h5></article>
        <article class="kv-item"><p>英文单词</p><h5>${words}</h5></article>
        <article class="kv-item"><p>数字个数</p><h5>${digits}</h5></article>
        <article class="kv-item"><p>总行数</p><h5>${lines.length}</h5></article>
        <article class="kv-item"><p>非空行数</p><h5>${nonEmptyLines.length}</h5></article>
      </div>
    `;
  };

  input.addEventListener("input", renderStats);
  renderStats();
}

function renderRadixTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="radixInput">输入十进制整数</label>
      <input id="radixInput" type="text" placeholder="例如：255" />
    </div>
    <div class="tool-actions">
      <button id="convertRadix">转换</button>
    </div>
    <div class="kv-grid">
      <article class="kv-item"><p>二进制</p><h5 id="binOut">-</h5></article>
      <article class="kv-item"><p>八进制</p><h5 id="octOut">-</h5></article>
      <article class="kv-item"><p>十六进制</p><h5 id="hexOut">-</h5></article>
      <article class="kv-item"><p>字符（ASCII）</p><h5 id="charOut">-</h5></article>
    </div>
  `;

  document.getElementById("convertRadix").addEventListener("click", () => {
    const input = document.getElementById("radixInput").value.trim();
    const num = Number(input);
    if (!Number.isInteger(num) || num < 0) {
      document.getElementById("binOut").textContent = "请输入非负整数";
      document.getElementById("octOut").textContent = "请输入非负整数";
      document.getElementById("hexOut").textContent = "请输入非负整数";
      document.getElementById("charOut").textContent = "请输入非负整数";
      return;
    }
    document.getElementById("binOut").textContent = num.toString(2);
    document.getElementById("octOut").textContent = num.toString(8);
    document.getElementById("hexOut").textContent = num.toString(16).toUpperCase();
    document.getElementById("charOut").textContent = num >= 32 && num <= 126 ? String.fromCharCode(num) : "不可打印";
  });
}

function renderScientificCalculator(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="sciExprInput">数学表达式</label>
      <input id="sciExprInput" type="text" placeholder="例如：sin(pi / 6) + sqrt(16) * log10(100)" />
    </div>
    <p class="hint">支持：+ - * / % ^、括号、sin/cos/tan、asin/acos/atan、sqrt、pow、log、log10、abs、floor、ceil、round、exp、pi、e</p>
    <div class="tool-actions">
      <button id="sciCalcBtn">计算</button>
      <button id="sciClearBtn" class="alt">清空</button>
    </div>
    <pre id="sciCalcOutput" class="result-box">等待输入...</pre>
  `;

  const input = document.getElementById("sciExprInput");
  const output = document.getElementById("sciCalcOutput");

  document.getElementById("sciCalcBtn").addEventListener("click", () => {
    try {
      const result = evaluateMathExpression(input.value);
      output.textContent = String(result);
    } catch (error) {
      output.textContent = `计算失败：${error.message || error}`;
    }
  });

  document.getElementById("sciClearBtn").addEventListener("click", () => {
    input.value = "";
    output.textContent = "等待输入...";
  });
}

function renderFunctionPlot(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="plotExprInput">f(x)</label>
      <input id="plotExprInput" type="text" placeholder="例如：sin(x) + x^2 / 10" value="sin(x)" />
    </div>
    <div class="control-grid-two">
      <div class="control-row">
        <label for="plotXMin">X 最小值</label>
        <input id="plotXMin" type="number" value="-10" step="0.5" />
      </div>
      <div class="control-row">
        <label for="plotXMax">X 最大值</label>
        <input id="plotXMax" type="number" value="10" step="0.5" />
      </div>
    </div>
    <div class="tool-actions">
      <button id="plotDrawBtn">绘制图像</button>
      <button id="plotSampleBtn" class="alt">示例：sin(x)</button>
      <button id="plotSampleParabolaBtn" class="alt">示例：x^2</button>
    </div>
    <div class="media-preview-card">
      <canvas id="plotCanvas" width="920" height="360" style="width:100%;height:auto;border-radius:10px;"></canvas>
    </div>
    <pre id="plotOutput" class="result-box">输入函数后点击“绘制图像”。</pre>
  `;

  const exprInput = document.getElementById("plotExprInput");
  const xMinInput = document.getElementById("plotXMin");
  const xMaxInput = document.getElementById("plotXMax");
  const canvas = document.getElementById("plotCanvas");
  const output = document.getElementById("plotOutput");

  const draw = () => {
    const expr = exprInput.value.trim();
    const xMin = Number(xMinInput.value);
    const xMax = Number(xMaxInput.value);
    if (!expr) {
      output.textContent = "请输入函数表达式。";
      return;
    }
    if (!Number.isFinite(xMin) || !Number.isFinite(xMax) || xMin >= xMax) {
      output.textContent = "X 范围无效，请确保最小值小于最大值。";
      return;
    }

    try {
      const stats = drawFunctionPlot(canvas, expr, xMin, xMax);
      output.textContent = `绘制完成：有效采样 ${stats.validPoints} 个，Y 范围 ${stats.yMin.toFixed(4)} ~ ${stats.yMax.toFixed(4)}`;
    } catch (error) {
      output.textContent = `绘制失败：${error.message || error}`;
    }
  };

  document.getElementById("plotDrawBtn").addEventListener("click", draw);
  document.getElementById("plotSampleBtn").addEventListener("click", () => {
    exprInput.value = "sin(x)";
    draw();
  });
  document.getElementById("plotSampleParabolaBtn").addEventListener("click", () => {
    exprInput.value = "x^2";
    draw();
  });

  draw();
}

function renderRandomNumberTool(container) {
  container.innerHTML = `
    <div class="control-grid-two">
      <div class="control-row">
        <label for="randMin">最小值</label>
        <input id="randMin" type="number" value="1" step="1" />
      </div>
      <div class="control-row">
        <label for="randMax">最大值</label>
        <input id="randMax" type="number" value="100" step="1" />
      </div>
    </div>
    <div class="control-grid-two">
      <div class="control-row">
        <label for="randCount">数量</label>
        <input id="randCount" type="number" min="1" max="1000" value="10" />
      </div>
      <div class="control-row">
        <label for="randDecimals">小数位</label>
        <input id="randDecimals" type="number" min="0" max="10" value="0" />
      </div>
    </div>
    <div class="control-row inline-check-row">
      <label class="inline-check"><input id="randUnique" type="checkbox" /> 不重复（仅整数）</label>
    </div>
    <div class="tool-actions">
      <button id="randGenBtn">生成随机数</button>
    </div>
    <pre id="randOutput" class="result-box">等待生成...</pre>
  `;

  const minInput = document.getElementById("randMin");
  const maxInput = document.getElementById("randMax");
  const countInput = document.getElementById("randCount");
  const decimalsInput = document.getElementById("randDecimals");
  const uniqueInput = document.getElementById("randUnique");
  const output = document.getElementById("randOutput");

  document.getElementById("randGenBtn").addEventListener("click", () => {
    const min = Number(minInput.value);
    const max = Number(maxInput.value);
    const count = Number(countInput.value);
    const decimals = Number(decimalsInput.value);
    const unique = uniqueInput.checked;

    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
      output.textContent = "范围无效，请确保最小值 <= 最大值。";
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > 1000) {
      output.textContent = "数量请输入 1 到 1000 的整数。";
      return;
    }
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 10) {
      output.textContent = "小数位请输入 0 到 10 的整数。";
      return;
    }

    try {
      const values = generateRandomNumbers(min, max, count, decimals, unique);
      output.textContent = values.join("\n");
    } catch (error) {
      output.textContent = `生成失败：${error.message || error}`;
    }
  });
}

function renderDnsQuery(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="dnsDomain">目标域名</label>
        <input id="dnsDomain" type="text" placeholder="例如：github.com" />
    </div>
    <div class="tool-actions">
      <button id="doDnsQuery">查询全部 DNS 记录</button>
    </div>
    <div id="dnsOutput">${createEmptyState("输入域名并点击查询，结果将以表格展示全部常见 DNS 记录。")}</div>
  `;

  document.getElementById("doDnsQuery").addEventListener("click", async () => {
    const domain = document.getElementById("dnsDomain").value.trim();
    const output = document.getElementById("dnsOutput");
    if (!domain) {
      output.innerHTML = createEmptyState("请输入有效的域名。");
      return;
    }
    output.innerHTML = createEmptyState("正在查询全部 DNS 记录，请稍候...");
    try {
      const data = await invoke("query_dns", { domain });
      if (data && data.error) {
        output.innerHTML = createEmptyState("解析失败：" + data.error);
        return;
      }

      const records = normalizeArray(data);
      if (!records.length) {
        output.innerHTML = createEmptyState("该域名未返回可用 DNS 记录。");
        return;
      }

      const rows = records
        .map((item) => {
          const val = item.Data || item.IPAddress || item.NameHost || (Array.isArray(item.Strings) ? item.Strings.join(" ") : item.Strings) || "-";
          return `
            <tr>
              <td>${escapeHtml(item.Name || "-")}</td>
              <td>${escapeHtml(item.Type || "-")}</td>
              <td>${escapeHtml(item.TTL === undefined || item.TTL === null ? "-" : String(item.TTL))}</td>
              <td class="command-cell">${escapeHtml(String(val))}</td>
            </tr>
          `;
        })
        .join("");

      output.innerHTML = createSimpleTable(["主机名", "记录类型", "TTL", "记录值"], rows);
    } catch (err) {
      output.innerHTML = createEmptyState("解析出错：" + String(err));
    }
  });
}

function renderIpQuery(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="ipInput">IP 或 域名</label>
      <input id="ipInput" type="text" placeholder="留空默认查询本机外网 IP" style="flex: 2;" />
    </div>
    <div class="tool-actions">
      <button id="doIpQuery">执行查询</button>
    </div>
    <div id="ipOutput">${createEmptyState("输入目标 IP 或直接点击查询")}</div>
  `;

  document.getElementById("doIpQuery").addEventListener("click", async () => {
    const ip = document.getElementById("ipInput").value.trim();
    const output = document.getElementById("ipOutput");
    output.innerHTML = createEmptyState("查询地理位置中...");
    try {
      const data = await invoke("query_ip", { ip });
      if (data.status === "fail") {
        output.innerHTML = createEmptyState("查询失败：" + (data.message || "未知错误"));
        return;
      }
      
      const lines = [
        ["IP 地址", data.query],
        ["国家/地区", data.country],
        ["省份/州", data.regionName],
        ["城市", data.city],
        ["运营商 (ISP)", data.isp],
        ["机构 (Org)", data.org],
        ["ASN 编码", data.as],
        ["经纬度", data.lat ? `${data.lat}, ${data.lon}` : ""],
        ["所在时区", data.timezone]
      ].filter(item => item[1]);

      if (lines.length === 0) {
        output.innerHTML = createEmptyState("未能成功解析到信息，可能被限制访问。");
        return;
      }

      let html = `<div class="kv-grid">`;
      lines.forEach(([k, v]) => {
        html += `<article class="kv-item"><p>${escapeHtml(k)}</p><h5>${escapeHtml(String(v))}</h5></article>`;
      });
      html += `</div>`;
      output.innerHTML = html;

    } catch (err) {
      output.innerHTML = createEmptyState("查询出错：" + String(err));
    }
  });
}

function renderDocumentPanel(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="docFileInput">选择文档</label>
      <input id="docFileInput" type="file" accept=".txt,.md,.json,.csv,.log,.pdf,.html,.xml,.yaml,.yml,text/plain,application/json,application/pdf,text/markdown,text/csv,text/html,application/xml,text/xml" />
    </div>
    <p class="hint">当前提供本地文档信息、文本预览和 PDF 内联预览；暂不包含合并、拆分和格式互转。</p>
    <div id="docPanelOutput">${createEmptyState("请选择一个本地文档，支持 TXT / MD / JSON / CSV / PDF 等常见格式。")}</div>
  `;

  const fileInput = document.getElementById("docFileInput");
  const output = document.getElementById("docPanelOutput");
  let currentObjectUrl = "";

  const resetPreview = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = "";
    }
  };

  fileInput.addEventListener("change", async (event) => {
    resetPreview();
    const file = event.target.files && event.target.files[0];
    if (!file) {
      output.innerHTML = createEmptyState("请选择一个本地文档，支持 TXT / MD / JSON / CSV / PDF 等常见格式。");
      return;
    }

    const metaHtml = createFileMetaGrid(file);
    const extension = getFileExtension(file.name);
    const isPdf = file.type === "application/pdf" || extension === "pdf";
    const isTextLike = isTextPreviewable(file);

    if (isPdf) {
      currentObjectUrl = URL.createObjectURL(file);
      output.innerHTML = `
        ${metaHtml}
        <div class="tool-actions">
          <a class="link-btn" href="${currentObjectUrl}" target="_blank" rel="noreferrer">新窗口打开 PDF</a>
          <a class="link-btn alt" href="${currentObjectUrl}" download="${escapeHtml(file.name)}">下载原文件</a>
        </div>
        <iframe class="doc-preview-frame" src="${currentObjectUrl}" title="PDF 预览"></iframe>
      `;
      return;
    }

    if (isTextLike) {
      try {
        const text = await file.text();
        const preview = text.length > 20000 ? `${text.slice(0, 20000)}\n\n--- 已截断，仅展示前 20000 个字符 ---` : text;
        output.innerHTML = `
          ${metaHtml}
          <h4 class="panel-subtitle">文本预览</h4>
          <pre class="result-box doc-preview-text">${escapeHtml(preview || "文件内容为空")}</pre>
        `;
      } catch (error) {
        renderError(output, `文档读取失败：${error.message || error}`);
      }
      return;
    }

    output.innerHTML = `
      ${metaHtml}
      ${createEmptyState("该文件类型暂不支持内联预览。请先查看文件信息，后续再扩展更多文档能力。")} 
    `;
  });
}

function renderMarkdownTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="markdownFileInput">导入 Markdown 文件</label>
      <input id="markdownFileInput" type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" />
    </div>
    <p class="hint">左侧编辑 Markdown，右侧查看渲染预览，下方自动生成 HTML。支持常见标题、列表、引用、代码块和表格语法。</p>
    <div class="control-row">
      <label for="markdownSourceInput">Markdown 编辑器</label>
      <textarea id="markdownSourceInput" class="markdown-editor-input" placeholder="# Markdown 标题\n\n在这里输入内容，右侧会实时预览。"></textarea>
    </div>
    <div class="tool-actions">
      <button id="markdownExampleBtn" class="alt">填入示例</button>
      <button id="markdownFormatBtn">整理 Markdown</button>
      <button id="markdownClearBtn" class="alt">清空</button>
    </div>
    <div class="markdown-workbench">
      <section class="markdown-pane">
        <div class="markdown-pane-head">
          <h4>预览</h4>
          <p>按当前内容即时渲染</p>
        </div>
        <div id="markdownPreview" class="markdown-preview">${createEmptyState("输入 Markdown 后，这里会显示渲染结果。")}</div>
      </section>
      <section class="markdown-pane">
        <div class="markdown-pane-head">
          <h4>HTML 输出</h4>
          <p>可直接复制到网页或模板中</p>
        </div>
        <div id="markdownHtmlOutput" class="result-box markdown-html-output">等待转换...</div>
      </section>
    </div>
  `;

  const fileInput = document.getElementById("markdownFileInput");
  const sourceInput = document.getElementById("markdownSourceInput");
  const preview = document.getElementById("markdownPreview");
  const htmlOutput = document.getElementById("markdownHtmlOutput");
  let renderToken = 0;

  const renderOutput = async () => {
    const source = sourceInput.value.replace(/\r\n/g, "\n");
    const token = ++renderToken;

    if (!source.trim()) {
      preview.innerHTML = createEmptyState("输入 Markdown 后，这里会显示渲染结果。");
      htmlOutput.innerHTML = "等待转换...";
      return;
    }

    preview.innerHTML = createEmptyState("渲染预览中，请稍候...");
    htmlOutput.innerHTML = "转换 HTML 中，请稍候...";

    try {
      const renderedHtml = await markdownToSafeHtml(source);
      if (token !== renderToken) {
        return;
      }
      preview.innerHTML = `<article class="markdown-rendered">${renderedHtml}</article>`;
      const formattedHtml = formatHtmlBasic(renderedHtml);
      if (token !== renderToken) {
        return;
      }
      await renderHighlightedCode(htmlOutput, formattedHtml, "html");
    } catch (error) {
      if (token !== renderToken) {
        return;
      }
      renderError(preview, `Markdown 渲染失败：${error.message || error}`);
      renderError(htmlOutput, `HTML 转换失败：${error.message || error}`);
    }
  };

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    try {
      sourceInput.value = await file.text();
      await renderOutput();
    } catch (error) {
      renderError(preview, `Markdown 文件读取失败：${error.message || error}`);
      renderError(htmlOutput, `Markdown 文件读取失败：${error.message || error}`);
    }
  });

  sourceInput.addEventListener("input", () => {
    void renderOutput();
  });

  document.getElementById("markdownExampleBtn").addEventListener("click", () => {
    sourceInput.value = `# Markdown 示例\n\n这是一个简洁的编辑区，可以用来整理说明文档。\n\n## 支持内容\n\n- 标题\n- 列表\n- 引用\n- 代码块\n\n> 右侧会实时显示预览。\n\n\`\`\`html\n<section class="card">Hello Markdown</section>\n\`\`\``;
    void renderOutput();
  });

  document.getElementById("markdownFormatBtn").addEventListener("click", async () => {
    const source = sourceInput.value.trim();
    if (!source) {
      preview.innerHTML = createEmptyState("请先输入 Markdown 内容。\n");
      return;
    }
    try {
      sourceInput.value = await formatMarkdownSource(sourceInput.value);
      await renderOutput();
    } catch (error) {
      renderError(preview, `Markdown 整理失败：${error.message || error}`);
    }
  });

  document.getElementById("markdownClearBtn").addEventListener("click", () => {
    sourceInput.value = "";
    void renderOutput();
  });

  void renderOutput();
}

function renderImageInfoTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="imageInfoFileInput">选择图片</label>
      <input id="imageInfoFileInput" type="file" accept="image/*" />
    </div>
    <p class="hint">读取本地图片后展示文件信息、像素尺寸、宽高比和预览，适合快速确认素材参数。</p>
    <div id="imageInfoOutput">${createEmptyState("请选择一张本地图片后查看详细信息。")}</div>
  `;

  const output = document.getElementById("imageInfoOutput");
  const fileInput = document.getElementById("imageInfoFileInput");
  let currentObjectUrl = "";

  const resetPreview = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = "";
    }
  };

  fileInput.addEventListener("change", (event) => {
    resetPreview();
    const file = event.target.files && event.target.files[0];
    if (!file) {
      output.innerHTML = createEmptyState("请选择一张本地图片后查看详细信息。");
      return;
    }

    currentObjectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const orientation = image.naturalWidth === image.naturalHeight
        ? "正方形"
        : image.naturalWidth > image.naturalHeight
          ? "横向"
          : "纵向";

      output.innerHTML = `
        ${createFileMetaGrid(file, [
          { key: "像素尺寸", value: `${image.naturalWidth} x ${image.naturalHeight}` },
          { key: "宽高比", value: formatAspectRatio(image.naturalWidth, image.naturalHeight) },
          { key: "像素数量", value: formatPixelCount(image.naturalWidth, image.naturalHeight) },
          { key: "画面方向", value: orientation },
        ])}
        <div class="image-info-surface">
          <div class="image-info-summary">
            <article class="image-info-chip">
              <span>格式</span>
              <strong>${escapeHtml((file.type || getFileExtension(file.name).toUpperCase() || "未知").replace("image/", ""))}</strong>
            </article>
            <article class="image-info-chip">
              <span>尺寸</span>
              <strong>${escapeHtml(`${image.naturalWidth} x ${image.naturalHeight}`)}</strong>
            </article>
            <article class="image-info-chip">
              <span>体积</span>
              <strong>${escapeHtml(formatBytes(file.size))}</strong>
            </article>
          </div>
          <div class="media-preview-card image-info-preview-card">
            <img class="media-preview-image" src="${currentObjectUrl}" alt="图片信息预览" />
          </div>
        </div>
      `;
    };

    image.onerror = () => {
      renderError(output, "图片加载失败，请更换文件后重试。");
    };
    image.src = currentObjectUrl;
  });
}

function renderImagePanel(container) {
  renderImageResizeTool(container);
}

function renderQrGenerateTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="qrTextInput">文本 / 链接</label>
      <textarea id="qrTextInput" placeholder="输入要生成二维码的文本或 URL"></textarea>
    </div>
    <div class="control-row inline-check-row">
      <label for="qrSizeInput">尺寸</label>
      <input id="qrSizeInput" type="number" min="128" max="1024" step="32" value="320" />
    </div>
    <div class="tool-actions">
      <button id="generateQrBtn">生成二维码</button>
    </div>
    <div id="qrGenerateOutput">${createEmptyState("输入文本后生成二维码。")}</div>
  `;

  const qrTextInput = document.getElementById("qrTextInput");
  const qrSizeInput = document.getElementById("qrSizeInput");
  const qrGenerateOutput = document.getElementById("qrGenerateOutput");
  let currentQrUrl = "";

  const bindSaveToDesktop = () => {
    const saveBtn = document.getElementById("saveQrDesktopBtn");
    if (!saveBtn) {
      return;
    }
    saveBtn.addEventListener("click", async () => {
      if (!currentQrUrl) {
        qrGenerateOutput.innerHTML = createEmptyState("请先生成二维码。\n");
        return;
      }
      try {
        const response = await fetch(currentQrUrl);
        if (!response.ok) {
          throw new Error(`二维码图片下载失败，状态码 ${response.status}`);
        }
        const blob = await response.blob();

        if (isTauriRuntime()) {
          const base64Data = await blobToBase64(blob);
          const fileName = `qrcode-${Date.now()}.png`;
          const savedPath = await invoke("save_png_to_desktop", { fileName, base64Data });
          alert(`已保存到桌面：${savedPath}`);
        } else {
          downloadBlob(blob, `qrcode-${Date.now()}.png`);
          alert("当前为浏览器模式，已改为本地下载。\n");
        }
      } catch (error) {
        alert(`保存失败：${error.message || error}`);
      }
    });
  };

  document.getElementById("generateQrBtn").addEventListener("click", () => {
    const text = qrTextInput.value.trim();
    const size = Number(qrSizeInput.value);
    if (!text) {
      qrGenerateOutput.innerHTML = createEmptyState("请输入要编码的文本或链接。");
      return;
    }
    if (!Number.isFinite(size) || size < 128 || size > 1024) {
      qrGenerateOutput.innerHTML = createEmptyState("尺寸请输入 128 到 1024 之间的数字。");
      return;
    }

    const qrUrl = createQrCodeUrl(text, size);
    currentQrUrl = qrUrl;
    qrGenerateOutput.innerHTML = `
      <div class="media-preview-card">
        <img class="media-preview-image" src="${qrUrl}" alt="二维码预览" />
      </div>
      <div class="tool-actions">
        <button id="saveQrDesktopBtn">保存 PNG 到桌面</button>
      </div>
    `;
    bindSaveToDesktop();
  });
}

function renderQrScanTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="qrScanFileInput">选择二维码图片</label>
      <input id="qrScanFileInput" type="file" accept="image/*" />
    </div>
    <div class="tool-actions">
      <button id="scanQrBtn" class="alt">识别二维码</button>
    </div>
    <div id="qrScanOutput">${createEmptyState("选择包含二维码的图片后点击识别。")}</div>
  `;

  const qrScanOutput = document.getElementById("qrScanOutput");
  const qrScanFileInput = document.getElementById("qrScanFileInput");

  document.getElementById("scanQrBtn").addEventListener("click", async () => {
    const file = qrScanFileInput.files && qrScanFileInput.files[0];
    if (!file) {
      qrScanOutput.innerHTML = createEmptyState("请先选择一张图片。\n支持识别包含二维码的截图或照片。\n");
      return;
    }

    qrScanOutput.innerHTML = createEmptyState("识别中，请稍候...");
    try {
      const result = await decodeQrFromFile(file);
      if (!result.success) {
        qrScanOutput.innerHTML = createEmptyState(result.message);
        return;
      }

      const rows = result.values
        .map(
          (value, index) => `
            <tr>
              <td>${index + 1}</td>
              <td class="command-cell">${escapeHtml(value)}</td>
            </tr>
          `,
        )
        .join("");

      qrScanOutput.innerHTML = createSimpleTable(["序号", "识别结果"], rows);
    } catch (error) {
      qrScanOutput.innerHTML = createEmptyState(`二维码识别失败：${error.message || error}`);
    }
  });
}

function renderImageResizeTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="imageFileInput">选择图片</label>
      <input id="imageFileInput" type="file" accept="image/*" />
    </div>
    <p class="hint">优先保存到原图片所在文件夹；若无法获取路径则自动降级为浏览器下载。</p>
    <div id="imagePanelOutput">${createEmptyState("请选择一张本地图片后再进行预览和导出。")}</div>
  `;

  const output = document.getElementById("imagePanelOutput");
  const fileInput = document.getElementById("imageFileInput");
  let currentObjectUrl = "";

  const resetPreview = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = "";
    }
  };

  fileInput.addEventListener("change", (event) => {
    resetPreview();
    const file = event.target.files && event.target.files[0];
    if (!file) {
      output.innerHTML = createEmptyState("请选择一张本地图片后再进行预览和导出。");
      return;
    }

    currentObjectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const ratio = image.naturalWidth / image.naturalHeight || 1;
      const sourcePath = typeof file.path === "string" ? file.path : "";
      const pathHint = sourcePath ? "当前可保存到原目录。" : "当前无法读取原目录路径，将使用下载保存。";

      output.innerHTML = `
        ${createFileMetaGrid(file, [
          { key: "原始尺寸", value: `${image.naturalWidth} x ${image.naturalHeight}` },
          { key: "保存策略", value: pathHint },
        ])}
        <div class="control-grid-two">
          <div class="control-row">
            <label for="imageWidthInput">导出宽度</label>
            <input id="imageWidthInput" type="number" min="1" value="${image.naturalWidth}" />
          </div>
          <div class="control-row">
            <label for="imageHeightInput">导出高度</label>
            <input id="imageHeightInput" type="number" min="1" value="${image.naturalHeight}" />
          </div>
        </div>
        <div class="control-row inline-check-row">
          <label class="inline-check"><input id="imageLockRatio" type="checkbox" checked /> 保持宽高比</label>
        </div>
        <div class="tool-actions">
          <button id="exportPngBtn">导出 PNG</button>
          <button id="exportJpegBtn" class="alt">导出 JPEG</button>
          <button id="exportWebpBtn" class="alt">导出 WebP</button>
        </div>
        <div class="media-preview-card">
          <img class="media-preview-image" src="${currentObjectUrl}" alt="图片预览" />
        </div>
      `;

      const widthInput = document.getElementById("imageWidthInput");
      const heightInput = document.getElementById("imageHeightInput");
      const lockRatio = document.getElementById("imageLockRatio");

      widthInput.addEventListener("input", () => {
        if (!lockRatio.checked) {
          return;
        }
        const width = Number(widthInput.value);
        if (Number.isFinite(width) && width > 0) {
          heightInput.value = String(Math.max(1, Math.round(width / ratio)));
        }
      });

      heightInput.addEventListener("input", () => {
        if (!lockRatio.checked) {
          return;
        }
        const height = Number(heightInput.value);
        if (Number.isFinite(height) && height > 0) {
          widthInput.value = String(Math.max(1, Math.round(height * ratio)));
        }
      });

      const bindExport = (id, mimeType, extension, quality) => {
        document.getElementById(id).addEventListener("click", () => {
          const targetWidth = Number(widthInput.value);
          const targetHeight = Number(heightInput.value);
          if (!Number.isFinite(targetWidth) || !Number.isFinite(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
            alert("请输入有效的导出宽高。");
            return;
          }
          exportCanvasImage(image, targetWidth, targetHeight, mimeType, extension, file.name, quality, sourcePath);
        });
      };

      bindExport("exportPngBtn", "image/png", "png");
      bindExport("exportJpegBtn", "image/jpeg", "jpg", 0.92);
      bindExport("exportWebpBtn", "image/webp", "webp", 0.92);
    };

    image.onerror = () => {
      renderError(output, "图片加载失败，请更换文件后重试。");
    };
    image.src = currentObjectUrl;
  });
}

function renderImageCompressTool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="imageCompressFileInput">选择图片</label>
      <input id="imageCompressFileInput" type="file" accept="image/*" />
    </div>
    <p class="hint">此工具压缩的是文件体积，不改变图片尺寸。默认导出为 WebP；如需更广兼容性可切换到 JPEG。</p>
    <div id="imageCompressOutput">${createEmptyState("请选择一张本地图片后再进行压缩。")}</div>
  `;

  const output = document.getElementById("imageCompressOutput");
  const fileInput = document.getElementById("imageCompressFileInput");
  let currentObjectUrl = "";

  const resetPreview = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = "";
    }
  };

  fileInput.addEventListener("change", (event) => {
    resetPreview();
    const file = event.target.files && event.target.files[0];
    if (!file) {
      output.innerHTML = createEmptyState("请选择一张本地图片后再进行压缩。");
      return;
    }

    currentObjectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const sourcePath = typeof file.path === "string" ? file.path : "";
      output.innerHTML = `
        ${createFileMetaGrid(file, [
          { key: "原始尺寸", value: `${image.naturalWidth} x ${image.naturalHeight}` },
          { key: "压缩目标", value: "优先减小文件大小" },
        ])}
        <div class="control-grid-two">
          <div class="control-row">
            <label for="imageCompressFormat">导出格式</label>
            <select id="imageCompressFormat">
              <option value="image/webp">WebP（推荐）</option>
              <option value="image/jpeg">JPEG</option>
            </select>
          </div>
          <div class="control-row">
            <label for="imageCompressQuality">质量（0.10 - 1.00）</label>
            <input id="imageCompressQuality" type="number" min="0.1" max="1" step="0.01" value="0.82" />
          </div>
        </div>
        <div class="tool-actions">
          <button id="runImageCompressBtn">开始压缩</button>
        </div>
        <div class="media-preview-card">
          <img class="media-preview-image" src="${currentObjectUrl}" alt="待压缩图片预览" />
        </div>
        <div id="imageCompressResult"></div>
      `;

      const result = document.getElementById("imageCompressResult");
      const formatInput = document.getElementById("imageCompressFormat");
      const qualityInput = document.getElementById("imageCompressQuality");

      document.getElementById("runImageCompressBtn").addEventListener("click", async () => {
        const quality = Number(qualityInput.value);
        if (!Number.isFinite(quality) || quality < 0.1 || quality > 1) {
          result.innerHTML = createEmptyState("质量请输入 0.10 到 1.00 之间的数字。");
          return;
        }

        result.innerHTML = createEmptyState("压缩中，请稍候...");
        try {
          const mimeType = formatInput.value;
          const extension = getExtensionFromMimeType(mimeType);
          const compressedBlob = await renderImageToBlob(
            image,
            image.naturalWidth,
            image.naturalHeight,
            mimeType,
            quality,
            mimeType === "image/jpeg" ? "#ffffff" : "transparent",
          );
          const reduction = calculateReductionRate(file.size, compressedBlob.size);
          const compressedUrl = URL.createObjectURL(compressedBlob);
          const downloadName = `${stripFileExtension(file.name) || "image"}-compressed.${extension}`;

          result.innerHTML = `
            <div class="kv-grid">
              <article class="kv-item"><p>原始大小</p><h5>${escapeHtml(formatBytes(file.size))}</h5></article>
              <article class="kv-item"><p>压缩后大小</p><h5>${escapeHtml(formatBytes(compressedBlob.size))}</h5></article>
              <article class="kv-item"><p>变化比例</p><h5>${escapeHtml(reduction)}</h5></article>
              <article class="kv-item"><p>导出格式</p><h5>${escapeHtml(extension.toUpperCase())}</h5></article>
            </div>
            <div class="tool-actions">
              <button id="saveCompressedImageBtn">导出压缩图</button>
            </div>
            <div class="media-preview-card">
              <img class="media-preview-image" src="${compressedUrl}" alt="压缩结果预览" />
            </div>
          `;

          document.getElementById("saveCompressedImageBtn").addEventListener("click", async () => {
            try {
              await saveBlobWithFallback(compressedBlob, downloadName, sourcePath);
            } catch (error) {
              alert(`导出失败：${error.message || error}`);
            }
          });
        } catch (error) {
          result.innerHTML = createEmptyState(`图片压缩失败：${error.message || error}`);
        }
      });
    };

    image.onerror = () => {
      renderError(output, "图片加载失败，请更换文件后重试。");
    };
    image.src = currentObjectUrl;
  });
}

function renderImageBase64Tool(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="imageToBase64FileInput">图片转 Base64</label>
      <input id="imageToBase64FileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" />
    </div>
    <div class="control-grid-two">
      <div class="control-row">
        <label for="imageBase64OutputMode">输出格式</label>
        <select id="imageBase64OutputMode">
          <option value="raw">仅 Base64</option>
          <option value="data-url">Data URL</option>
        </select>
      </div>
      <div class="control-row">
        <label for="imageBase64Result">转换结果</label>
        <textarea id="imageBase64Result" placeholder="选择图片后点击“转为 Base64”"></textarea>
      </div>
    </div>
    <div class="tool-actions">
      <button id="imageToBase64Btn">转为 Base64</button>
    </div>
    <p class="hint">当前互转流程按 PNG / JPEG / WebP / GIF / BMP 设计；如输入其他图片格式，可能无法正确还原。</p>
    <div class="control-row">
      <label for="base64ToImageInput">Base64 转图片</label>
      <textarea id="base64ToImageInput" placeholder="粘贴 PNG / JPEG / WebP / GIF / BMP 的纯 Base64，或 data:image/...;base64,..."></textarea>
    </div>
    <div class="tool-actions">
      <button id="base64ToImageBtn" class="alt">还原图片</button>
    </div>
    <div id="imageBase64Preview">${createEmptyState("上方可将图片转为 Base64，下方可将 Base64 还原为图片。")}</div>
  `;

  const fileInput = document.getElementById("imageToBase64FileInput");
  const outputMode = document.getElementById("imageBase64OutputMode");
  const resultInput = document.getElementById("imageBase64Result");
  const reverseInput = document.getElementById("base64ToImageInput");
  const preview = document.getElementById("imageBase64Preview");

  document.getElementById("imageToBase64Btn").addEventListener("click", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      preview.innerHTML = createEmptyState("请先选择一张图片。");
      return;
    }

    preview.innerHTML = createEmptyState("转换中，请稍候...");
    try {
      const dataUrl = await blobToDataUrl(file);
      resultInput.value = outputMode.value === "data-url" ? dataUrl : extractBase64Payload(dataUrl);
      preview.innerHTML = `
        ${createFileMetaGrid(file, [{ key: "输出格式", value: outputMode.value === "data-url" ? "Data URL" : "Base64" }])}
        <div class="media-preview-card">
          <img class="media-preview-image" src="${dataUrl}" alt="图片转 Base64 预览" />
        </div>
      `;
    } catch (error) {
      preview.innerHTML = createEmptyState(`图片转 Base64 失败：${error.message || error}`);
    }
  });

  document.getElementById("base64ToImageBtn").addEventListener("click", async () => {
    preview.innerHTML = createEmptyState("还原中，请稍候...");
    try {
      const parsed = parseImageBase64Input(reverseInput.value);
      const blob = new Blob([parsed.bytes], { type: parsed.mimeType });
      const imageUrl = URL.createObjectURL(blob);
      const fileName = `base64-image.${parsed.extension}`;

      preview.innerHTML = `
        <div class="kv-grid">
          <article class="kv-item"><p>识别格式</p><h5>${escapeHtml(parsed.mimeType)}</h5></article>
          <article class="kv-item"><p>图片大小</p><h5>${escapeHtml(formatBytes(blob.size))}</h5></article>
        </div>
        <div class="tool-actions">
          <button id="downloadBase64ImageBtn">下载图片</button>
        </div>
        <div class="media-preview-card">
          <img class="media-preview-image" src="${imageUrl}" alt="Base64 还原结果" />
        </div>
      `;

      document.getElementById("downloadBase64ImageBtn").addEventListener("click", () => {
        downloadBlob(blob, fileName);
      });
    } catch (error) {
      preview.innerHTML = createEmptyState(`Base64 转图片失败：${error.message || error}`);
    }
  });
}

function renderVideoPanel(container) {
  container.innerHTML = `
    <div class="control-row">
      <label for="videoFileInput">选择视频</label>
      <input id="videoFileInput" type="file" accept="video/*" />
    </div>
    <p class="hint">当前提供本地视频预览、时长/分辨率信息和当前画面截帧；暂不包含转码、压缩和队列能力。</p>
    <div id="videoPanelOutput">${createEmptyState("请选择一个本地视频文件后再进行预览和封面截帧。")}</div>
  `;

  const output = document.getElementById("videoPanelOutput");
  const fileInput = document.getElementById("videoFileInput");
  let currentObjectUrl = "";

  const resetPreview = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = "";
    }
  };

  fileInput.addEventListener("change", (event) => {
    resetPreview();
    const file = event.target.files && event.target.files[0];
    if (!file) {
      output.innerHTML = createEmptyState("请选择一个本地视频文件后再进行预览和封面截帧。");
      return;
    }

    currentObjectUrl = URL.createObjectURL(file);
    output.innerHTML = `
      ${createFileMetaGrid(file)}
      <div class="tool-actions">
        <button id="capturePosterBtn">截取当前画面</button>
      </div>
      <div class="media-preview-card">
        <video id="videoPreview" class="media-preview-video" src="${currentObjectUrl}" controls preload="metadata"></video>
      </div>
      <div id="videoPosterOutput"></div>
    `;

    const video = document.getElementById("videoPreview");
    const posterOutput = document.getElementById("videoPosterOutput");

    video.addEventListener("loadedmetadata", () => {
      output.innerHTML = `
        ${createFileMetaGrid(file, [
          { key: "时长", value: formatDuration(video.duration) },
          { key: "分辨率", value: `${video.videoWidth} x ${video.videoHeight}` },
        ])}
        <div class="tool-actions">
          <button id="capturePosterBtn">截取当前画面</button>
        </div>
        <div class="media-preview-card">
          <video id="videoPreview" class="media-preview-video" src="${currentObjectUrl}" controls preload="metadata"></video>
        </div>
        <div id="videoPosterOutput"></div>
      `;

      const nextVideo = document.getElementById("videoPreview");
      const nextPosterOutput = document.getElementById("videoPosterOutput");
      bindVideoPosterCapture(nextVideo, nextPosterOutput, file.name);
    }, { once: true });

    video.addEventListener("error", () => {
      renderError(output, "视频加载失败，请更换文件后重试。");
    }, { once: true });

    bindVideoPosterCapture(video, posterOutput, file.name);
  });
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === "object") {
    return [value];
  }
  return [];
}

function formatWmiDate(value) {
  if (!value || typeof value !== "string") {
    return "未知";
  }
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (!match) {
    return value;
  }
  return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6]}`;
}

function formatBytes(num) {
  if (!Number.isFinite(num) || num <= 0) {
    return "-";
  }
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = num;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 100 ? 0 : 2)} ${units[unit]}`;
}

function formatResolution(width, height, refreshRate) {
  const w = Number(width);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return "-";
  }
  if (refreshRate !== undefined && refreshRate !== null && String(refreshRate).trim() !== "") {
    return `${w}x${h} @ ${refreshRate}Hz`;
  }
  return `${w}x${h}`;
}

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function evaluateMathExpression(rawExpr, scope = {}) {
  const expr = String(rawExpr || "").trim();
  if (!expr) {
    throw new Error("表达式为空。");
  }

  const safePattern = /^[0-9A-Za-z_+\-*/%^().,\s]+$/;
  if (!safePattern.test(expr)) {
    throw new Error("表达式包含不支持的字符。\n仅允许数字、运算符、字母函数名与括号。");
  }

  let normalized = expr
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\b(sin|cos|tan|asin|acos|atan|sqrt|abs|floor|ceil|round|exp|pow|log10|max|min)\b/g, "Math.$1")
    .replace(/\blog\b/g, "Math.log");

  normalized = normalized.replace(/\bx\b/g, "__x");

  const fn = new Function("__x", `return (${normalized});`);
  const result = fn(scope.x);
  if (!Number.isFinite(result)) {
    throw new Error("结果不是有限数值，请检查表达式或定义域。");
  }
  return result;
}

function drawFunctionPlot(canvas, expr, xMin, xMax) {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("当前环境不支持 Canvas 绘图。");
  }

  const width = canvas.width;
  const height = canvas.height;
  const sampleCount = Math.max(300, Math.floor(width));
  const points = [];

  let yMin = Infinity;
  let yMax = -Infinity;

  for (let i = 0; i <= sampleCount; i += 1) {
    const t = i / sampleCount;
    const x = xMin + (xMax - xMin) * t;
    try {
      const y = evaluateMathExpression(expr, { x });
      if (Number.isFinite(y)) {
        points.push({ x, y });
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      }
    } catch (_) {
      // ignore undefined points in the domain
    }
  }

  if (!points.length) {
    throw new Error("没有可绘制的数据点，请调整表达式或 X 范围。");
  }

  if (yMin === yMax) {
    yMin -= 1;
    yMax += 1;
  }

  const pad = 28;
  const plotWidth = width - pad * 2;
  const plotHeight = height - pad * 2;

  const toPxX = (x) => pad + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toPxY = (y) => pad + ((yMax - y) / (yMax - yMin)) * plotHeight;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "#dbe5de";
  context.lineWidth = 1;
  context.strokeRect(pad, pad, plotWidth, plotHeight);

  const drawAxisX = yMin <= 0 && yMax >= 0;
  const drawAxisY = xMin <= 0 && xMax >= 0;

  context.strokeStyle = "#88a198";
  context.lineWidth = 1.1;
  if (drawAxisX) {
    const axisY = toPxY(0);
    context.beginPath();
    context.moveTo(pad, axisY);
    context.lineTo(width - pad, axisY);
    context.stroke();
  }
  if (drawAxisY) {
    const axisX = toPxX(0);
    context.beginPath();
    context.moveTo(axisX, pad);
    context.lineTo(axisX, height - pad);
    context.stroke();
  }

  context.strokeStyle = "#0c7a5a";
  context.lineWidth = 2;
  context.beginPath();
  points.forEach((point, index) => {
    const px = toPxX(point.x);
    const py = toPxY(point.y);
    if (index === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  });
  context.stroke();

  context.fillStyle = "#34453e";
  context.font = '12px "Segoe UI", sans-serif';
  context.fillText(`x: [${xMin}, ${xMax}]`, pad + 4, height - 8);
  context.fillText(`y: [${yMin.toFixed(3)}, ${yMax.toFixed(3)}]`, width - pad - 220, height - 8);

  return { yMin, yMax, validPoints: points.length };
}

function generateRandomNumbers(min, max, count, decimals, unique) {
  if (unique && decimals !== 0) {
    throw new Error("不重复模式仅支持整数。请将小数位设置为 0。\n");
  }

  if (unique) {
    const intMin = Math.ceil(min);
    const intMax = Math.floor(max);
    const rangeSize = intMax - intMin + 1;
    if (rangeSize < count) {
      throw new Error("当前整数区间数量不足，无法生成不重复结果。\n");
    }
    const pool = [];
    for (let n = intMin; n <= intMax; n += 1) {
      pool.push(n);
    }
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = randomInt(i + 1);
      const temp = pool[i];
      pool[i] = pool[j];
      pool[j] = temp;
    }
    return pool.slice(0, count).map((value) => String(value));
  }

  const factor = 10 ** decimals;
  const output = [];
  for (let i = 0; i < count; i += 1) {
    const raw = min + (max - min) * Math.random();
    const rounded = Math.round(raw * factor) / factor;
    output.push(decimals > 0 ? rounded.toFixed(decimals) : String(Math.round(rounded)));
  }
  return output;
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToUtf8(encoded) {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

let prettierRuntimePromise = null;
let highlightRuntimePromise = null;
let markedRuntimePromise = null;

async function formatCodeByLanguage(source, language, pretty) {
  const prettierTarget = getPrettierTarget(language);

  if (prettierTarget) {
    try {
      const { prettier, plugins } = await ensurePrettierRuntime();
      if (pretty) {
        return await prettier.format(source, {
          parser: prettierTarget.parser,
          plugins,
          printWidth: 100,
          tabWidth: 2,
        });
      }
      return await prettier.format(source, {
        parser: prettierTarget.parser,
        plugins,
        printWidth: 999999,
        tabWidth: 2,
      });
    } catch (_) {
      // Fallback to basic formatter when Prettier runtime or parser is unavailable.
    }
  }

  if (!pretty) {
    return source
      .replace(/\s+/g, " ")
      .replace(/\s*([{}();,:])\s*/g, "$1")
      .trim();
  }

  if (language === "html") {
    return formatHtmlBasic(source);
  }

  if (["javascript", "c", "cpp", "csharp", "java", "css"].includes(language)) {
    return formatBraceLanguageBasic(source);
  }

  return source;
}

function getPrettierTarget(language) {
  const map = {
    javascript: { parser: "babel" },
    json: { parser: "json" },
    css: { parser: "css" },
    html: { parser: "html" },
    java: { parser: "java" },
  };
  return map[language] || null;
}

async function ensurePrettierRuntime() {
  if (prettierRuntimePromise) {
    return prettierRuntimePromise;
  }

  prettierRuntimePromise = (async () => {
    await loadScript("https://unpkg.com/prettier@3.3.3/standalone.js");
    await Promise.all([
      loadScript("https://unpkg.com/prettier@3.3.3/plugins/babel.js"),
      loadScript("https://unpkg.com/prettier@3.3.3/plugins/estree.js"),
      loadScript("https://unpkg.com/prettier@3.3.3/plugins/postcss.js"),
      loadScript("https://unpkg.com/prettier@3.3.3/plugins/html.js"),
      loadScript("https://unpkg.com/prettier@3.3.3/plugins/markdown.js"),
      loadScript("https://unpkg.com/prettier@3.3.3/plugins/yaml.js"),
      loadScript("https://unpkg.com/prettier-plugin-java@2.5.0/dist/index.js"),
    ]);

    const prettier = window.prettier;
    const plugins = [];
    if (window.prettierPlugins) {
      Object.keys(window.prettierPlugins).forEach((key) => {
        const plugin = window.prettierPlugins[key];
        if (plugin) {
          plugins.push(plugin);
        }
      });
    }

    if (!prettier || !plugins.length) {
      throw new Error("Prettier 运行时加载失败");
    }

    return { prettier, plugins };
  })();

  return prettierRuntimePromise;
}

async function ensureHighlightRuntime() {
  if (highlightRuntimePromise) {
    return highlightRuntimePromise;
  }

  highlightRuntimePromise = (async () => {
    ensureStylesheet("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css", "hljs-style");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js");
    return window.hljs || null;
  })();

  return highlightRuntimePromise;
}

async function ensureMarkedRuntime() {
  if (markedRuntimePromise) {
    return markedRuntimePromise;
  }

  markedRuntimePromise = (async () => {
    await loadScript("https://cdn.jsdelivr.net/npm/marked/marked.min.js");
    const marked = window.marked;
    if (!marked || typeof marked.parse !== "function") {
      throw new Error("Markdown 运行时加载失败");
    }
    return marked;
  })();

  return markedRuntimePromise;
}

async function renderHighlightedCode(container, code, language) {
  const className = getHighlightClass(language);
  const escaped = escapeHtml(code);

  try {
    const hljs = await ensureHighlightRuntime();
    if (hljs) {
      let result;
      if (className) {
        result = hljs.highlight(code, { language: className });
      } else {
        result = hljs.highlightAuto(code);
      }
      container.innerHTML = `<pre class="result-code"><code class="hljs ${className ? `language-${className}` : ""}">${result.value}</code></pre>`;
      return;
    }
  } catch (_) {
    // Fallback to plain escaped output.
  }

  container.innerHTML = `<pre class="result-code"><code>${escaped}</code></pre>`;
}

function getHighlightClass(language) {
  const map = {
    javascript: "javascript",
    json: "json",
    css: "css",
    html: "xml",
    java: "java",
    c: "c",
    cpp: "cpp",
    csharp: "csharp",
  };
  return map[language] || "";
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const existing = Array.from(document.querySelectorAll("script[data-dynamic]")).find((node) => node.src === url);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`脚本加载失败: ${url}`)), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.dataset.dynamic = "true";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`脚本加载失败: ${url}`)), { once: true });
    document.head.appendChild(script);
  });
}

function ensureStylesheet(href, id) {
  if (document.getElementById(id)) {
    return;
  }
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function formatBraceLanguageBasic(source) {
  const lines = source
    .replace(/\r\n/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\s*\{\s*/g, " {\n")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/\s*;\s*/g, ";\n")
    .replace(/\n{2,}/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let level = 0;
  const output = [];
  lines.forEach((line) => {
    if (line.startsWith("}")) {
      level = Math.max(0, level - 1);
    }
    output.push(`${"  ".repeat(level)}${line}`);
    const openCount = (line.match(/\{/g) || []).length;
    const closeCount = (line.match(/\}/g) || []).length;
    level = Math.max(0, level + openCount - closeCount);
  });
  return output.join("\n");
}

function formatHtmlBasic(source) {
  const tokens = source
    .replace(/\r\n/g, "\n")
    .replace(/>\s+</g, "><")
    .split(/(<[^>]+>)/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  let level = 0;
  const output = [];

  tokens.forEach((token) => {
    const isTag = token.startsWith("<") && token.endsWith(">") && !token.startsWith("<!--");
    const isClosingTag = isTag && /^<\//.test(token);
    const isSelfClosingTag = isTag && /\/>$/.test(token);
    const isDoctype = isTag && /^<!doctype/i.test(token);

    if (isClosingTag) {
      level = Math.max(0, level - 1);
    }

    output.push(`${"  ".repeat(level)}${token}`);

    if (isTag && !isClosingTag && !isSelfClosingTag && !isDoctype && !/^<!(--|\[CDATA\[)/.test(token)) {
      level += 1;
    }
  });

  return output.join("\n");
}

function createQrCodeUrl(text, size) {
  const safeSize = Math.max(128, Math.min(1024, Number(size) || 320));
  return `https://api.qrserver.com/v1/create-qr-code/?size=${safeSize}x${safeSize}&data=${encodeURIComponent(text)}`;
}

async function decodeQrFromFile(file) {
  if (!("BarcodeDetector" in window)) {
    return { success: false, message: "当前环境不支持二维码识别（BarcodeDetector 不可用）。请升级 WebView2 后重试。" };
  }

  let supported = ["qr_code"];
  if (typeof window.BarcodeDetector.getSupportedFormats === "function") {
    supported = await window.BarcodeDetector.getSupportedFormats();
    if (!supported.includes("qr_code")) {
      return { success: false, message: "当前环境不支持 qr_code 识别格式。" };
    }
  }

  const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
  const bitmap = await createImageBitmap(file);
  try {
    const barcodes = await detector.detect(bitmap);
    const values = barcodes.map((item) => item.rawValue).filter((value) => Boolean(value));
    if (!values.length) {
      return { success: false, message: "未识别到二维码内容，请尝试更清晰的图片。" };
    }
    return { success: true, values };
  } finally {
    if (bitmap && typeof bitmap.close === "function") {
      bitmap.close();
    }
  }
}

async function deriveAesKey(password, salt) {
  const passwordBytes = new TextEncoder().encode(password);
  const keyMaterial = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

async function aesEncryptText(plainText, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(password, salt);
  const plainBytes = new TextEncoder().encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plainBytes);
  const payload = concatBytes(salt, iv, new Uint8Array(cipherBuffer));
  return bytesToBase64(payload);
}

async function aesDecryptText(cipherBase64, password) {
  const payload = base64ToBytes(cipherBase64);
  if (payload.length <= 28) {
    throw new Error("密文格式无效。");
  }
  const salt = payload.slice(0, 16);
  const iv = payload.slice(16, 28);
  const cipherBytes = payload.slice(28);
  const key = await deriveAesKey(password, salt);
  const plainBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherBytes);
  return new TextDecoder().decode(plainBuffer);
}

async function generateRsaKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );
  const publicKeySpki = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKeyPkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  return {
    publicKeyBase64: bytesToBase64(new Uint8Array(publicKeySpki)),
    privateKeyBase64: bytesToBase64(new Uint8Array(privateKeyPkcs8)),
  };
}

async function rsaEncryptText(plainText, publicKeyBase64) {
  if (!publicKeyBase64) {
    throw new Error("请先提供公钥。\n可点击“生成 RSA 密钥对”。");
  }
  const publicKey = await crypto.subtle.importKey(
    "spki",
    base64ToBytes(publicKeyBase64),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );
  const plainBytes = new TextEncoder().encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, plainBytes);
  return bytesToBase64(new Uint8Array(cipherBuffer));
}

async function rsaDecryptText(cipherBase64, privateKeyBase64) {
  if (!privateKeyBase64) {
    throw new Error("请先提供私钥。\n可点击“生成 RSA 密钥对”。");
  }
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    base64ToBytes(privateKeyBase64),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"],
  );
  const cipherBytes = base64ToBytes(cipherBase64);
  const plainBuffer = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, cipherBytes);
  return new TextDecoder().decode(plainBuffer);
}

function generatePassword(length, options) {
  const pool = [];
  if (options.upper) {
    pool.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
  }
  if (options.lower) {
    pool.push("abcdefghijkmnopqrstuvwxyz");
  }
  if (options.number) {
    pool.push("23456789");
  }
  if (options.symbol) {
    pool.push("!@#$%^&*()_+-=[]{};:,.?/");
  }

  if (!pool.length) {
    throw new Error("请至少选择一种字符类型。\n");
  }

  const all = pool.join("");
  const result = [];
  for (let i = 0; i < length; i += 1) {
    const idx = randomInt(all.length);
    result.push(all[idx]);
  }
  return result.join("");
}

function randomInt(max) {
  const values = crypto.getRandomValues(new Uint32Array(1));
  return values[0] % max;
}

function toHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function concatBytes(...arrays) {
  const total = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  arrays.forEach((arr) => {
    output.set(arr, offset);
    offset += arr.length;
  });
  return output;
}

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function createFileMetaGrid(file, extraItems = []) {
  const items = [
    { key: "文件名", value: file.name || "-" },
    { key: "文件类型", value: file.type || getFileExtension(file.name).toUpperCase() || "未知" },
    { key: "文件大小", value: formatBytes(file.size) },
    { key: "修改时间", value: file.lastModified ? formatDateTime(new Date(file.lastModified)) : "未知" },
    ...extraItems,
  ];

  return `
    <div class="kv-grid">
      ${items
        .map(
          (item) => `
        <article class="kv-item">
          <p>${escapeHtml(item.key)}</p>
          <h5>${escapeHtml(item.value)}</h5>
        </article>
      `,
        )
        .join("")}
    </div>
  `;
}

function formatAspectRatio(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "未知";
  }
  const divisor = greatestCommonDivisor(width, height);
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
}

function greatestCommonDivisor(a, b) {
  let left = Math.abs(Math.round(a));
  let right = Math.abs(Math.round(b));
  while (right) {
    const temp = right;
    right = left % right;
    left = temp;
  }
  return left || 1;
}

function formatPixelCount(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "未知";
  }
  const total = width * height;
  if (total >= 1000000) {
    return `${(total / 1000000).toFixed(2)} MP`;
  }
  return `${total.toLocaleString("zh-CN")} px`;
}

function getFileExtension(fileName) {
  const parts = String(fileName || "").split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function getExtensionFromMimeType(mimeType) {
  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
  };
  return map[mimeType] || "png";
}

function isTextPreviewable(file) {
  const extension = getFileExtension(file.name);
  const textExtensions = ["txt", "md", "json", "csv", "log", "html", "xml", "yaml", "yml"];
  return file.type.startsWith("text/") || file.type === "application/json" || textExtensions.includes(extension);
}

async function formatMarkdownSource(source) {
  return String(source || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function markdownToSafeHtml(source) {
  const marked = await ensureMarkedRuntime();
  const rawHtml = marked.parse(String(source || ""), {
    breaks: true,
    gfm: true,
  });
  return sanitizeHtmlFragment(rawHtml);
}

function sanitizeHtmlFragment(html) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(`<div>${String(html || "")}</div>`, "text/html");
  const root = documentNode.body.firstElementChild;
  if (!root) {
    return "";
  }
  sanitizeElementNode(root);
  return root.innerHTML;
}

function sanitizeElementNode(root) {
  const allowedTags = new Set([
    "a",
    "article",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul",
  ]);
  const blockedTags = new Set(["script", "style", "iframe", "object", "embed", "link", "meta"]);
  const elements = Array.from(root.querySelectorAll("*"));

  elements.forEach((node) => {
    const tag = node.tagName.toLowerCase();

    if (blockedTags.has(tag)) {
      node.remove();
      return;
    }

    if (!allowedTags.has(tag)) {
      node.replaceWith(...Array.from(node.childNodes));
      return;
    }

    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (name.startsWith("on") || name === "style") {
        node.removeAttribute(attr.name);
        return;
      }

      if (tag === "a") {
        if (!["href", "title"].includes(name)) {
          node.removeAttribute(attr.name);
          return;
        }
        if (name === "href" && !isSafeUrl(value, ["http:", "https:", "mailto:", "tel:", "#"])) {
          node.removeAttribute(attr.name);
          return;
        }
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noreferrer noopener nofollow");
        return;
      }

      if (tag === "img") {
        if (!["src", "alt", "title"].includes(name)) {
          node.removeAttribute(attr.name);
          return;
        }
        if (name === "src" && !isSafeUrl(value, ["http:", "https:", "data:"])) {
          node.removeAttribute(attr.name);
        }
        return;
      }

      node.removeAttribute(attr.name);
    });
  });
}

function isSafeUrl(value, allowedProtocols) {
  if (!value) {
    return false;
  }
  if (value.startsWith("#") && allowedProtocols.includes("#")) {
    return true;
  }
  try {
    const parsed = new URL(value, window.location.href);
    return allowedProtocols.includes(parsed.protocol);
  } catch (_) {
    return false;
  }
}

function renderImageToBlob(image, width, height, mimeType, quality, backgroundColor = "transparent") {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      reject(new Error("当前环境不支持 Canvas 导出。"));
      return;
    }

    if (backgroundColor && backgroundColor !== "transparent") {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("图片导出失败，请稍后重试。"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

async function saveBlobWithFallback(blob, fileName, sourcePath = "") {
  if (sourcePath && isTauriRuntime()) {
    try {
      const base64Data = await blobToBase64(blob);
      const savedPath = await invoke("save_image_to_source_dir", {
        sourcePath,
        fileName,
        base64Data,
      });
      alert(`导出成功：${savedPath}`);
      return;
    } catch (error) {
      alert(`保存到原目录失败，已切换下载保存：${error.message || error}`);
    }
  }

  downloadBlob(blob, fileName);
}

function calculateReductionRate(originalSize, newSize) {
  if (!Number.isFinite(originalSize) || originalSize <= 0 || !Number.isFinite(newSize) || newSize <= 0) {
    return "-";
  }
  const delta = ((newSize - originalSize) / originalSize) * 100;
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("读取图片失败。"));
    reader.readAsDataURL(blob);
  });
}

function extractBase64Payload(value) {
  return String(value || "")
    .trim()
    .replace(/^data:[^;]+;base64,/, "")
    .replace(/\s+/g, "");
}

function parseImageBase64Input(value) {
  const rawInput = String(value || "").trim();
  if (!rawInput) {
    throw new Error("请输入 Base64 内容。");
  }

  const dataUrlMatch = rawInput.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  const mimeType = dataUrlMatch ? dataUrlMatch[1].toLowerCase() : "";
  const payload = extractBase64Payload(rawInput);
  let bytes;
  try {
    bytes = base64ToBytes(payload);
  } catch (error) {
    throw new Error(`Base64 解析失败：${error.message || error}`);
  }

  const detectedMimeType = mimeType || detectImageMimeType(bytes);
  if (!detectedMimeType) {
    throw new Error("未识别到图片格式。请粘贴图片 Base64 或 data URL。");
  }

  return {
    bytes,
    mimeType: detectedMimeType,
    extension: getExtensionFromMimeType(detectedMimeType),
  };
}

function detectImageMimeType(bytes) {
  if (!bytes || bytes.length < 4) {
    return "";
  }

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return "image/gif";
  }
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return "image/bmp";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return "";
}

function exportCanvasImage(image, width, height, mimeType, extension, originalName, quality, sourcePath = "") {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    alert("当前环境不支持 Canvas 导出。");
    return;
  }
  context.drawImage(image, 0, 0, width, height);
  const downloadName = `${stripFileExtension(originalName) || "image"}-${width}x${height}.${extension}`;
  canvas.toBlob(
    async (blob) => {
      if (!blob) {
        alert("图片导出失败，请稍后重试。");
        return;
      }

      if (sourcePath && isTauriRuntime()) {
        try {
          const base64Data = await blobToBase64(blob);
          const savedPath = await invoke("save_image_to_source_dir", {
            sourcePath,
            fileName: downloadName,
            base64Data,
          });
          alert(`导出成功：${savedPath}`);
          return;
        } catch (error) {
          alert(`保存到原目录失败，已切换下载保存：${error.message || error}`);
        }
      }

      downloadBlob(blob, downloadName);
    },
    mimeType,
    quality,
  );
}

async function blobToBase64(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return bytesToBase64(new Uint8Array(arrayBuffer));
}

function bindVideoPosterCapture(video, output, fileName) {
  const button = document.getElementById("capturePosterBtn");
  if (!button || !video || !output) {
    return;
  }

  button.addEventListener("click", () => {
    if (!video.videoWidth || !video.videoHeight) {
      output.innerHTML = createEmptyState("请等待视频元数据加载完成后再截取画面。");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      output.innerHTML = createEmptyState("当前环境不支持视频截帧。");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    output.innerHTML = `
      <h4 class="panel-subtitle">截帧结果</h4>
      <div class="media-preview-card">
        <img class="media-preview-image" src="${dataUrl}" alt="视频截帧结果" />
      </div>
      <div class="tool-actions">
        <button id="downloadPosterBtn" class="alt">下载 PNG</button>
      </div>
    `;

    document.getElementById("downloadPosterBtn").addEventListener("click", () => {
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("截帧导出失败，请稍后重试。");
          return;
        }
        downloadBlob(blob, `${stripFileExtension(fileName) || "video"}-poster.png`);
      }, "image/png");
    });
  });
}

function downloadBlob(blob, fileName) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 0);
}

function stripFileExtension(fileName) {
  return String(fileName || "").replace(/\.[^.]+$/, "");
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "未知";
  }
  const totalSeconds = Math.round(seconds);
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;
  if (hour > 0) {
    return `${hour}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  }
  return `${minute}:${String(second).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
