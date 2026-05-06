export class HistoryPage {
  constructor(store, router) {
    this.store = store;
    this.router = router;
  }
  
  render() {
    const matches = this.store.getMatches();
    
    return `
      <div style="margin-bottom: 24px;">
        <a href="#" data-page="home" style="color: var(--accent); text-decoration: none; font-size: 0.9rem;">← 返回首页</a>
      </div>
      
      <section style="margin-bottom: 32px;">
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">📜 历史记录</h1>
        <p style="color: var(--text-secondary);">查看过往的比赛记录</p>
      </section>
      
      ${matches.length === 0 ? `
        <div style="text-align: center; padding: 60px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);">
          <div style="font-size: 3rem; margin-bottom: 16px;">📭</div>
          <p style="color: var(--text-muted); margin-bottom: 16px;">还没有比赛记录</p>
          <button class="btn btn-primary" data-page="debate">开始第一场比赛</button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${matches.map(match => {
            const agents = this.store.getAgents();
            const participants = match.participants?.map(id => agents.find(a => a.id === id)).filter(Boolean) || [];
            const judge = agents.find(a => a.id === match.judge);
            const date = new Date(match.createdAt).toLocaleString('zh-CN');
            
            return `
              <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.5rem;">${match.type === 'debate' ? '⚔️' : '🎯'}</span>
                    <div>
                      <div style="font-weight: 700;">${match.type === 'debate' ? '辩论赛' : '知识抢答'}</div>
                      <div style="font-size: 0.8rem; color: var(--text-muted);">${date}</div>
                    </div>
                  </div>
                  <span style="padding: 4px 12px; background: ${match.status === 'ongoing' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)'}; border-radius: 20px; font-size: 0.75rem; color: ${match.status === 'ongoing' ? 'var(--accent-3)' : 'var(--accent-green)'};">
                    ${match.status === 'ongoing' ? '进行中' : '已结束'}
                  </span>
                </div>
                
                ${match.topic ? `
                  <div style="margin-bottom: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm);">
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">辩题</div>
                    <div style="font-weight: 600;">${match.topic}</div>
                  </div>
                ` : ''}
                
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 0.8rem; color: var(--text-muted);">参赛者：</span>
                  ${participants.map(p => `
                    <span style="padding: 4px 10px; background: var(--bg-secondary); border-radius: 6px; font-size: 0.8rem;">
                      ${p.avatar} ${p.name}
                    </span>
                  `).join('')}
                  ${judge ? `
                    <span style="padding: 4px 10px; background: rgba(245, 158, 11, 0.1); border-radius: 6px; font-size: 0.8rem; color: var(--accent-3);">
                      ⚖️ ${judge.name} (裁判)
                    </span>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  }
  
  mounted() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate(el.dataset.page);
      });
    });
  }
}