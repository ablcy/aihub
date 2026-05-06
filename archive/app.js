// ===== AI 工具数据 =====
const aiTools = [
  // --- AI 对话 ---
  { name: "ChatGPT", icon: "🤖", origin: "OpenAI", category: "chat", free: "partial", tags: ["对话", "写作", "编程"], desc: "全球最流行的AI对话助手，支持GPT-4o多模态交互，强大的推理和创作能力", url: "https://chat.openai.com", featured: false },
  { name: "智谱清言", icon: "🧠", origin: "智谱AI", category: "chat", free: "full", tags: ["对话", "写作", "编程"], desc: "智谱AI出品，基于GLM模型，中文理解能力极强，支持长文档分析和智能体", url: "https://chatglm.cn", featured: true },
  { name: "Kimi", icon: "🌙", origin: "月之暗面", category: "chat", free: "full", tags: ["对话", "文档", "搜索"], desc: "支持200万字超长上下文，文件分析能力突出，内置联网搜索", url: "https://kimi.moonshot.cn", featured: true },
  { name: "豆包", icon: "🫘", origin: "字节跳动", category: "chat", free: "full", tags: ["对话", "绘画", "音乐"], desc: "AI对话+绘画+音乐创作一体化平台，功能丰富完全免费", url: "https://www.doubao.com", featured: true },
  { name: "通义千问", icon: "💬", origin: "阿里云", category: "chat", free: "full", tags: ["对话", "写作", "编程"], desc: "阿里云通义大模型，支持文本、图像、音频多模态，代码能力优秀", url: "https://tongyi.aliyun.com", featured: false },
  { name: "文心一言", icon: "✨", origin: "百度", category: "chat", free: "full", tags: ["对话", "写作", "绘画"], desc: "百度文心大模型，中文理解深度优化，支持AI绘画和代码生成", url: "https://yiyan.baidu.com", featured: false },
  { name: "DeepSeek", icon: "🔮", origin: "DeepSeek", category: "chat", free: "full", tags: ["对话", "编程", "推理"], desc: "开源大模型新势力，R1推理模型数学编程能力极强，免费使用", url: "https://chat.deepseek.com", featured: false },
  { name: "Gemini", icon: "💎", origin: "Google", category: "chat", free: "partial", tags: ["对话", "搜索", "多模态"], desc: "Google最新多模态AI，深度整合搜索，支持文本图像视频理解", url: "https://gemini.google.com", featured: false },
  { name: "Claude", icon: "🧙", origin: "Anthropic", category: "chat", free: "partial", tags: ["对话", "写作", "编程"], desc: "以安全性和长文本理解著称，200K上下文窗口，适合深度分析", url: "https://claude.ai", featured: false },
  { name: "腾讯元宝", icon: "🅰️", origin: "腾讯", category: "chat", free: "full", tags: ["对话", "写作", "搜索"], desc: "腾讯混元大模型，支持AI搜索和文档解析，整合微信生态", url: "https://yuanbao.tencent.com", featured: false },
  { name: "讯飞星火", icon: "⭐", origin: "科大讯飞", category: "chat", free: "partial", tags: ["对话", "写作", "语音"], desc: "科大讯飞出品，语音交互能力出色，支持多轮对话和文档解析", url: "https://xinghuo.xfyun.cn", featured: false },
  { name: "零一万物", icon: "01", origin: "零一万物", category: "chat", free: "full", tags: ["对话", "搜索", "写作"], desc: "李开复创办，Yi系列开源模型，免费体验高质量AI对话", url: "https://www.lingyiwanwu.com", featured: false },

  // --- AI 绘画 ---
  { name: "Midjourney", icon: "🎨", origin: "Midjourney", category: "image", free: "partial", tags: ["绘画", "设计", "创意"], desc: "顶级AI绘画工具，艺术风格表现力极强，Discord内使用", url: "https://www.midjourney.com", featured: false },
  { name: "通义万相", icon: "🖼️", origin: "阿里云", category: "image", free: "full", tags: ["绘画", "设计", "创意"], desc: "阿里云AI绘画平台，支持文生图、图生图、涂鸦生图，免费额度充足", url: "https://tongyi.aliyun.com/wanxiang", featured: false },
  { name: "LiblibAI", icon: "🎭", origin: "LiblibAI", category: "image", free: "full", tags: ["绘画", "设计", "模型"], desc: "国内最大的AI绘画模型社区，海量Stable Diffusion模型免费使用", url: "https://www.liblib.art", featured: false },
  { name: "即梦AI", icon: "💭", origin: "字节跳动", category: "image", free: "full", tags: ["绘画", "设计", "创意"], desc: "字节跳动AI绘画工具，操作简单，支持多种画风，完全免费", url: "https://jimeng.jianying.com", featured: false },
  { name: "Ideogram", icon: "🔤", origin: "Ideogram", category: "image", free: "partial", tags: ["绘画", "文字", "设计"], desc: "文字渲染能力最强的AI绘画工具，海报和Logo设计首选", url: "https://ideogram.ai", featured: false },
  { name: "Leonardo AI", icon: "🗡️", origin: "Leonardo", category: "image", free: "partial", tags: ["绘画", "游戏", "设计"], desc: "游戏素材和概念设计专用，每日免费150tokens，质量极高", url: "https://leonardo.ai", featured: false },
  { name: "Bing Image Creator", icon: "🪟", origin: "Microsoft", category: "image", free: "full", tags: ["绘画", "创意", "DALL·E"], desc: "基于DALL·E 3的免费AI绘画工具，通过微软账号即可使用", url: "https://www.bing.com/create", featured: false },
  { name: "可灵AI", icon: "🎭", origin: "快手", category: "image", free: "full", tags: ["绘画", "设计", "创意"], desc: "快手旗下AI创作平台，支持图像生成和视频生成，免费使用", url: "https://klingai.kuaishou.com", featured: false },

  // --- AI 写作 ---
  { name: "Notion AI", icon: "📝", origin: "Notion", category: "writing", free: "partial", tags: ["写作", "笔记", "效率"], desc: "集成在Notion中的AI写作助手，会议纪要、大纲、翻译一站搞定", url: "https://www.notion.so", featured: false },
  { name: "秘塔写作猫", icon: "🐱", origin: "秘塔科技", category: "writing", free: "full", tags: ["写作", "校对", "翻译"], desc: "专业中文写作助手，支持智能校对、改写润色、多语言翻译", url: "https://xiezuocat.com", featured: false },
  { name: "笔灵AI", icon: "✏️", origin: "笔灵AI", category: "writing", free: "full", tags: ["写作", "文档", "模板"], desc: "专注AI文档写作，提供海量模板，支持报告、方案、总结自动生成", url: "https://ibiling.cn", featured: false },
  { name: "Jasper", icon: "✍️", origin: "Jasper", category: "writing", free: "partial", tags: ["写作", "营销", "内容"], desc: "全球领先的AI营销写作工具，品牌调性一致，支持50+模板", url: "https://www.jasper.ai", featured: false },

  // --- AI 编程 ---
  { name: "GitHub Copilot", icon: "🐙", origin: "GitHub", category: "code", free: "partial", tags: ["编程", "补全", "IDE"], desc: "最流行的AI编程助手，实时代码补全和建议，支持主流IDE", url: "https://github.com/features/copilot", featured: false },
  { name: "CodeGeeX", icon: "💻", origin: "智谱AI", category: "code", free: "full", tags: ["编程", "补全", "开源"], desc: "智谱AI开源编程助手，支持100+编程语言，VSCode/JetBrains插件免费", url: "https://codegeex.cn", featured: false },
  { name: "通义灵码", icon: "🔧", origin: "阿里云", category: "code", free: "full", tags: ["编程", "补全", "IDE"], desc: "阿里云AI编程助手，代码补全+生成+解释，全免费", url: "https://tongyi.aliyun.com/lingma", featured: false },
  { name: "Cursor", icon: "👆", origin: "Cursor", category: "code", free: "partial", tags: ["编程", "IDE", "对话"], desc: "AI-first代码编辑器，内置代码对话和编辑能力，开发者新宠", url: "https://cursor.sh", featured: false },
  { name: "Codeium", icon: "⚡", origin: "Codeium", category: "code", free: "full", tags: ["编程", "补全", "搜索"], desc: "完全免费的AI代码补全工具，支持70+语言和40+IDE", url: "https://codeium.com", featured: false },
  { name: "Windsurf", icon: "🏄", origin: "Codeium", category: "code", free: "partial", tags: ["编程", "IDE", "AI Agent"], desc: "Codeium出品的AI IDE，支持Cascade多文件编辑，MCP协议集成", url: "https://codeium.com/windsurf", featured: false },
  { name: "Replit", icon: "🔄", origin: "Replit", category: "code", free: "partial", tags: ["编程", "在线", "部署"], desc: "在线IDE+AI编程+一键部署，支持多种语言，协作开发友好", url: "https://replit.com", featured: false },
  { name: "Vercel v0", icon: "▲", origin: "Vercel", category: "code", free: "partial", tags: ["编程", "前端", "UI"], desc: "AI前端组件生成器，描述UI需求即可生成React/Next.js代码", url: "https://v0.dev", featured: false },
  { name: "bolt.new", icon: "⚡", origin: "StackBlitz", category: "code", free: "partial", tags: ["编程", "全栈", "在线"], desc: "在浏览器中用AI构建全栈应用，自动生成前后端代码并预览", url: "https://bolt.new", featured: false },

  // --- AI 视频 ---
  { name: "可灵AI", icon: "🎬", origin: "快手", category: "video", free: "full", tags: ["视频", "动画", "创意"], desc: "快手旗下AI视频生成，支持文生视频和图生视频，效果惊艳", url: "https://klingai.kuaishou.com", featured: false },
  { name: "即梦AI", icon: "🎥", origin: "字节跳动", category: "video", free: "full", tags: ["视频", "创意"], desc: "字节跳动AI视频工具，PixVerse引擎，高质量视频生成", url: "https://jimeng.jianying.com", featured: false },
  { name: "Runway", icon: "🎞️", origin: "Runway", category: "video", free: "partial", tags: ["视频", "特效", "编辑"], desc: "好莱坞级别的AI视频工具，Gen-3视频生成+特效编辑", url: "https://runwayml.com", featured: false },
  { name: "Pika", icon: "⚡", origin: "Pika Labs", category: "video", free: "partial", tags: ["视频", "动画", "创意"], desc: "AI视频生成和编辑，支持文本/图片转视频，操作简单", url: "https://pika.art", featured: false },
  { name: "PixVerse", icon: "🌟", origin: "PixVerse", category: "video", free: "full", tags: ["视频", "角色", "动画"], desc: "免费AI视频生成平台，支持角色一致性和多风格视频", url: "https://pixverse.ai", featured: false },
  { name: "HeyGen", icon: "🎙️", origin: "HeyGen", category: "video", free: "partial", tags: ["视频", "数字人", "翻译"], desc: "AI数字人视频制作，支持多语言口播视频和翻译配音", url: "https://www.heygen.com", featured: false },
  { name: "剪映", icon: "✂️", origin: "字节跳动", category: "video", free: "full", tags: ["视频", "剪辑", "字幕"], desc: "内置AI字幕、AI配音、智能抠像等功能，免费全能视频编辑器", url: "https://www.capcut.cn", featured: false },

  // --- AI 音频 ---
  { name: "Suno", icon: "🎵", origin: "Suno", category: "audio", free: "partial", tags: ["音乐", "歌曲", "创作"], desc: "AI音乐创作神器，输入文字描述即可生成完整歌曲，含歌词和旋律", url: "https://suno.com", featured: false },
  { name: "Udio", icon: "🎶", origin: "Udio", category: "audio", free: "partial", tags: ["音乐", "创作", "高品质"], desc: "高质量AI音乐生成，支持多种音乐风格，音质接近专业水平", url: "https://www.udio.com", featured: false },
  { name: "豆包音乐", icon: "🎸", origin: "字节跳动", category: "audio", free: "full", tags: ["音乐", "创作", "免费"], desc: "完全免费的AI音乐创作工具，支持多种风格和自定义歌词", url: "https://www.doubao.com/music", featured: false },
  { name: "TTSFree", icon: "🔊", origin: "TTSFree", category: "audio", free: "full", tags: ["语音", "配音", "TTS"], desc: "免费AI文字转语音，支持多种语言和音色，适合视频配音", url: "https://ttsfree.com", featured: false },
  { name: "ElevenLabs", icon: "🗣️", origin: "ElevenLabs", category: "audio", free: "partial", tags: ["语音", "克隆", "TTS"], desc: "业界最强AI语音合成，支持语音克隆和多语言，音质极其自然", url: "https://elevenlabs.io", featured: false },

  // --- AI 设计 ---
  { name: "Canva AI", icon: "🎨", origin: "Canva", category: "design", free: "partial", tags: ["设计", "模板", "海报"], desc: "全球最流行的在线设计工具，AI魔法设计+海量模板", url: "https://www.canva.com", featured: false },
  { name: "Figma AI", icon: "🎨", origin: "Figma", category: "design", free: "partial", tags: ["设计", "UI", "协作"], desc: "专业UI设计工具，新增AI自动布局和智能设计功能", url: "https://www.figma.com", featured: false },
  { name: "美图AI", icon: "📸", origin: "美图", category: "design", free: "full", tags: ["修图", "美颜", "设计"], desc: "AI智能修图和设计，一键美颜、AI扩图、智能抠图", url: "https://www.meitu.com", featured: false },
  { name: "稿定AI", icon: "📐", origin: "稿定设计", category: "design", free: "full", tags: ["设计", "模板", "电商"], desc: "在线设计平台，AI一键生成海报、Logo、电商图", url: "https://www.gaoding.com", featured: false },
  { name: "Remove.bg", icon: "✂️", origin: "Remove.bg", category: "design", free: "full", tags: ["抠图", "背景", "图片"], desc: "AI智能抠图，5秒去除背景，免费使用", url: "https://www.remove.bg", featured: false },

  // --- AI 搜索 ---
  { name: "Perplexity", icon: "🔎", origin: "Perplexity", category: "search", free: "full", tags: ["搜索", "问答", "研究"], desc: "AI搜索引擎，实时搜索+AI总结，带引用来源，学术研究利器", url: "https://www.perplexity.ai", featured: false },
  { name: "秘塔AI搜索", icon: "🔍", origin: "秘塔科技", category: "search", free: "full", tags: ["搜索", "学术", "无广告"], desc: "无广告AI搜索引擎，学术搜索模式，支持深度研究和脑图生成", url: "https://metaso.cn", featured: false },
  { name: "Consensus", icon: "📚", origin: "Consensus", category: "search", free: "partial", tags: ["搜索", "学术", "论文"], desc: "AI学术搜索引擎，从2亿+论文中查找科学答案，研究必备", url: "https://consensus.app", featured: false },
  { name: "天工AI", icon: "🌐", origin: "昆仑万维", category: "search", free: "full", tags: ["搜索", "对话", "多模态"], desc: "国内AI搜索引擎，实时联网搜索+AI总结，支持图像理解", url: "https://www.tiangong.cn", featured: false },
  { name: "Devv.ai", icon: "👨‍💻", origin: "Devv.ai", category: "search", free: "partial", tags: ["搜索", "编程", "文档"], desc: "专为开发者打造的AI搜索引擎，精准搜索技术文档和代码", url: "https://devv.ai", featured: false },

  // --- 效率工具 ---
  { name: "Gamma", icon: "📊", origin: "Gamma", category: "productivity", free: "partial", tags: ["PPT", "演示", "文档"], desc: "AI一键生成精美PPT和文档，多种模板，告别手动排版", url: "https://gamma.app", featured: false },
  { name: "ChatPPT", icon: "📽️", origin: "ChatPPT", category: "productivity", free: "partial", tags: ["PPT", "演示", "AI"], desc: "对话式AI制作PPT，描述需求即可生成专业演示文稿", url: "https://www.chat-ppt.com", featured: false },
  { name: "飞书妙记", icon: "🎙️", origin: "字节跳动", category: "productivity", free: "full", tags: ["会议", "转写", "摘要"], desc: "AI会议纪要自动生成，实时语音转写+智能摘要", url: "https://www.feishu.cn", featured: false },
  { name: "通义听悟", icon: "👂", origin: "阿里云", category: "productivity", free: "full", tags: ["转写", "翻译", "会议"], desc: "阿里云AI转写工具，支持音视频转文字，实时翻译和多语言", url: "https://tingwu.aliyun.com", featured: false },
  { name: "Kimi+智能体", icon: "🤖", origin: "月之暗面", category: "productivity", free: "full", tags: ["智能体", "效率", "定制"], desc: "Kimi智能体平台，可创建专属AI助手处理特定任务", url: "https://kimi.moonshot.cn/kimiplus", featured: false },
  { name: "Dify", icon: "🔧", origin: "Dify", category: "productivity", free: "full", tags: ["智能体", "开发", "开源"], desc: "开源LLM应用开发平台，可视化构建AI应用和工作流", url: "https://dify.ai", featured: false },
  { name: "Coze", icon: "🧠", origin: "字节跳动", category: "productivity", free: "full", tags: ["智能体", "开发", "免费"], desc: "字节跳动AI Bot开发平台，零代码创建AI智能体", url: "https://www.coze.com", featured: false },

  // --- AI 3D ---
  { name: "Tripo3D", icon: "🧊", origin: "Tripo AI", category: "3d", free: "partial", tags: ["3D", "模型", "生成"], desc: "文字/图片生成3D模型，数秒出结果，支持游戏和电商场景", url: "https://www.tripo3d.ai", featured: false },
  { name: "Meshy", icon: "🎲", origin: "Meshy", category: "3d", free: "partial", tags: ["3D", "纹理", "模型"], desc: "AI 3D模型生成+纹理贴图，免费额度可用于快速原型", url: "https://www.meshy.ai", featured: false },
  { name: "CSM", icon: "🔮", origin: "CSM", category: "3d", free: "partial", tags: ["3D", "扫描", "生成"], desc: "AI 3D世界生成，支持图片/视频转3D，游戏开发友好", url: "https://www.3d.csm.ai", featured: false },

  // --- 更多 ---
  { name: "Mathway", icon: "🔢", origin: "Mathway", category: "other", free: "full", tags: ["数学", "解题", "教育"], desc: "AI数学解题工具，覆盖代数、微积分、统计等领域，免费解题", url: "https://www.mathway.com", featured: false },
  { name: "Gamma Translate", icon: "🌐", origin: "Gamma", category: "other", free: "partial", tags: ["翻译", "文档", "多语言"], desc: "AI文档翻译，保持原文排版，支持100+语言", url: "https://gamma.app/translate", featured: false },
  { name: "DeepL", icon: "📘", origin: "DeepL", category: "other", free: "partial", tags: ["翻译", "文档", "精准"], desc: "业界最精准的AI翻译工具，支持文档翻译，中文效果好", url: "https://www.deepl.com", featured: false },
  { name: "DiagramGPT", icon: "📊", origin: "Eraser", category: "other", free: "full", tags: ["图表", "流程图", "技术"], desc: "AI生成流程图和架构图，输入描述自动生成专业图表", url: "https://www.eraser.io/diagram-generator", featured: false },
  { name: "Napkin AI", icon: "🖼️", origin: "Napkin", category: "other", free: "partial", tags: ["图表", "可视化", "文档"], desc: "AI文档图表生成，将文字内容自动转换为精美信息图", url: "https://napkin.ai", featured: false },
];

