import { createClient } from '@libsql/client/web';

const env = window.__ENV__ || {};
const config = {
  url: env.TURSO_DATABASE_URL || '',
  authToken: env.TURSO_AUTH_TOKEN || ''
};

export const turso = config.url ? createClient(config) : null;

export async function initDatabase() {
  if (!turso) {
    console.log('Turso database not configured, using localStorage fallback');
    return;
  }
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS ai_agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        api_key TEXT,
        model TEXT,
        description TEXT,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS debate_matches (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        topic TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        winner_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (winner_id) REFERENCES ai_agents(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS debate_participants (
        debate_id TEXT,
        agent_id TEXT,
        role TEXT,
        score INTEGER DEFAULT 0,
        FOREIGN KEY (debate_id) REFERENCES debate_matches(id),
        FOREIGN KEY (agent_id) REFERENCES ai_agents(id),
        PRIMARY KEY (debate_id, agent_id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS debate_rounds (
        id TEXT PRIMARY KEY,
        debate_id TEXT,
        round_number INTEGER,
        agent_id TEXT,
        content TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (debate_id) REFERENCES debate_matches(id),
        FOREIGN KEY (agent_id) REFERENCES ai_agents(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS quiz_matches (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        winner_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (winner_id) REFERENCES ai_agents(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS quiz_participants (
        quiz_id TEXT,
        agent_id TEXT,
        score INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        FOREIGN KEY (quiz_id) REFERENCES quiz_matches(id),
        FOREIGN KEY (agent_id) REFERENCES ai_agents(id),
        PRIMARY KEY (quiz_id, agent_id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id TEXT PRIMARY KEY,
        quiz_id TEXT,
        question TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        options TEXT,
        agent_id TEXT,
        answer TEXT,
        is_correct BOOLEAN DEFAULT FALSE,
        time_taken INTEGER,
        FOREIGN KEY (quiz_id) REFERENCES quiz_matches(id),
        FOREIGN KEY (agent_id) REFERENCES ai_agents(id)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}