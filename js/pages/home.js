export class HomePage {
  constructor(store, router) {
    this.store = store;
    this.router = router;
  }
  
  render() {
    const agents = this.store.getAgents();
    
    return `
      <section class="hero">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">⚔️ V1.0.0 全新上线</div>
            <h1 class="hero-title">AI智能体<span class="gradient-text">竞技平台</span></h1>
            <p class="hero-subtitle">创建你的AI智能体，让它们在辩论赛和知识抢答中一决高下</p>
            <div class="hero-actions">
              <button class="btn btn-primary" data-page="debate">
                <span>⚔️</span> 开始辩论赛
              </button>
              <button class="btn btn-secondary" data-page="quiz">
                <span>🎯</span> 知识抢答
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-stats">
              <div class="hero-stat">
                <span class="hero-stat-num">${agents.length}</span>
                <span class="hero-stat-label">个智能体</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat">
                <span class="hero-stat-num">2</span>
                <span class="hero-stat-label">种模式</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat">
                <span class="hero-stat-num">∞</span>
                <span class="hero-stat-label">种可能</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section">
        <div class="section-header">
          <h2 class="section-title">🎮 竞技模式</h2>
          <span class="section-line"></span>
        </div>
        <div class="feature-grid">
          <div class="feature-card" data-page="debate">
            <div class="feature-icon">⚔️</div>
            <h3 class="feature-title">辩论赛</h3>
            <p class="feature-desc">选择2-4个AI智能体参赛，指定裁判AI，输入辩题后开始激烈辩论。正反双方轮流发言，裁判最终评分判定胜负。</p>
            <div class="feature-tags">
              <span class="feature-tag">多轮辩论</span>
              <span class="feature-tag">裁判评分</span>
              <span class="feature-tag">胜负判定</span>
            </div>
          </div>
          <div class="feature-card" data-page="quiz">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">知识抢答</h3>
            <p class="feature-desc">选择2-6个AI智能体参赛，裁判出题，参赛AI抢答。正确加分，错误扣分，最终按总分排名。</p>
            <div class="feature-tags">
              <span class="feature-tag">实时抢答</span>
              <span class="feature-tag">计分系统</span>
              <span class="feature-tag">排名展示</span>
            </div>
          </div>
        </div>
      </section>

      <section class="collection-section">
        <div class="section-header">
          <h2 class="section-title">📦 AI合集</h2>
          <span class="section-line"></span>
        </div>
        <div class="collection-card" data-page="collection">
          <div class="collection-header">
            <div class="collection-icon">⚡</div>
            <div>
              <div class="collection-title">YanAI - 免费AI工具合集</div>
              <div class="collection-count">94款精选AI工具</div>
            </div>
            <span class="collection-arrow">→</span>
          </div>
        </div>
      </section>

      <section class="feature-section">
        <div class="section-header">
          <h2 class="section-title">🤖 我的智能体</h2>
          <span class="section-line"></span>
        </div>
        <div class="agent-grid">
          ${agents.slice(0, 3).map(agent => `
            <div class="agent-card">
              <div class="agent-header">
                <div class="agent-avatar">${agent.avatar}</div>
                <div class="agent-info">
                  <div class="agent-name">${agent.name}</div>
                  <div class="agent-model">${agent.model}</div>
                </div>
                <span class="agent-provider">${agent.provider}</span>
              </div>
            </div>
          `).join('')}
          ${agents.length === 0 ? `
            <div class="agent-card" style="text-align: center; padding: 40px;">
              <p class="text-muted mb-4">还没有创建智能体</p>
              <button class="btn btn-primary btn-sm" data-page="agents">创建智能体</button>
            </div>
          ` : `
            <div class="agent-card" style="display: flex; align-items: center; justify-content: center; min-height: 120px;" data-page="agents">
              <span style="font-size: 2rem; color: var(--text-muted);">+</span>
            </div>
          `}
        </div>
      </section>
    `;
  }
  
  mounted() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', () => {
        this.router.navigate(el.dataset.page);
      });
    });
  }
}