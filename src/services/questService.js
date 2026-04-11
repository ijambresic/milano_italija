
const pool = require('../config/db');

async function createQuest({ title, description, reward, max_reward, deadline }) {
  await pool.query(
    `INSERT INTO quests (title, description, reward, max_reward, deadline)
     VALUES ($1, $2, $3, $4, $5)`,
    [title, description, reward, max_reward, deadline]
  );
}

async function getAllQuests() {
  const { rows } = await pool.query('SELECT * FROM quests');
  return rows;
}

async function submitQuest(questId) {
  const { rows } = await pool.query('SELECT * FROM submitted_quests WHERE quest_id = $1', [questId]);
  const quest = rows[0];
  if (!quest) {
    await pool.query('INSERT INTO submitted_quests (quest_id, submission_time, status) VALUES ($1, NOW(), $2)', [questId, 'pending']);
  } else {
    await pool.query('UPDATE submitted_quests SET submission_time = NOW(), status = $1 WHERE quest_id = $2', ['pending', questId]);
  }
}

async function getStatus(questId) {
  const { rows } = await pool.query('SELECT status FROM submitted_quests WHERE quest_id = $1', [questId]);
  const result = rows[0];
  if (!result || result.status === 'reviewed') return 1; // not submitted
  return 0; // in review
}

async function deleteQuest(questId) {
  await pool.query('DELETE FROM submitted_quests WHERE quest_id = $1', [questId]);
  await pool.query('DELETE FROM quests WHERE id = $1', [questId]);
}

async function getPendingSubmissions() {
  const { rows } = await pool.query(`
    SELECT sq.*, q.title, q.description, q.reward, q.deadline
    FROM submitted_quests sq
    JOIN quests q ON sq.quest_id = q.id
    WHERE sq.status = 'pending'
  `);
  return rows;
}

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
}

module.exports = {
  createQuest,
  getAllQuests,
  submitQuest,
  getStatus,
  deleteQuest,
  getPendingSubmissions,
  reviewSubmission
};