// ===== 分类名称映射 =====
const categoryNames = {
  all: "全部工具", chat: "AI 对话", image: "AI 绘画", writing: "AI 写作",
  code: "AI 编程", video: "AI 视频", audio: "AI 音频", design: "AI 设计",
  search: "AI 搜索", productivity: "效率工具", "3d": "AI 3D", other: "更多"
};

// ===== State =====
let currentCategory = 'all';
let searchQuery = '';

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
let currentTheme = localStorage.getItem('theme') || 'dark';
applyTheme(currentTheme);

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}
themeToggle?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
});

// ===== Keyboard shortcut for search =====
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    document.getElementById('searchInput')?.focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('searchInput')?.blur();
    searchInput.value = '';
    searchQuery = '';
    renderTools();
  }
});

// ===== Search =====
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderTools();
});

// ===== Category Filter =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    document.getElementById('sectionTitle').textContent = categoryNames[currentCategory] || '全部工具';
    renderTools();
  });
});

// ===== Render Tools =====
function getFilteredTools() {
  let filtered = aiTools;

  if (currentCategory !== 'all') {
    filtered = filtered.filter(t => t.category === currentCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(searchQuery) ||
      t.desc.toLowerCase().includes(searchQuery) ||
      t.origin.toLowerCase().includes(searchQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
      (categoryNames[t.category] || '').includes(searchQuery)
    );
  }

  return filtered;
}

function renderTools() {
  const grid = document.getElementById('toolsGrid');
  const noResults = document.getElementById('noResults');
  const countLabel = document.getElementById('toolCountLabel');
  const filtered = getFilteredTools();

  countLabel.textContent = `${filtered.length} 款`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  grid.innerHTML = filtered.map((tool, i) => `
    <a href="${tool.url}" target="_blank" rel="noopener" class="tool-card" style="animation: fadeInUp 0.4s ease ${i * 0.04}s both">
      <div class="tool-card-glow"></div>
      <div class="tool-card-header">
        <div class="tool-icon">${tool.icon}</div>
        <div class="tool-card-info">
          <div class="tool-name">${tool.name}</div>
          <div class="tool-origin">${tool.origin}</div>
        </div>
        <span class="tool-arrow">→</span>
      </div>
      <p class="tool-desc">${tool.desc}</p>
      <div class="tool-card-footer">
        <div class="tool-tags">
          ${tool.tags.slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}
        </div>
        <span class="free-badge ${tool.free === 'full' ? 'full' : 'partial'}">
          ${tool.free === 'full' ? '免费' : '部分免费'}
        </span>
      </div>
    </a>
  `).join('');

  // Add hover glow effect
  grid.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = card.querySelector('.tool-card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(139,92,246,0.1) 0%, transparent 60%)`;
      }
    });
  });
}

// ===== Update tool count =====
function updateToolCount() {
  const el = document.getElementById('toolCount');
  if (el) {
    // Animate count
    const target = aiTools.length;
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current;
    }, 30);
  }
}

// ===== Navbar scroll effect =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.3)' : 'none';
});

// ===== Entrance Animation CSS =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ===== Init =====
updateToolCount();
renderTools();
