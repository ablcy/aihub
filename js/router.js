export class Router {
  constructor() {
    this.currentPage = 'home';
    this.listeners = [];
    this.init();
  }
  
  init() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'home';
      this.currentPage = hash;
      this.notify();
    });
    
    const hash = window.location.hash.slice(1) || 'home';
    this.currentPage = hash;
  }
  
  navigate(page) {
    this.currentPage = page;
    window.location.hash = page;
    this.notify();
  }
  
  getCurrentPage() {
    return this.currentPage;
  }
  
  onNavigate(callback) {
    this.listeners.push(callback);
  }
  
  notify() {
    this.listeners.forEach(cb => cb());
  }
}