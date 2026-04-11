const express = require('express');
const bcrypt = require('bcryptjs');
const { findUserByUsername } = require('../services/userService');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.currentUser) return res.redirect('/dashboard');
  res.render('login', { title: 'Login', error: null });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);

  if (!user) {
    return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  return res.redirect('/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
