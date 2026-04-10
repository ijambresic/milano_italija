const express = require('express');
const { requireRole } = require('../middleware/auth');
const { getPendingSubmissions, reviewSubmission } = require('../services/questService');

const router = express.Router();

router.get('/reviews', requireRole('admin'), (req, res) => {
  const submissions = getPendingSubmissions();
  res.render('reviews', { title: 'Pending Reviews', submissions });
});

router.post('/reviews/:id', requireRole('admin'), (req, res) => {
  const { newReward } = req.body;
  reviewSubmission(req.params.id, newReward || 0, 'reviewed');
  res.redirect('/reviews');
});

module.exports = router;