export class DebatePage {
  constructor(store, router) {
    this.store = store;
    this.router = router;
    this.step = 'setup';
    this.participants = [];
    this.judge = null;
    this.topic = '';
    this.messages = [];
    this.currentSpeaker = 0;
    this.round = 0;
    this.maxRounds = 3;
    this.status = 'waiting';
  }
  
  render() {
    const agents = this.store.getAgents();
    
    if (this.step === 'setup') {
      return this.renderSetup(agents);
    } else if (this.step === 'battle') {
      return this.renderBattle();
    } else if (this.step === 'result') {
      return this.renderResult();
    }
  }
  
  renderSetup(agents) {
    return `
      <div style="margin-bottom: 24px;">
        <a href="#" data-page="home" style="color: var(--accent); text-decoration: none; font-size: 0.9rem;">← 返回首页</a>
      </div>
      
      <section style="margin-bottom: 32px;">
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">⚔️ 辩论赛</h1>
        <p style="color: var(--text-secondary);">选择参赛智能体和裁判，开始一场激烈的AI辩论</p>
      </section>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">参赛选手 (选择2-4个)</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${agents.map(agent => `
              <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);" class="participant-option" data-id="${agent.id}">
                <input type="checkbox" class="participant-checkbox" data-id="${agent.id}" style="width: 18px; height: 18px;">
                <span style="font-size: 1.5rem;">${agent.avatar}</span>
                <div style="flex: 1;">
                  <div style="font-weight: 600;">${agent.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${agent.model}</div>
                </div>
              </label>
            `).join('')}
            ${agents.length === 0 ? `
              <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                <p>还没有智能体，请先创建</p>
                <button class="btn btn-sm btn-secondary" data-page="agents" style="margin-top: 12px;">创建智能体</button>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">裁判 (选择1个)</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${agents.map(agent => `
                <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
                  <input type="radio" name="judge" class="judge-radio" data-id="${agent.id}" style="width: 18px; height: 18px;">
                  <span style="font-size: 1.5rem;">${agent.avatar}</span>
                  <div style="flex: 1;">
                    <div style="font-weight: 600;">${agent.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${agent.model}</div>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">辩题设置</h3>
            <div class="form-group">
              <label class="form-label">辩论主题</label>
              <input type="text" class="form-input" id="debateTopic" placeholder="如：AI是否会取代人类工作">
            </div>
            <div class="form-group">
              <label class="form-label">辩论轮数</label>
              <select class="form-input form-select" id="debateRounds">
                <option value="2">2轮</option>
                <option value="3" selected>3轮</option>
                <option value="5">5轮</option>
              </select>
            </div>
          </div>
          
          <button class="btn btn-primary" id="startDebate" style="width: 100%; padding: 16px; font-size: 1rem;">
            ⚔️ 开始辩论
          </button>
        </div>
      </div>
    `;
  }
  
  renderBattle() {
    return `
      <div style="margin-bottom: 24px;">
        <button class="btn btn-secondary btn-sm" id="backToSetup">← 返回设置</button>
      </div>
      
      <section style="margin-bottom: 24px;">
        <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">⚔️ 辩论进行中</h1>
        <p style="color: var(--text-secondary);">辩题：${this.topic}</p>
      </section>
      
      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 24px;">
        <div class="chat-room">
          <div class="chat-header">
            <div class="chat-title">辩论现场</div>
            <div class="chat-status">
              <span class="chat-status-dot"></span>
              <span>第 ${this.round}/${this.maxRounds} 轮</span>
            </div>
          </div>
          <div class="chat-messages" id="chatMessages">
            ${this.messages.map(msg => `
              <div class="chat-message ${msg.side}">
                <div class="chat-message-avatar">${msg.avatar}</div>
                <div class="chat-message-content">
                  <div class="chat-message-name">${msg.name} ${msg.side === 'pro' ? '(正方)' : msg.side === 'con' ? '(反方)' : '(裁判)'}</div>
                  <div class="chat-message-text">${msg.content}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px;">参赛选手</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${this.participants.map((p, i) => `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-xs);">
                  <span style="font-size: 1.2rem;">${p.avatar}</span>
                  <div style="flex: 1;">
                    <div style="font-size: 0.85rem; font-weight: 600;">${p.name}</div>
                    <div style="font-size: 0.7rem; color: ${p.side === 'pro' ? 'var(--accent-green)' : 'var(--accent-red)'};">${p.side === 'pro' ? '正方' : '反方'}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px;">裁判</h3>
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-xs);">
              <span style="font-size: 1.2rem;">${this.judge.avatar}</span>
              <div style="flex: 1;">
                <div style="font-size: 0.85rem; font-weight: 600;">${this.judge.name}</div>
                <div style="font-size: 0.7rem; color: var(--accent-3);">公正裁判</div>
              </div>
            </div>
          </div>
          
          <button class="btn btn-primary" id="nextRound" style="width: 100%;">
            ${this.round < this.maxRounds ? '下一轮发言' : '结束辩论'}
          </button>
        </div>
      </div>
    `;
  }
  
  renderResult() {
    return `
      <div style="margin-bottom: 24px;">
        <button class="btn btn-secondary btn-sm" id="newDebate">← 开始新辩论</button>
      </div>
      
      <section style="margin-bottom: 32px; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🏆</div>
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">辩论结束</h1>
        <p style="color: var(--text-secondary);">辩题：${this.topic}</p>
      </section>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 800px; margin: 0 auto;">
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 8px;">🎉</div>
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--accent-green);">胜方</h3>
          <p style="font-size: 1.5rem; font-weight: 800; margin-top: 8px;">${this.result?.winner === 'pro' ? '正方' : '反方'}</p>
        </div>
        
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">裁判点评</h3>
          <p style="color: var(--text-secondary); line-height: 1.7;">${this.result?.summary || '双方辩论精彩，论点清晰，论据充分。'}</p>
        </div>
      </div>
      
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-top: 24px; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">完整辩论记录</h3>
        <div style="max-height: 300px; overflow-y: auto;">
          ${this.messages.map(msg => `
            <div style="padding: 12px 0; border-bottom: 1px solid var(--border);">
              <div style="font-weight: 600; margin-bottom: 4px;">${msg.name} ${msg.side === 'pro' ? '(正方)' : msg.side === 'con' ? '(反方)' : '(裁判)'}</div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">${msg.content}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  mounted() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate(el.dataset.page);
      });
    });
    
    if (this.step === 'setup') {
      this.setupListeners();
    } else if (this.step === 'battle') {
      this.battleListeners();
    } else if (this.step === 'result') {
      this.resultListeners();
    }
  }
  
  setupListeners() {
    document.querySelectorAll('.participant-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = document.querySelectorAll('.participant-checkbox:checked');
        if (checked.length > 4) {
          cb.checked = false;
        }
      });
    });
    
    document.getElementById('startDebate')?.addEventListener('click', () => {
      const checked = document.querySelectorAll('.participant-checkbox:checked');
      const judgeRadio = document.querySelector('.judge-radio:checked');
      const topic = document.getElementById('debateTopic')?.value.trim();
      const rounds = parseInt(document.getElementById('debateRounds')?.value || '3');
      
      if (checked.length < 2) {
        alert('请至少选择2个参赛选手');
        return;
      }
      if (!judgeRadio) {
        alert('请选择裁判');
        return;
      }
      if (!topic) {
        alert('请输入辩论主题');
        return;
      }
      
      const agents = this.store.getAgents();
      this.participants = Array.from(checked).map(cb => {
        const agent = agents.find(a => a.id === cb.dataset.id);
        return { ...agent };
      });
      
      this.participants.forEach((p, i) => {
        p.side = i % 2 === 0 ? 'pro' : 'con';
      });
      
      this.judge = agents.find(a => a.id === judgeRadio.dataset.id);
      this.topic = topic;
      this.maxRounds = rounds;
      this.step = 'battle';
      this.round = 0;
      this.messages = [];
      
      this.addMessage({
        avatar: '⚖️',
        name: '系统',
        side: 'judge',
        content: `辩论开始！辩题：${this.topic}。正方观点：支持；反方观点：反对。请双方依次发言。`
      });
      
      this.store.addMatch({
        type: 'debate',
        topic: this.topic,
        participants: this.participants.map(p => p.id),
        judge: this.judge.id,
        status: 'ongoing',
      });
      
      this.router.navigate('debate');
    });
  }
  
  battleListeners() {
    document.getElementById('backToSetup')?.addEventListener('click', () => {
      this.step = 'setup';
      this.router.navigate('debate');
    });
    
    document.getElementById('nextRound')?.addEventListener('click', () => {
      if (this.round < this.maxRounds) {
        this.simulateRound();
      } else {
        this.endDebate();
      }
    });
    
    this.scrollToBottom();
  }
  
  resultListeners() {
    document.getElementById('newDebate')?.addEventListener('click', () => {
      this.step = 'setup';
      this.participants = [];
      this.judge = null;
      this.topic = '';
      this.messages = [];
      this.round = 0;
      this.result = null;
      this.router.navigate('debate');
    });
  }
  
  simulateRound() {
    this.round++;
    
    this.participants.forEach(p => {
      const responses = this.getResponses(p.side);
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      this.addMessage({
        avatar: p.avatar,
        name: p.name,
        side: p.side,
        content: response
      });
    });
    
    this.router.navigate('debate');
  }
  
  getResponses(side) {
    const proResponses = [
      '我认为这个观点是正确的。首先，从历史发展趋势来看，技术进步确实带来了巨大的变革。其次，从经济效益角度分析，这种变化将创造更多价值。最后，从社会影响来看，这将为人类带来更多便利。',
      '对方辩友的观点存在逻辑漏洞。事实上，数据显示支持我方观点。研究表明，超过70%的专家认同这一趋势。我们应该以开放的心态拥抱变化。',
      '我想补充一点：这个议题的核心在于如何平衡发展与风险。正方的立场是积极拥抱，而不是盲目排斥。我们相信，通过合理的规划和监管，可以实现双赢。'
    ];
    
    const conResponses = [
      '我不同意对方的观点。首先，这种变化存在巨大的不确定性。其次，从人文关怀角度，我们不能忽视可能带来的负面影响。最后，从长远来看，这可能带来不可逆的风险。',
      '对方的数据存在选择性偏差。实际上，很多研究得出了相反的结论。我们应该更加谨慎地评估风险，而不是一味追求所谓的进步。',
      '我想指出的是，这个议题并非非黑即白。反方的立场是审慎对待，而不是全盘否定。我们需要更多的讨论和研究，而不是急于下结论。'
    ];
    
    return side === 'pro' ? proResponses : conResponses;
  }
  
  endDebate() {
    const winner = Math.random() > 0.5 ? 'pro' : 'con';
    
    this.addMessage({
      avatar: this.judge.avatar,
      name: this.judge.name,
      side: 'judge',
      content: `经过${this.maxRounds}轮激烈辩论，我宣布${winner === 'pro' ? '正方' : '反方'}获胜！双方都展现了出色的辩论技巧，论点清晰，论据充分。${winner === 'pro' ? '正方' : '反方'}在逻辑严密性和论据说服力上略胜一筹。`
    });
    
    this.result = {
      winner,
      summary: '双方辩论精彩，展现了AI智能体的优秀对话能力。正方论点更具说服力，反方反驳也很有力。'
    };
    
    this.step = 'result';
    this.router.navigate('debate');
  }
  
  addMessage(msg) {
    this.messages.push({
      ...msg,
      timestamp: new Date().toISOString()
    });
  }
  
  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}