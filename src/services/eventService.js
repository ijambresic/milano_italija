
const pool = require('../config/db');


async function getAllEvents() {
  const { rows } = await pool.query('SELECT * FROM events');
  return rows;
}


async function createEvent({ title, description, event_start, event_end, reward }) {
  console.log('Creating event with data:', { title, description, event_start, event_end, reward });
  await pool.query(
    `INSERT INTO events (title, description, event_start, event_end, reward)
     VALUES ($1, $2, $3, $4, $5)`,
    [title, description, event_start, event_end, reward]
  );
}


async function deleteEvent(eventId) {
  await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
}


async function awardEvent(eventId, reward) {
  const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
  const event = rows[0];
  if (!event) return;
  if (reward < event.reward_achieved) return;
  await pool.query('UPDATE events SET reward_achieved = $1 WHERE id = $2', [reward, eventId]);
  await pool.query('UPDATE users SET currency = currency + $1 WHERE id = 2', [reward - event.reward_achieved]);
}

module.exports = {
  getAllEvents,
  createEvent,
  deleteEvent,
  awardEvent,
};
