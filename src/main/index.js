require('../db/init'); // Инициализация БД и заполнение дефолтных данных

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('../renderer/services/db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '../../index.html'));
}

app.whenReady().then(() => {
  createWindow();

  // === Product Types CRUD ===
  ipcMain.handle('get-product-types', () => db.getAllProductTypes());
  ipcMain.handle('create-product-type', (e, data) => db.createProductType(data));
  ipcMain.handle('update-product-type', (e, data) => db.updateProductType(data));
  ipcMain.handle('delete-product-type', (e, id) => db.deleteProductType(id));

  // === Material Types CRUD ===
  ipcMain.handle('get-material-types', () => db.getAllMaterialTypes());
  ipcMain.handle('create-material-type', (e, data) => db.createMaterialType(data));
  ipcMain.handle('update-material-type', (e, data) => db.updateMaterialType(data));
  ipcMain.handle('delete-material-type', (e, id) => db.deleteMaterialType(id));

  // === Partner Types CRUD ===
  ipcMain.handle('get-partner-types', () => db.getAllPartnerTypes());
  ipcMain.handle('create-partner-type', (e, data) => db.createPartnerType(data));
  ipcMain.handle('update-partner-type', (e, data) => db.updatePartnerType(data));
  ipcMain.handle('delete-partner-type', (e, id) => db.deletePartnerType(id));

  // === Products CRUD ===
  ipcMain.handle('get-products', () => db.getAllProducts());
  ipcMain.handle('create-product', (e, data) => db.createProduct(data));
  ipcMain.handle('update-product', (e, data) => db.updateProduct(data));
  ipcMain.handle('delete-product', (e, id) => db.deleteProduct(id));

  // === Partners CRUD ===
  ipcMain.handle('get-partners', () => db.getAllPartners());
  ipcMain.handle('create-partner', (e, data) => db.createPartner(data));
  ipcMain.handle('update-partner', (e, data) => db.updatePartner(data));
  ipcMain.handle('delete-partner', (e, id) => db.deletePartner(id));

  // === Partner Sales ===
  ipcMain.handle('get-partner-sales', () => db.getAllPartnerSales());
  ipcMain.handle('get-sales-by-partner', (e, partnerId) => db.getSalesByPartner(partnerId));
  ipcMain.handle('get-sales-by-product', (e, productId) => db.getSalesByProduct(productId));
  ipcMain.handle('create-partner-sale', (e, data) => db.createPartnerSale(data));
  ipcMain.handle('update-partner-sale', (e, data) => db.updatePartnerSale(data));
  ipcMain.handle('delete-partner-sale', (e, id) => db.deletePartnerSale(id));

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
