const db = require('../config/db');

function getAllEvents() {
  const stmt = db.prepare('SELECT * FROM events');
  return stmt.all();
}

function createEvent({ title, description, event_start, event_end, reward }) {
  console.log('Creating event with data:', { title, description, event_start, event_end, reward });
  const stmt = db.prepare(`
    INSERT INTO events (title, description, event_start, event_end, reward)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(title, description, event_start, event_end, reward);
}

function deleteEvent(eventId) {
  db.prepare('DELETE FROM events WHERE id = ?').run(eventId);
}

function awardEvent(eventId, reward) {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  if (!event) return;
  if (reward < event.reward_achieved) return;
  db.prepare('UPDATE events SET reward_achieved = ? WHERE id = ?').run(reward, eventId);
  db.prepare('UPDATE users SET currency = currency + ? WHERE id = 2').run(reward - event.reward_achieved);
}

module.exports = {
  getAllEvents,
  createEvent,
  deleteEvent,
  awardEvent,
};
