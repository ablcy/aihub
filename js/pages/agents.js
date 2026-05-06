export class AgentsPage {
  constructor(store, router) {
    this.store = store;
    this.router = router;
    this.editingId = null;
  }
  
  render() {
    const agents = this.store.getAgents();
    
    return `
      <div style="margin-bottom: 24px;">
        <a href="#" data-page="home" style="color: var(--accent); text-decoration: none; font-size: 0.9rem;">← 返回首页</a>
      </div>
      
      <section style="margin-bottom: 32px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">🤖 智能体管理</h1>
            <p style="color: var(--text-secondary);">创建和管理你的AI智能体，为比赛做准备</p>
          </div>
          <button class="btn btn-primary" id="addAgentBtn">
            <span>+</span> 创建智能体
          </button>
        </div>
      </section>
      
      <div class="agent-grid">
        ${agents.map(agent => `
          <div class="agent-card" data-agent-id="${agent.id}">
            <div class="agent-header">
              <div class="agent-avatar">${agent.avatar}</div>
              <div class="agent-info">
                <div class="agent-name">${agent.name}</div>
                <div class="agent-model">${agent.model}</div>
              </div>
              <span class="agent-provider">${agent.provider}</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.5;">
              ${agent.systemPrompt?.substring(0, 60) || '暂无系统提示词'}...
            </p>
            <div class="agent-actions">
              <button class="agent-action-btn" data-action="edit" data-id="${agent.id}">编辑</button>
              <button class="agent-action-btn" data-action="test" data-id="${agent.id}">测试</button>
              <button class="agent-action-btn delete" data-action="delete" data-id="${agent.id}">删除</button>
            </div>
          </div>
        `).join('')}
        
        ${agents.length === 0 ? `
          <div class="agent-card" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
            <div style="font-size: 3rem; margin-bottom: 16px;">🤖</div>
            <p style="color: var(--text-muted); margin-bottom: 16px;">还没有创建任何智能体</p>
            <button class="btn btn-primary" id="addAgentBtnEmpty">创建第一个智能体</button>
          </div>
        ` : ''}
      </div>
      
      <!-- Modal -->
      <div class="modal-overlay" id="agentModal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title" id="modalTitle">创建智能体</h3>
            <button class="modal-close" id="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <form id="agentForm">
              <div class="form-group">
                <label class="form-label">名称</label>
                <input type="text" class="form-input" id="agentName" placeholder="给智能体起个名字" required>
              </div>
              <div class="form-group">
                <label class="form-label">头像</label>
                <input type="text" class="form-input" id="agentAvatar" placeholder="输入emoji作为头像，如 🤖">
              </div>
              <div class="form-group">
                <label class="form-label">AI提供商</label>
                <select class="form-input form-select" id="agentProvider">
                  <option value="openai">OpenAI</option>
                  <option value="claude">Claude (Anthropic)</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="kimi">Kimi (月之暗面)</option>
                  <option value="zhipu">智谱AI</option>
                  <option value="custom">自定义</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">模型</label>
                <input type="text" class="form-input" id="agentModel" placeholder="如 gpt-4o, claude-3-sonnet">
              </div>
              <div class="form-group">
                <label class="form-label">API Key</label>
                <input type="password" class="form-input" id="agentApiKey" placeholder="输入API密钥">
              </div>
              <div class="form-group">
                <label class="form-label">系统提示词</label>
                <textarea class="form-input" id="agentPrompt" rows="4" placeholder="定义智能体的角色和行为..."></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelBtn">取消</button>
            <button class="btn btn-primary" id="saveBtn">保存</button>
          </div>
        </div>
      </div>
    `;
  }
  
  mounted() {
    const modal = document.getElementById('agentModal');
    const form = document.getElementById('agentForm');
    
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate(el.dataset.page);
      });
    });
    
    const openModal = () => {
      this.editingId = null;
      document.getElementById('modalTitle').textContent = '创建智能体';
      form.reset();
      modal.classList.add('active');
    };
    
    document.getElementById('addAgentBtn')?.addEventListener('click', openModal);
    document.getElementById('addAgentBtnEmpty')?.addEventListener('click', openModal);
    
    document.getElementById('closeModal')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    document.getElementById('cancelBtn')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    document.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = el.dataset.action;
        const id = el.dataset.id;
        
        if (action === 'edit') {
          this.editingId = id;
          const agent = this.store.getAgent(id);
          if (agent) {
            document.getElementById('modalTitle').textContent = '编辑智能体';
            document.getElementById('agentName').value = agent.name;
            document.getElementById('agentAvatar').value = agent.avatar;
            document.getElementById('agentProvider').value = agent.provider;
            document.getElementById('agentModel').value = agent.model;
            document.getElementById('agentApiKey').value = agent.apiKey || '';
            document.getElementById('agentPrompt').value = agent.systemPrompt || '';
            modal.classList.add('active');
          }
        } else if (action === 'delete') {
          if (confirm('确定要删除这个智能体吗？')) {
            this.store.deleteAgent(id);
          }
        } else if (action === 'test') {
          alert('测试功能：请确保已配置API Key，然后在实际比赛中测试此智能体');
        }
      });
    });
    
    document.getElementById('saveBtn')?.addEventListener('click', () => {
      const name = document.getElementById('agentName').value.trim();
      const avatar = document.getElementById('agentAvatar').value.trim() || '🤖';
      const provider = document.getElementById('agentProvider').value;
      const model = document.getElementById('agentModel').value.trim();
      const apiKey = document.getElementById('agentApiKey').value.trim();
      const systemPrompt = document.getElementById('agentPrompt').value.trim();
      
      if (!name || !model) {
        alert('请填写名称和模型');
        return;
      }
      
      const agentData = { name, avatar, provider, model, apiKey, systemPrompt };
      
      if (this.editingId) {
        this.store.updateAgent(this.editingId, agentData);
      } else {
        this.store.addAgent(agentData);
      }
      
      modal.classList.remove('active');
    });
    
    document.getElementById('agentProvider')?.addEventListener('change', (e) => {
      const provider = e.target.value;
      const modelInput = document.getElementById('agentModel');
      const defaults = {
        openai: 'gpt-4o',
        claude: 'claude-3-sonnet',
        deepseek: 'deepseek-chat',
        kimi: 'moonshot-v1-8k',
        zhipu: 'glm-4',
        custom: '',
      };
      modelInput.placeholder = defaults[provider] || '输入模型名称';
    });
  }
}