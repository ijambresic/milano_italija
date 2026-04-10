const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  deleteQuest,
  submitQuest,
  createQuest,
} = require('../services/questService');

const router = express.Router();

router.post('/', requireRole('admin'), (req, res) => {
  createQuest(req.body);
  res.redirect('/dashboard');
});

router.post('/:id/submit', requireRole('player'), (req, res) => {
  submitQuest(req.params.id);
  res.redirect('/dashboard');
});

router.post('/:id/delete', requireRole('admin'), (req, res) => {
  deleteQuest(req.params.id);
  res.redirect('/dashboard');
});

module.exports = router;
