const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getAllQuests, getStatus } = require('../services/questService');
const { getAllEvents } = require('../services/eventService');
const e = require('express');

const router = express.Router();

router.get('/dashboard', requireAuth, (req, res) => {
  const quests = getAllQuests();
  const events = getAllEvents();
  if (req.currentUser.role === 'admin') {
    return res.render('dashboard-admin', {
      title: 'Admin Dashboard',
      quests,
      events
    });
  }

  const questStatus = quests.map(q => {
    const status = getStatus(q.id);
    return { ...q, status };
  });

  console.log('Quest Status:', questStatus);

  return res.render('dashboard-player', {
    title: 'Player Dashboard',
    quests,
    events,
    questStatus
  });
});

module.exports = router;
