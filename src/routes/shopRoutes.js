const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  getAllShopItems,
} = require('../services/shopService');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const items = getAllShopItems();
  res.render('shop', { title: 'Shop', items });
});
/*
router.post('/', requireRole('admin'), (req, res) => {
  createShopItemPlaceholder(req.body);
  res.redirect('/shop');
});

router.post('/:id/buy', requireRole('player'), (req, res) => {
  purchaseItemPlaceholder(req.params.id, req.currentUser.id);
  res.redirect('/shop');
});
*/
module.exports = router;
