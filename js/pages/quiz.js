export class QuizPage {
  constructor(store, router) {
    this.store = store;
    this.router = router;
    this.step = 'setup';
    this.participants = [];
    this.judge = null;
    this.questions = [];
    this.currentQuestion = 0;
    this.scores = {};
    this.status = 'waiting';
    this.answered = [];
  }
  
  render() {
    const agents = this.store.getAgents();
    
    if (this.step === 'setup') {
      return this.renderSetup(agents);
    } else if (this.step === 'quiz') {
      return this.renderQuiz();
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
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">🎯 知识抢答</h1>
        <p style="color: var(--text-secondary);">选择参赛智能体和裁判，开始一场知识抢答比赛</p>
      </section>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">参赛选手 (选择2-6个)</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${agents.map(agent => `
              <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
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
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">题目设置</h3>
            <div class="form-group">
              <label class="form-label">题目类型</label>
              <select class="form-input form-select" id="quizCategory">
                <option value="general">常识问答</option>
                <option value="science">科学知识</option>
                <option value="history">历史知识</option>
                <option value="tech">科技知识</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">题目数量</label>
              <select class="form-input form-select" id="quizCount">
                <option value="3">3题</option>
                <option value="5" selected>5题</option>
                <option value="10">10题</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">难度</label>
              <select class="form-input form-select" id="quizDifficulty">
                <option value="easy">简单</option>
                <option value="medium" selected>中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
          </div>
          
          <button class="btn btn-primary" id="startQuiz" style="width: 100%; padding: 16px; font-size: 1rem;">
            🎯 开始抢答
          </button>
        </div>
      </div>
    `;
  }
  
  renderQuiz() {
    const question = this.questions[this.currentQuestion];
    const sortedScores = Object.entries(this.scores).sort((a, b) => b[1] - a[1]);
    
    return `
      <div style="margin-bottom: 24px;">
        <button class="btn btn-secondary btn-sm" id="backToSetup">← 返回设置</button>
      </div>
      
      <section style="margin-bottom: 24px;">
        <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">🎯 知识抢答</h1>
        <p style="color: var(--text-secondary);">第 ${this.currentQuestion + 1}/${this.questions.length} 题</p>
      </section>
      
      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 24px;">
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
          <div style="margin-bottom: 24px;">
            <span style="padding: 4px 12px; background: rgba(139, 92, 246, 0.1); border-radius: 20px; font-size: 0.8rem; color: var(--accent);">${question?.category || '常识'}</span>
          </div>
          
          <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 24px; line-height: 1.5;">
            ${question?.content || '题目加载中...'}
          </h2>
          
          ${question?.options ? `
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              ${question.options.map((opt, i) => `
                <div style="padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);" class="option-btn" data-option="${i}">
                  <span style="font-weight: 600; margin-right: 12px;">${String.fromCharCode(65 + i)}.</span>
                  ${opt}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div id="answerSection" style="display: none; padding: 20px; background: var(--bg-secondary); border-radius: var(--radius-sm); margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <span style="font-size: 1.5rem;" id="winnerAvatar">🤖</span>
              <div>
                <div style="font-weight: 700;" id="winnerName">-</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">抢答成功</div>
              </div>
              <span style="margin-left: auto; padding: 4px 12px; background: var(--accent-green); color: white; border-radius: 20px; font-size: 0.8rem; font-weight: 600;" id="answerResult">正确 +10分</span>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">
              答案：<span style="color: var(--accent-green); font-weight: 600;" id="correctAnswer">-</span>
            </div>
          </div>
          
          <button class="btn btn-primary" id="nextQuestion" style="width: 100%;">
            ${this.currentQuestion < this.questions.length - 1 ? '下一题' : '查看结果'}
          </button>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px;">实时排名</h3>
            <div class="scoreboard-list">
              ${sortedScores.map(([id, score], i) => {
                const p = this.participants.find(p => p.id === id);
                const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
                return `
                  <div class="scoreboard-item">
                    <div class="scoreboard-rank ${rankClass}">${i + 1}</div>
                    <span style="font-size: 1.2rem;">${p?.avatar || '🤖'}</span>
                    <div class="scoreboard-name">${p?.name || 'Unknown'}</div>
                    <div class="scoreboard-score">${score}分</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px;">裁判</h3>
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-xs);">
              <span style="font-size: 1.2rem;">${this.judge?.avatar || '⚖️'}</span>
              <div style="flex: 1;">
                <div style="font-size: 0.85rem; font-weight: 600;">${this.judge?.name || '裁判'}</div>
                <div style="font-size: 0.7rem; color: var(--accent-3);">公正裁判</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  renderResult() {
    const sortedScores = Object.entries(this.scores).sort((a, b) => b[1] - a[1]);
    
    return `
      <div style="margin-bottom: 24px;">
        <button class="btn btn-secondary btn-sm" id="newQuiz">← 开始新比赛</button>
      </div>
      
      <section style="margin-bottom: 32px; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🏆</div>
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">比赛结束</h1>
        <p style="color: var(--text-secondary);">共 ${this.questions.length} 道题目</p>
      </section>
      
      <div style="max-width: 600px; margin: 0 auto;">
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 20px;">最终排名</h3>
          <div class="scoreboard-list">
            ${sortedScores.map(([id, score], i) => {
              const p = this.participants.find(p => p.id === id);
              const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
              return `
                <div class="scoreboard-item" style="padding: 16px;">
                  <div class="scoreboard-rank ${rankClass}" style="width: 32px; height: 32px; font-size: 0.9rem;">${i + 1}</div>
                  <span style="font-size: 1.5rem;">${p?.avatar || '🤖'}</span>
                  <div class="scoreboard-name" style="font-size: 1rem;">${p?.name || 'Unknown'}</div>
                  <div class="scoreboard-score" style="font-size: 1.1rem;">${score}分</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">裁判总结</h3>
          <p style="color: var(--text-secondary); line-height: 1.7;">
            恭喜 <strong>${this.participants.find(p => p.id === sortedScores[0][0])?.name || '冠军'}</strong> 获得本次知识抢答冠军！
            本场比赛共 ${this.questions.length} 道题目，各位选手表现精彩，展现了出色的知识储备和快速反应能力。
          </p>
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
    } else if (this.step === 'quiz') {
      this.quizListeners();
    } else if (this.step === 'result') {
      this.resultListeners();
    }
  }
  
  setupListeners() {
    document.querySelectorAll('.participant-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = document.querySelectorAll('.participant-checkbox:checked');
        if (checked.length > 6) {
          cb.checked = false;
        }
      });
    });
    
    document.getElementById('startQuiz')?.addEventListener('click', () => {
      const checked = document.querySelectorAll('.participant-checkbox:checked');
      const judgeRadio = document.querySelector('.judge-radio:checked');
      const count = parseInt(document.getElementById('quizCount')?.value || '5');
      const category = document.getElementById('quizCategory')?.value || 'general';
      
      if (checked.length < 2) {
        alert('请至少选择2个参赛选手');
        return;
      }
      if (!judgeRadio) {
        alert('请选择裁判');
        return;
      }
      
      const agents = this.store.getAgents();
      this.participants = Array.from(checked).map(cb => {
        return { ...agents.find(a => a.id === cb.dataset.id) };
      });
      
      this.judge = agents.find(a => a.id === judgeRadio.dataset.id);
      this.questions = this.generateQuestions(count, category);
      this.currentQuestion = 0;
      this.scores = {};
      this.participants.forEach(p => {
        this.scores[p.id] = 0;
      });
      this.step = 'quiz';
      
      this.store.addMatch({
        type: 'quiz',
        category,
        questionCount: count,
        participants: this.participants.map(p => p.id),
        judge: this.judge.id,
        status: 'ongoing',
      });
      
      this.router.navigate('quiz');
    });
  }
  
  quizListeners() {
    document.getElementById('backToSetup')?.addEventListener('click', () => {
      this.step = 'setup';
      this.router.navigate('quiz');
    });
    
    let answered = false;
    
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        
        const selected = parseInt(btn.dataset.option);
        const question = this.questions[this.currentQuestion];
        const isCorrect = selected === question.correctIndex;
        
        const winner = this.participants[Math.floor(Math.random() * this.participants.length)];
        
        document.getElementById('winnerAvatar').textContent = winner.avatar;
        document.getElementById('winnerName').textContent = winner.name;
        document.getElementById('correctAnswer').textContent = question.answer;
        
        if (isCorrect) {
          this.scores[winner.id] += 10;
          document.getElementById('answerResult').textContent = '正确 +10分';
          document.getElementById('answerResult').style.background = 'var(--accent-green)';
        } else {
          this.scores[winner.id] -= 5;
          document.getElementById('answerResult').textContent = '错误 -5分';
          document.getElementById('answerResult').style.background = 'var(--accent-red)';
        }
        
        document.getElementById('answerSection').style.display = 'block';
        
        btn.style.borderColor = isCorrect ? 'var(--accent-green)' : 'var(--accent-red)';
        btn.style.background = isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      });
    });
    
    document.getElementById('nextQuestion')?.addEventListener('click', () => {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.step = 'quiz';
      } else {
        this.step = 'result';
      }
      this.router.navigate('quiz');
    });
  }
  
  resultListeners() {
    document.getElementById('newQuiz')?.addEventListener('click', () => {
      this.step = 'setup';
      this.participants = [];
      this.judge = null;
      this.questions = [];
      this.currentQuestion = 0;
      this.scores = {};
      this.router.navigate('quiz');
    });
  }
  
  generateQuestions(count, category) {
    const questionBank = {
      general: [
        { content: '地球上最大的海洋是哪个？', options: ['太平洋', '大西洋', '印度洋', '北冰洋'], answer: '太平洋', correctIndex: 0, category: '常识' },
        { content: '一年有多少天？', options: ['364天', '365天', '366天', '360天'], answer: '365天', correctIndex: 1, category: '常识' },
        { content: '光年是什么单位？', options: ['时间单位', '距离单位', '速度单位', '质量单位'], answer: '距离单位', correctIndex: 1, category: '常识' },
        { content: '人体最大的器官是什么？', options: ['心脏', '肝脏', '皮肤', '大脑'], answer: '皮肤', correctIndex: 2, category: '常识' },
        { content: '世界上最高的山峰是？', options: ['K2', '珠穆朗玛峰', '乔戈里峰', '干城章嘉峰'], answer: '珠穆朗玛峰', correctIndex: 1, category: '常识' },
      ],
      science: [
        { content: '水的化学式是什么？', options: ['H2O', 'CO2', 'O2', 'N2'], answer: 'H2O', correctIndex: 0, category: '科学' },
        { content: '光的速度约为多少？', options: ['30万公里/秒', '30万米/秒', '3万公里/秒', '300万公里/秒'], answer: '30万公里/秒', correctIndex: 0, category: '科学' },
        { content: 'DNA的全称是什么？', options: ['核糖核酸', '脱氧核糖核酸', '蛋白质', '氨基酸'], answer: '脱氧核糖核酸', correctIndex: 1, category: '科学' },
        { content: '地球的卫星是什么？', options: ['火星', '金星', '月球', '太阳'], answer: '月球', correctIndex: 2, category: '科学' },
        { content: '元素周期表中第一个元素是？', options: ['氦', '氢', '氧', '碳'], answer: '氢', correctIndex: 1, category: '科学' },
      ],
      history: [
        { content: '中国第一个封建王朝是？', options: ['汉朝', '秦朝', '唐朝', '周朝'], answer: '秦朝', correctIndex: 1, category: '历史' },
        { content: '第一次世界大战开始于哪一年？', options: ['1914年', '1918年', '1939年', '1945年'], answer: '1914年', correctIndex: 0, category: '历史' },
        { content: '谁发明了造纸术？', options: ['张衡', '蔡伦', '毕昇', '祖冲之'], answer: '蔡伦', correctIndex: 1, category: '历史' },
        { content: '唐朝的开国皇帝是？', options: ['李世民', '李渊', '李治', '李隆基'], answer: '李渊', correctIndex: 1, category: '历史' },
        { content: '丝绸之路是谁开辟的？', options: ['郑和', '张骞', '玄奘', '班超'], answer: '张骞', correctIndex: 1, category: '历史' },
      ],
      tech: [
        { content: 'HTTP协议的默认端口是？', options: ['80', '443', '8080', '21'], answer: '80', correctIndex: 0, category: '科技' },
        { content: 'AI的全称是什么？', options: ['Artificial Intelligence', 'Advanced Internet', 'Auto Intelligence', 'Artificial Internet'], answer: 'Artificial Intelligence', correctIndex: 0, category: '科技' },
        { content: 'Python是一种？', options: ['编译型语言', '解释型语言', '机器语言', '汇编语言'], answer: '解释型语言', correctIndex: 1, category: '科技' },
        { content: 'TCP/IP模型有几层？', options: ['3层', '4层', '5层', '7层'], answer: '4层', correctIndex: 1, category: '科技' },
        { content: 'Git是什么类型的工具？', options: ['编辑器', '版本控制', '编译器', '调试器'], answer: '版本控制', correctIndex: 1, category: '科技' },
      ],
    };
    
    const questions = questionBank[category] || questionBank.general;
    return questions.slice(0, count);
  }
}