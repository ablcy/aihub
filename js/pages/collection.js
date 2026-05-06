export class CollectionPage {
  constructor(store, router) {
    this.store = store;
    this.router = router;
  }
  
  render() {
    return `
      <div style="margin-bottom: 24px;">
        <a href="#" data-page="home" style="color: var(--accent); text-decoration: none; font-size: 0.9rem;">← 返回首页</a>
      </div>
      
      <section style="margin-bottom: 32px;">
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">⚡ AI合集</h1>
        <p style="color: var(--text-secondary);">精选全网免费AI工具，涵盖文本生成、图像创作、代码辅助、音视频处理等多个领域</p>
      </section>
      
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
        <iframe 
          src="archive/index.html" 
          style="width: 100%; height: 800px; border: none;"
          title="AI工具合集"
        ></iframe>
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
  }
}