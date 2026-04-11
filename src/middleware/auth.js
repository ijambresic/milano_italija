const { findUserById } = require('../services/userService');

async function attachCurrentUser(req, res, next) {
  const userId = req.session.userId;
  if (!userId) {
    req.currentUser = null;
    res.locals.currentUser = null;
    return next();
  }

  const user = await findUserById(userId);
  req.currentUser = user || null;
  res.locals.currentUser = user || null;
  next();
}

function requireAuth(req, res, next) {
  if (!req.currentUser) return res.redirect('/login');
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.currentUser) return res.redirect('/login');
    if (req.currentUser.role !== role) return res.status(403).render('403', { title: 'Forbidden' });
    next();
  };
}

module.exports = {
  attachCurrentUser,
  requireAuth,
  requireRole
};
