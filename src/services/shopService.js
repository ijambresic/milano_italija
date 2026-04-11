const pool = require('../config/db');

async function getAllShopItems() {
  const { rows } = await pool.query('SELECT * FROM shop_items');
  return rows;
}

async function buyItem(itemId) {
  const { rows: itemRows } = await pool.query('SELECT * FROM shop_items WHERE id = $1', [itemId]);
  const item = itemRows[0];
  if (!item || item.status === 'bought') return false;
  const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = 2');
  const user = userRows[0];
  if (user.currency < item.price) return false;
  await pool.query('UPDATE shop_items SET status = $1 WHERE id = $2', ['bought', itemId]);
  await pool.query('UPDATE users SET currency = currency - $1 WHERE id = 2', [item.price]);
  return true;
}

async function createItem(itemData) {
  await pool.query(
    'INSERT INTO shop_items (name, description, price) VALUES ($1, $2, $3)',
    [itemData.name, itemData.description, itemData.price]
  );
}

module.exports = {
  getAllShopItems,
  buyItem,
  createItem
};
