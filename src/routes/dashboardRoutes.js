const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getAllQuests, getStatus } = require('../services/questService');
const { getAllEvents } = require('../services/eventService');
const e = require('express');

const router = express.Router();

router.get('/dashboard', requireAuth, async (req, res) => {
  const quests = await getAllQuests();
  const events = await getAllEvents();
  if (req.currentUser.role === 'admin') {
    return res.render('dashboard-admin', {
      title: 'Admin Dashboard',
      quests,
      events
    });
  }

  const questStatus = await Promise.all(quests.map(async q => {
    const status = await getStatus(q.id);
    return { ...q, status };
  }));

  console.log('Quest Status:', questStatus);

  return res.render('dashboard-player', {
    title: 'Player Dashboard',
    quests,
    events,
    questStatus
  });
});

module.exports = router;
