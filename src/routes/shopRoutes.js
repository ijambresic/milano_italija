const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  getAllShopItems,
  createItem,
  purchaseItemPlaceholder,
} = require('../services/shopService');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const items = getAllShopItems();
  res.render('shop', { title: 'Shop', items });
});

router.post('/', requireRole('admin'), (req, res) => {
  createItem(req.body);
  res.redirect('/shop');
});

router.post('/:id/buy', requireRole('player'), (req, res) => {
  purchaseItemPlaceholder(req.params.id, req.currentUser.id);
  res.redirect('/shop');
});
//nis
module.exports = router;
