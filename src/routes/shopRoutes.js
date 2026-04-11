const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  getAllShopItems,
  createItem,
  purchaseItemPlaceholder,
} = require('../services/shopService');

const router = express.Router();


router.get('/', requireAuth, async (req, res) => {
  const items = await getAllShopItems();
  res.render('shop', { title: 'Shop', items });
});


router.post('/', requireRole('admin'), async (req, res) => {
  await createItem(req.body);
  res.redirect('/shop');
});


router.post('/:id/buy', requireRole('player'), async (req, res) => {
  await purchaseItemPlaceholder(req.params.id, req.currentUser.id);
  res.redirect('/shop');
});
//nis
module.exports = router;
