const path    = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../db/data.sqlite');
const db     = new sqlite3.Database(dbPath, err => {
  if (err) console.error('Ошибка открытия БД:', err);
});

// Промисифицированные обёртки
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// === Product Types ===
async function getAllProductTypes() {
  return all(`SELECT id, name, coefficient FROM product_type ORDER BY id`);
}
async function createProductType({ name, coefficient }) {
  const info = await run(
    `INSERT INTO product_type (name, coefficient) VALUES (?, ?)`,
    [name, coefficient]
  );
  return { id: info.lastID };
}
async function updateProductType({ id, name, coefficient }) {
  await run(
    `UPDATE product_type SET name = ?, coefficient = ? WHERE id = ?`,
    [name, coefficient, id]
  );
  return { success: true };
}
async function deleteProductType(id) {
  await run(`DELETE FROM product_type WHERE id = ?`, [id]);
  return { success: true };
}

// === Material Types ===
async function getAllMaterialTypes() {
  return all(`SELECT id, name, defect_percent FROM material_type ORDER BY id`);
}
async function createMaterialType({ name, defect_percent }) {
  const info = await run(
    `INSERT INTO material_type (name, defect_percent) VALUES (?, ?)`,
    [name, defect_percent]
  );
  return { id: info.lastID };
}
async function updateMaterialType({ id, name, defect_percent }) {
  await run(
    `UPDATE material_type SET name = ?, defect_percent = ? WHERE id = ?`,
    [name, defect_percent, id]
  );
  return { success: true };
}
async function deleteMaterialType(id) {
  await run(`DELETE FROM material_type WHERE id = ?`, [id]);
  return { success: true };
}

// === Partner Types ===
async function getAllPartnerTypes() {
  return all(`SELECT id, name FROM partner_type ORDER BY id`);
}
async function createPartnerType({ name }) {
  const info = await run(
    `INSERT INTO partner_type (name) VALUES (?)`,
    [name]
  );
  return { id: info.lastID };
}
async function updatePartnerType({ id, name }) {
  await run(
    `UPDATE partner_type SET name = ? WHERE id = ?`,
    [name, id]
  );
  return { success: true };
}
async function deletePartnerType(id) {
  await run(`DELETE FROM partner_type WHERE id = ?`, [id]);
  return { success: true };
}

// === Products ===
async function getAllProducts() {
  return all(
    `SELECT p.id, p.sku, p.name, pt.id AS product_type_id, pt.name AS product_type, p.min_price_partner
     FROM product p
     JOIN product_type pt ON p.product_type_id = pt.id
     ORDER BY p.id`
  );
}
async function createProduct({ sku, name, product_type_id, min_price_partner = null }) {
  const info = await run(
    `INSERT INTO product (sku, name, product_type_id, min_price_partner) VALUES (?, ?, ?, ?)`,
    [sku, name, product_type_id, min_price_partner]
  );
  return { id: info.lastID };
}
async function updateProduct({ id, sku, name, product_type_id, min_price_partner }) {
  await run(
    `UPDATE product SET sku = ?, name = ?, product_type_id = ?, min_price_partner = ? WHERE id = ?`,
    [sku, name, product_type_id, min_price_partner, id]
  );
  return { success: true };
}
async function deleteProduct(id) {
  await run(`DELETE FROM product WHERE id = ?`, [id]);
  return { success: true };
}

// === Partners ===
async function getAllPartners() {
  return all(
    `SELECT pr.id, pr.company_name, pt.id AS type_id, pt.name AS type, pr.legal_address,
            pr.inn, pr.director_fullname, pr.phone, pr.email, pr.rating, pr.sales_channels
     FROM partner pr
     JOIN partner_type pt ON pr.type_id = pt.id
     ORDER BY pr.id`
  );
}
async function createPartner({ type_id, company_name, legal_address = null, inn = null,
                               director_fullname = null, phone = null, email = null,
                               logo = null, rating = 0, sales_channels = null }) {
  const info = await run(
    `INSERT INTO partner
       (type_id, company_name, legal_address, inn,
        director_fullname, phone, email, logo, rating, sales_channels)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [type_id, company_name, legal_address, inn,
     director_fullname, phone, email, logo, rating, sales_channels]
  );
  return { id: info.lastID };
}
async function updatePartner({ id, type_id, company_name, legal_address, inn,
                               director_fullname, phone, email, logo, rating, sales_channels }) {
  await run(
    `UPDATE partner SET
       type_id           = ?,
       company_name      = ?,
       legal_address     = ?,
       inn               = ?,
       director_fullname = ?,
       phone             = ?,
       email             = ?,
       logo              = ?,
       rating            = ?,
       sales_channels    = ?
     WHERE id = ?`,
    [type_id, company_name, legal_address, inn,
     director_fullname, phone, email, logo, rating, sales_channels, id]
  );
  return { success: true };
}
async function deletePartner(id) {
  await run(`DELETE FROM partner WHERE id = ?`, [id]);
  return { success: true };
}

// === Partner Sales ===
async function getAllPartnerSales() {
  return all(
    `SELECT ps.id,
            pr.id AS partner_id, pr.company_name,
            p.id AS product_id, p.name AS product_name,
            ps.sale_date, ps.quantity, ps.revenue
     FROM partner_sales ps
     JOIN partner pr ON ps.partner_id = pr.id
     JOIN product p ON ps.product_id = p.id
     ORDER BY ps.sale_date DESC`
  );
}
async function getSalesByPartner(partner_id) {
  return all(
    `SELECT * FROM partner_sales WHERE partner_id = ? ORDER BY sale_date DESC`,
    [partner_id]
  );
}
async function getSalesByProduct(product_id) {
  return all(
    `SELECT * FROM partner_sales WHERE product_id = ? ORDER BY sale_date DESC`,
    [product_id]
  );
}
async function createPartnerSale({ partner_id, product_id, sale_date, quantity, revenue }) {
  const info = await run(
    `INSERT INTO partner_sales
       (partner_id, product_id, sale_date, quantity, revenue)
     VALUES (?, ?, ?, ?, ?)`,
    [partner_id, product_id, sale_date, quantity, revenue]
  );
  return { id: info.lastID };
}
async function updatePartnerSale({ id, partner_id, product_id, sale_date, quantity, revenue }) {
  await run(
    `UPDATE partner_sales SET
       partner_id = ?,
       product_id = ?,
       sale_date   = ?,
       quantity    = ?,
       revenue     = ?
     WHERE id = ?`,
    [partner_id, product_id, sale_date, quantity, revenue, id]
  );
  return { success: true };
}
async function deletePartnerSale(id) {
  await run(`DELETE FROM partner_sales WHERE id = ?`, [id]);
  return { success: true };
}

module.exports = {
  // Product Types
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
  // Material Types
  getAllMaterialTypes,
  createMaterialType,
  updateMaterialType,
  deleteMaterialType,
  // Partner Types
  getAllPartnerTypes,
  createPartnerType,
  updatePartnerType,
  deletePartnerType,
  // Products
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  // Partners
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner,
  // Partner Sales
  getAllPartnerSales,
  getSalesByPartner,
  getSalesByProduct,
  createPartnerSale,
  updatePartnerSale,
  deletePartnerSale
};
