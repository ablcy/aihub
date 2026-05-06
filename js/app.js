import { Router } from './router.js';
import { Store } from './store.js';
import { HomePage } from './pages/home.js';
import { CollectionPage } from './pages/collection.js';
import { AgentsPage } from './pages/agents.js';
import { DebatePage } from './pages/debate.js';
import { QuizPage } from './pages/quiz.js';
import { HistoryPage } from './pages/history.js';

const store = new Store();
const router = new Router();

const pages = {
  home: new HomePage(store, router),
  collection: new CollectionPage(store, router),
  agents: new AgentsPage(store, router),
  debate: new DebatePage(store, router),
  quiz: new QuizPage(store, router),
  history: new HistoryPage(store, router),
};

function render() {
  const app = document.getElementById('app');
  const currentPage = router.getCurrentPage();
  
  app.innerHTML = `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo" data-page="home">
          <span class="logo-icon">⚔️</span>
          <span class="logo-text">AI擂台</span>
        </div>
        <div class="nav-links">
          <button class="nav-link ${currentPage === 'home' ? 'active' : ''}" data-page="home">首页</button>
          <button class="nav-link ${currentPage === 'collection' ? 'active' : ''}" data-page="collection">AI合集</button>
          <button class="nav-link ${currentPage === 'agents' ? 'active' : ''}" data-page="agents">智能体管理</button>
          <button class="nav-link ${currentPage === 'debate' ? 'active' : ''}" data-page="debate">辩论赛</button>
          <button class="nav-link ${currentPage === 'quiz' ? 'active' : ''}" data-page="quiz">知识抢答</button>
          <button class="nav-link ${currentPage === 'history' ? 'active' : ''}" data-page="history">历史记录</button>
        </div>
        <div class="nav-actions">
          <button class="theme-toggle" id="themeToggle" title="切换主题">
            <span class="theme-icon">🌙</span>
          </button>
        </div>
      </div>
    </nav>
    <main class="main-content" id="mainContent">
      ${pages[currentPage]?.render() || pages.home.render()}
    </main>
  `;
  
  setupEventListeners();
  pages[currentPage]?.mounted?.();
}

function setupEventListeners() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.dataset.page;
      router.navigate(page);
    });
  });
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.querySelector('.theme-icon').textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
  }
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  }
}

router.onNavigate(render);
store.onChange(render);

document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  render();
});