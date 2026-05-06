# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-05-06

### Added

- ✨ Turso数据库集成支持
- ✨ 新建 `js/database.js` - Turso数据库连接配置
- ✨ 新建 `js/api.js` - 数据库操作API
- ✨ 数据库表结构设计：ai_agents, debate_matches, debate_participants, debate_rounds, quiz_matches, quiz_participants, quiz_questions
- ✨ 支持自动初始化数据库表
- ✨ 集成@libsql/client SDK
- ✨ 支持环境变量配置数据库连接

### Changed

- 🔄 更新 `js/store.js` - 支持Turso数据库和localStorage双模式
- 🔄 更新 `js/app.js` - 初始化时连接数据库
- 🔄 更新 `index.html` - 添加Turso SDK引用和环境变量配置
- 🔄 当Turso未配置时自动回退到localStorage模式

### Database Schema

```sql
ai_agents (id, name, provider, api_key, model, description, avatar, created_at, updated_at)
debate_matches (id, title, topic, status, winner_id, created_at)
debate_participants (debate_id, agent_id, role, score)
debate_rounds (id, debate_id, round_number, agent_id, content, timestamp)
quiz_matches (id, title, status, winner_id, created_at)
quiz_participants (quiz_id, agent_id, score, correct_answers)
quiz_questions (id, quiz_id, question, correct_answer, options, agent_id, answer, is_correct, time_taken)
```

## [1.2.0] - 2026-05-05

### Added

- ✨ GitHub Actions自动部署配置
- ✨ Windows部署脚本 `deploy.bat`
- ✨ 部署说明文档 `DEPLOY.md`
- ✨ 项目README.md
- ✨ 推送到main分支自动触发GitHub Pages部署

### Deployment

- 配置GitHub Actions工作流自动部署
- 支持一键部署脚本
- 完整的部署指南

## [1.1.0] - 2026-05-05

### Added

- ✨ 全新AI擂台功能：辩论赛和知识抢答
- ✨ 智能体管理系统：创建、编辑、删除AI智能体
- ✨ 支持多种AI提供商：OpenAI、Claude、DeepSeek、Kimi、智谱AI
- ✨ 辩论赛功能：选择2-4个智能体参赛，指定裁判，多轮辩论
- ✨ 知识抢答功能：选择2-6个智能体参赛，裁判出题，实时计分
- ✨ 历史记录功能：查看过往比赛记录
- ✨ 深色/浅色主题切换
- ✨ 响应式设计，支持移动端

### Changed

- 🔄 将原AI工具合集整合为"AI合集"板块
- 🔄 优化导航结构，支持多页面路由

### Technical

- 纯前端实现（HTML/CSS/JS）
- 本地存储智能体和比赛数据
- 模块化页面组件设计

## [1.0.0] - 2026-05-05

### Added

- ✨ 新建 AI Hub 项目主页
- ✨ 创建项目推荐区域，展示多个AI相关项目
- ✨ 添加版本号标识功能
- ✨ 创建归档目录，整合原有 YanAI 工具合集项目

### Projects Added

1. **YanAI - AI工具合集** - 精选全网免费AI工具
2. **AI Chatbot** - 智能对话机器人
3. **AI Image Generator** - AI图像生成工具
4. **Code Assistant** - AI代码助手
5. **Music Generator** - AI音乐创作工具
6. **Data Analyzer** - AI数据分析平台

### Archive

- 将原仓库内容完整迁移至 `archive/` 目录
- 保留原有功能：AI工具列表、分类浏览、搜索功能、主题切换