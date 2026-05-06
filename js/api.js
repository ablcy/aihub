import { turso } from './database.js';

function checkTurso() {
  if (!turso) {
    throw new Error('Turso database not configured');
  }
}

export async function getAgents() {
  checkTurso();
  const result = await turso.execute('SELECT * FROM ai_agents ORDER BY created_at DESC');
  return result.rows;
}

export async function getAgent(id) {
  checkTurso();
  const result = await turso.execute('SELECT * FROM ai_agents WHERE id = ?', [id]);
  return result.rows[0] || null;
}

export async function createAgent(agent) {
  checkTurso();
  const { id, name, provider, api_key, model, description, avatar } = agent;
  await turso.execute(
    'INSERT INTO ai_agents (id, name, provider, api_key, model, description, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, name, provider, api_key, model, description, avatar]
  );
  return getAgent(id);
}

export async function updateAgent(id, updates) {
  checkTurso();
  const fields = [];
  const values = [];
  
  if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.provider) { fields.push('provider = ?'); values.push(updates.provider); }
  if (updates.api_key !== undefined) { fields.push('api_key = ?'); values.push(updates.api_key); }
  if (updates.model) { fields.push('model = ?'); values.push(updates.model); }
  if (updates.description) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.avatar) { fields.push('avatar = ?'); values.push(updates.avatar); }
  fields.push('updated_at = CURRENT_TIMESTAMP');
  
  await turso.execute(
    `UPDATE ai_agents SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id]
  );
  return getAgent(id);
}

export async function deleteAgent(id) {
  checkTurso();
  await turso.execute('DELETE FROM ai_agents WHERE id = ?', [id]);
}

export async function createDebate(topic, participantIds) {
  checkTurso();
  const id = crypto.randomUUID();
  const title = `辩论: ${topic.substring(0, 30)}...`;
  
  await turso.execute(
    'INSERT INTO debate_matches (id, title, topic) VALUES (?, ?, ?)',
    [id, title, topic]
  );
  
  for (const agentId of participantIds) {
    await turso.execute(
      'INSERT INTO debate_participants (debate_id, agent_id, role) VALUES (?, ?, ?)',
      [id, agentId, 'participant']
    );
  }
  
  return getDebate(id);
}

export async function getDebate(id) {
  checkTurso();
  const result = await turso.execute('SELECT * FROM debate_matches WHERE id = ?', [id]);
  return result.rows[0] || null;
}

export async function getDebates() {
  checkTurso();
  const result = await turso.execute('SELECT * FROM debate_matches ORDER BY created_at DESC');
  return result.rows;
}

export async function addDebateRound(debateId, agentId, content) {
  checkTurso();
  const id = crypto.randomUUID();
  const debate = await getDebate(debateId);
  
  if (!debate) throw new Error('Debate not found');
  
  const rounds = await turso.execute(
    'SELECT COUNT(*) as count FROM debate_rounds WHERE debate_id = ?',
    [debateId]
  );
  const roundNumber = (rounds.rows[0]?.count || 0) + 1;
  
  await turso.execute(
    'INSERT INTO debate_rounds (id, debate_id, round_number, agent_id, content) VALUES (?, ?, ?, ?, ?)',
    [id, debateId, roundNumber, agentId, content]
  );
  
  return { id, roundNumber, agentId, content };
}

export async function setDebateWinner(debateId, winnerId) {
  checkTurso();
  await turso.execute(
    'UPDATE debate_matches SET winner_id = ?, status = ? WHERE id = ?',
    [winnerId, 'completed', debateId]
  );
  return getDebate(debateId);
}

export async function createQuiz(title, participantIds) {
  checkTurso();
  const id = crypto.randomUUID();
  
  await turso.execute(
    'INSERT INTO quiz_matches (id, title) VALUES (?, ?)',
    [id, title]
  );
  
  for (const agentId of participantIds) {
    await turso.execute(
      'INSERT INTO quiz_participants (quiz_id, agent_id) VALUES (?, ?)',
      [id, agentId]
    );
  }
  
  return getQuiz(id);
}

export async function getQuiz(id) {
  checkTurso();
  const result = await turso.execute('SELECT * FROM quiz_matches WHERE id = ?', [id]);
  return result.rows[0] || null;
}

export async function getQuizzes() {
  checkTurso();
  const result = await turso.execute('SELECT * FROM quiz_matches ORDER BY created_at DESC');
  return result.rows;
}

export async function addQuizQuestion(quizId, question, correctAnswer, options = []) {
  checkTurso();
  const id = crypto.randomUUID();
  
  await turso.execute(
    'INSERT INTO quiz_questions (id, quiz_id, question, correct_answer, options) VALUES (?, ?, ?, ?, ?)',
    [id, quizId, question, correctAnswer, JSON.stringify(options)]
  );
  
  return { id, question, correctAnswer, options };
}

export async function submitQuizAnswer(quizId, agentId, questionId, answer, timeTaken) {
  checkTurso();
  const question = await turso.execute(
    'SELECT * FROM quiz_questions WHERE id = ?',
    [questionId]
  );
  
  if (!question.rows[0]) throw new Error('Question not found');
  
  const isCorrect = answer === question.rows[0].correct_answer;
  
  await turso.execute(
    'UPDATE quiz_questions SET agent_id = ?, answer = ?, is_correct = ?, time_taken = ? WHERE id = ?',
    [agentId, answer, isCorrect, timeTaken, questionId]
  );
  
  if (isCorrect) {
    await turso.execute(
      'UPDATE quiz_participants SET score = score + 10, correct_answers = correct_answers + 1 WHERE quiz_id = ? AND agent_id = ?',
      [quizId, agentId]
    );
  }
  
  return { isCorrect, score: isCorrect ? 10 : 0 };
}

export async function setQuizWinner(quizId, winnerId) {
  checkTurso();
  await turso.execute(
    'UPDATE quiz_matches SET winner_id = ?, status = ? WHERE id = ?',
    [winnerId, 'completed', quizId]
  );
  return getQuiz(quizId);
}