const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  deleteQuest,
  submitQuest,
  createQuest,
} = require('../services/questService');

const router = express.Router();


router.post('/', requireRole('admin'), async (req, res) => {
  await createQuest(req.body);
  res.redirect('/dashboard');
});


router.post('/:id/submit', requireRole('player'), async (req, res) => {
  await submitQuest(req.params.id);
  res.redirect('/dashboard');
});


router.post('/:id/delete', requireRole('admin'), async (req, res) => {
  await deleteQuest(req.params.id);
  res.redirect('/dashboard');
});

module.exports = router;
