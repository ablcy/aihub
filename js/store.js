import { initDatabase, getAgents, getAgent, createAgent, updateAgent, deleteAgent, createDebate, getDebate, getDebates, addDebateRound, setDebateWinner, createQuiz, getQuiz, getQuizzes, addQuizQuestion, submitQuizAnswer, setQuizWinner } from './api.js';

export class Store {
  constructor() {
    this.state = {
      agents: [],
      matches: [],
      settings: this.loadSettings(),
    };
    this.listeners = [];
    this.initialized = false;
  }
  
  async init() {
    if (this.initialized) return;
    await initDatabase();
    await this.loadFromDatabase();
    this.initialized = true;
  }
  
  async loadFromDatabase() {
    try {
      this.state.agents = await getAgents();
      const debates = await getDebates();
      const quizzes = await getQuizzes();
      this.state.matches = [...debates, ...quizzes].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      this.notify();
    } catch (error) {
      console.warn('Failed to load from database, using localStorage fallback:', error);
      this.state.agents = this.loadAgentsFromStorage();
      this.state.matches = this.loadMatchesFromStorage();
    }
  }
  
  loadSettings() {
    const saved = localStorage.getItem('ai-arena-settings');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      defaultProvider: 'openai',
    };
  }
  
  loadAgentsFromStorage() {
    const saved = localStorage.getItem('ai-arena-agents');
    return saved ? JSON.parse(saved) : this.getDefaultAgents();
  }
  
  loadMatchesFromStorage() {
    const saved = localStorage.getItem('ai-arena-matches');
    return saved ? JSON.parse(saved) : [];
  }
  
  getDefaultAgents() {
    return [
      {
        id: 'agent-1',
        name: 'GPT-4o',
        avatar: '🤖',
        provider: 'openai',
        model: 'gpt-4o',
        api_key: '',
        systemPrompt: '你是一个专业的辩论选手，善于用逻辑和事实来支持你的观点。',
        created_at: new Date().toISOString(),
      },
      {
        id: 'agent-2',
        name: 'Claude',
        avatar: '🧙',
        provider: 'claude',
        model: 'claude-3-sonnet',
        api_key: '',
        systemPrompt: '你是一个知识渊博的学者，擅长分析和解答各类问题。',
        created_at: new Date().toISOString(),
      },
      {
        id: 'agent-3',
        name: 'DeepSeek',
        avatar: '🔮',
        provider: 'deepseek',
        model: 'deepseek-chat',
        api_key: '',
        systemPrompt: '你是一个严谨的裁判，公正客观地评判比赛。',
        created_at: new Date().toISOString(),
      },
    ];
  }
  
  saveSettings() {
    localStorage.setItem('ai-arena-settings', JSON.stringify(this.state.settings));
  }
  
  getState() {
    return this.state;
  }
  
  getAgents() {
    return this.state.agents;
  }
  
  async getAgent(id) {
    try {
      return await getAgent(id);
    } catch {
      return this.state.agents.find(a => a.id === id);
    }
  }
  
  async addAgent(agent) {
    agent.id = crypto.randomUUID();
    agent.created_at = new Date().toISOString();
    try {
      const created = await createAgent(agent);
      this.state.agents.push(created);
      this.notify();
      return created;
    } catch (error) {
      console.warn('Failed to create agent in database:', error);
      this.state.agents.push(agent);
      this.saveAgentsToStorage();
      this.notify();
      return agent;
    }
  }
  
  async updateAgent(id, updates) {
    try {
      await updateAgent(id, updates);
      const index = this.state.agents.findIndex(a => a.id === id);
      if (index !== -1) {
        this.state.agents[index] = { ...this.state.agents[index], ...updates };
      }
      this.notify();
    } catch (error) {
      console.warn('Failed to update agent in database:', error);
      const index = this.state.agents.findIndex(a => a.id === id);
      if (index !== -1) {
        this.state.agents[index] = { ...this.state.agents[index], ...updates };
      }
      this.saveAgentsToStorage();
      this.notify();
    }
  }
  
  async deleteAgent(id) {
    try {
      await deleteAgent(id);
      this.state.agents = this.state.agents.filter(a => a.id !== id);
      this.notify();
    } catch (error) {
      console.warn('Failed to delete agent from database:', error);
      this.state.agents = this.state.agents.filter(a => a.id !== id);
      this.saveAgentsToStorage();
      this.notify();
    }
  }
  
  getMatches() {
    return this.state.matches;
  }
  
  async createDebate(topic, participantIds) {
    try {
      const debate = await createDebate(topic, participantIds);
      this.state.matches.unshift(debate);
      this.notify();
      return debate;
    } catch (error) {
      console.warn('Failed to create debate in database:', error);
      const debate = {
        id: 'debate-' + Date.now(),
        title: `辩论: ${topic.substring(0, 30)}...`,
        topic,
        participants: participantIds,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      this.state.matches.unshift(debate);
      this.saveMatchesToStorage();
      this.notify();
      return debate;
    }
  }
  
  async addDebateRound(debateId, agentId, content) {
    try {
      return await addDebateRound(debateId, agentId, content);
    } catch (error) {
      console.warn('Failed to add debate round:', error);
      return null;
    }
  }
  
  async setDebateWinner(debateId, winnerId) {
    try {
      const debate = await setDebateWinner(debateId, winnerId);
      const index = this.state.matches.findIndex(m => m.id === debateId);
      if (index !== -1) {
        this.state.matches[index] = debate;
      }
      this.notify();
      return debate;
    } catch (error) {
      console.warn('Failed to set debate winner:', error);
      const index = this.state.matches.findIndex(m => m.id === debateId);
      if (index !== -1) {
        this.state.matches[index].winner_id = winnerId;
        this.state.matches[index].status = 'completed';
      }
      this.saveMatchesToStorage();
      this.notify();
      return this.state.matches[index];
    }
  }
  
  async createQuiz(title, participantIds) {
    try {
      const quiz = await createQuiz(title, participantIds);
      this.state.matches.unshift(quiz);
      this.notify();
      return quiz;
    } catch (error) {
      console.warn('Failed to create quiz in database:', error);
      const quiz = {
        id: 'quiz-' + Date.now(),
        title,
        participants: participantIds,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      this.state.matches.unshift(quiz);
      this.saveMatchesToStorage();
      this.notify();
      return quiz;
    }
  }
  
  async addQuizQuestion(quizId, question, correctAnswer, options = []) {
    try {
      return await addQuizQuestion(quizId, question, correctAnswer, options);
    } catch (error) {
      console.warn('Failed to add quiz question:', error);
      return null;
    }
  }
  
  async submitQuizAnswer(quizId, agentId, questionId, answer, timeTaken) {
    try {
      return await submitQuizAnswer(quizId, agentId, questionId, answer, timeTaken);
    } catch (error) {
      console.warn('Failed to submit quiz answer:', error);
      return { isCorrect: false, score: 0 };
    }
  }
  
  async setQuizWinner(quizId, winnerId) {
    try {
      const quiz = await setQuizWinner(quizId, winnerId);
      const index = this.state.matches.findIndex(m => m.id === quizId);
      if (index !== -1) {
        this.state.matches[index] = quiz;
      }
      this.notify();
      return quiz;
    } catch (error) {
      console.warn('Failed to set quiz winner:', error);
      const index = this.state.matches.findIndex(m => m.id === quizId);
      if (index !== -1) {
        this.state.matches[index].winner_id = winnerId;
        this.state.matches[index].status = 'completed';
      }
      this.saveMatchesToStorage();
      this.notify();
      return this.state.matches[index];
    }
  }
  
  saveAgentsToStorage() {
    localStorage.setItem('ai-arena-agents', JSON.stringify(this.state.agents));
  }
  
  saveMatchesToStorage() {
    localStorage.setItem('ai-arena-matches', JSON.stringify(this.state.matches));
  }
  
  onChange(callback) {
    this.listeners.push(callback);
  }
  
  notify() {
    this.listeners.forEach(cb => cb());
  }
}