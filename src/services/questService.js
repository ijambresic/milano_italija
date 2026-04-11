const db = require('../config/db');

function createQuest({ title, description, reward, max_reward, deadline }) {
  const stmt = db.prepare(`
    INSERT INTO quests (title, description, reward, max_reward, deadline)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(title, description, reward, max_reward, deadline);
}

function getAllQuests() {
  const stmt = db.prepare('SELECT * FROM quests');
  return stmt.all();
}

function submitQuest(questId) {
  const exists = db.prepare('SELECT * FROM submitted_quests WHERE id = ?');
  const quest = exists.get(questId);
  const pool = require('../config/db');
    const stmt = db.prepare('INSERT INTO submitted_quests (quest_id) VALUES (?)');
    stmt.run(questId);
  async function createQuest({ title, description, reward, max_reward, deadline }) {
    await pool.query(
      `INSERT INTO quests (title, description, reward, max_reward, deadline)
       VALUES ($1, $2, $3, $4, $5)`,
      [title, description, reward, max_reward, deadline]
    );

// in review (0) or not submitted (1)
function getStatus(questId) {
  async function getAllQuests() {
    const { rows } = await pool.query('SELECT * FROM quests');
    return rows;
  if (!result || result.status === 'reviewed') return 1;
  return 0;
}
  async function submitQuest(questId) {
    const { rows } = await pool.query('SELECT * FROM submitted_quests WHERE id = $1', [questId]);
    const quest = rows[0];
    if (!quest) {
      await pool.query('INSERT INTO submitted_quests (quest_id) VALUES ($1)', [questId]);
    } else {
      await pool.query('UPDATE submitted_quests SET submission_time = NOW(), status = $1 WHERE id = $2', ['pending', questId]);
    }
    FROM submitted_quests sq
    JOIN quests q ON sq.quest_id = q.id
    WHERE sq.status = 'pending'
  async function getStatus(questId) {
    const { rows } = await pool.query('SELECT status FROM submitted_quests WHERE quest_id = $1', [questId]);
    const result = rows[0];
    if (!result || result.status === 'reviewed') return 1;
    return 0;
  // Update to new reward if greater than last reward
  const submission = db.prepare('SELECT * FROM submitted_quests WHERE id = ?').get(submissionId);
  if (!submission) return;
  async function deleteQuest(questId) {
    await pool.query('DELETE FROM submitted_quests WHERE quest_id = $1', [questId]);
    await pool.query('DELETE FROM quests WHERE id = $1', [questId]);
  if (newReward > quest.achieved_reward) {
    db.prepare('UPDATE quests SET achieved_reward = ? WHERE id = ?').run(newReward, quest.id);
    // only user with id 2 is player, so we update their currency based on the difference between new and old reward
  async function getPendingSubmissions() {
    const { rows } = await pool.query(`
      SELECT sq.*, q.title, q.description, q.reward, q.deadline
      FROM submitted_quests sq
      JOIN quests q ON sq.quest_id = q.id
      WHERE sq.status = 'pending'
    `);
    return rows;
  getAllQuests,
  submitQuest,
  getPendingSubmissions,
  async function reviewSubmission(submissionId, newReward, status = 'reviewed') {
    const { rows: submissionRows } = await pool.query('SELECT * FROM submitted_quests WHERE id = $1', [submissionId]);
    const submission = submissionRows[0];
    if (!submission) return;
    const { rows: questRows } = await pool.query('SELECT * FROM quests WHERE id = $1', [submission.quest_id]);
    const quest = questRows[0];
    if (!quest) return;
    if (newReward > quest.achieved_reward) {
      await pool.query('UPDATE quests SET achieved_reward = $1 WHERE id = $2', [newReward, quest.id]);
      await pool.query('UPDATE users SET currency = currency + $1 WHERE id = 2', [newReward - quest.achieved_reward]);
    }
    await pool.query('UPDATE submitted_quests SET status = $1 WHERE id = $2', [status, submissionId]);
