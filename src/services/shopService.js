const db = require('../config/db');

function getAllShopItems() {
  const stmt = db.prepare('SELECT * FROM shop_items');
  return stmt.all();
}

module.exports = {
  getAllShopItems,
};
