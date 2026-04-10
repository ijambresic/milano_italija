const db = require('../config/db');

function getAllShopItems() {
  const stmt = db.prepare('SELECT * FROM shop_items');
  return stmt.all();
}

function buyItem(itemId) {
  const item = db.prepare('SELECT * FROM shop_items WHERE id = ?').get(itemId);
  if (!item || item.status === 'bought') return false;
  const user = db.prepare('SELECT * FROM users WHERE id = 2').get();
  if (user.currency < item.price) return false;
  db.prepare('UPDATE shop_items SET status = \'bought\' WHERE id = ?').run(itemId);
  db.prepare('UPDATE users SET currency = currency - ? WHERE id = 2').run(item.price);
  return true;
}

function createItem(itemData) {
  const stmt = db.prepare('INSERT INTO shop_items (name, description, price) VALUES (?, ?, ?)');
  stmt.run(itemData.name, itemData.description, itemData.price);
}

module.exports = {
  getAllShopItems,
  buyItem,
  createItem
};
