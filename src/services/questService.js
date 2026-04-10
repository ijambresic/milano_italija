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
  if (!quest) {
    const stmt = db.prepare('INSERT INTO submitted_quests (quest_id) VALUES (?)');
    stmt.run(questId);
  } else {
    const stmt = db.prepare('UPDATE submitted_quests SET submission_time = CURRENT_TIMESTAMP, status = \'pending\' WHERE id = ?');
    stmt.run(questId);
  }
}

// in review (0) or not submitted (1)
function getStatus(questId) {
  const stmt = db.prepare('SELECT status FROM submitted_quests WHERE quest_id = ?');
  const result = stmt.get(questId);
  if (!result || result.status === 'reviewed') return 1;
  return 0;
}

function deleteQuest(questId) {
  db.prepare('DELETE FROM submitted_quests WHERE quest_id = ?').run(questId);
  db.prepare('DELETE FROM quests WHERE id = ?').run(questId);
}

function getPendingSubmissions() {
  const stmt = db.prepare(`
    SELECT sq.*, q.title, q.description, q.reward, q.deadline
    FROM submitted_quests sq
    JOIN quests q ON sq.quest_id = q.id
    WHERE sq.status = 'pending'
  `);
  return stmt.all();
}

function reviewSubmission(submissionId, newReward, status = 'reviewed') {
  // Update to new reward if greater than last reward
  const submission = db.prepare('SELECT * FROM submitted_quests WHERE id = ?').get(submissionId);
  if (!submission) return;
  const quest = db.prepare('SELECT * FROM quests WHERE id = ?').get(submission.quest_id);
  if (!quest) return;
  if (newReward > quest.achieved_reward) {
    db.prepare('UPDATE quests SET achieved_reward = ? WHERE id = ?').run(newReward, quest.id);
    // only user with id 2 is player, so we update their currency based on the difference between new and old reward
    db.prepare('UPDATE users SET currency = currency + ? WHERE id = 2').run(newReward - quest.achieved_reward);
  }
  // Update submission status
  db.prepare('UPDATE submitted_quests SET status = ? WHERE id = ?').run(status, submissionId);
}

module.exports = {
  getAllQuests,
  submitQuest,
  getPendingSubmissions,
  reviewSubmission,
  getStatus,
  deleteQuest,
  createQuest,
};
