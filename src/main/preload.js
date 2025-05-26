// src/renderer/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // === Product Types CRUD ===
  getProductTypes:    ()                           => ipcRenderer.invoke('get-product-types'),
  createProductType:  (data)                       => ipcRenderer.invoke('create-product-type', data),
  updateProductType:  (data)                       => ipcRenderer.invoke('update-product-type', data),
  deleteProductType:  (id)                         => ipcRenderer.invoke('delete-product-type', id),

  // === Material Types CRUD ===
  getMaterialTypes:   ()                           => ipcRenderer.invoke('get-material-types'),
  createMaterialType: (data)                       => ipcRenderer.invoke('create-material-type', data),
  updateMaterialType: (data)                       => ipcRenderer.invoke('update-material-type', data),
  deleteMaterialType: (id)                         => ipcRenderer.invoke('delete-material-type', id),

  // === Partner Types CRUD ===
  getPartnerTypes:    ()                           => ipcRenderer.invoke('get-partner-types'),
  createPartnerType:  (data)                       => ipcRenderer.invoke('create-partner-type', data),
  updatePartnerType:  (data)                       => ipcRenderer.invoke('update-partner-type', data),
  deletePartnerType:  (id)                         => ipcRenderer.invoke('delete-partner-type', id),

  // === Products CRUD ===
  getProducts:        ()                           => ipcRenderer.invoke('get-products'),
  createProduct:      (data)                       => ipcRenderer.invoke('create-product', data),
  updateProduct:      (data)                       => ipcRenderer.invoke('update-product', data),
  deleteProduct:      (id)                         => ipcRenderer.invoke('delete-product', id),

  // === Partners CRUD ===
  getPartners:        ()                           => ipcRenderer.invoke('get-partners'),
  createPartner:      (data)                       => ipcRenderer.invoke('create-partner', data),
  updatePartner:      (data)                       => ipcRenderer.invoke('update-partner', data),
  deletePartner:      (id)                         => ipcRenderer.invoke('delete-partner', id),

  // === Partner Sales ===
  getPartnerSales:    ()                           => ipcRenderer.invoke('get-partner-sales'),
  getSalesByPartner:  (partnerId)                  => ipcRenderer.invoke('get-sales-by-partner', partnerId),
  getSalesByProduct:  (productId)                  => ipcRenderer.invoke('get-sales-by-product', productId),
  createPartnerSale:  (data)                       => ipcRenderer.invoke('create-partner-sale', data),
  updatePartnerSale:  (data)                       => ipcRenderer.invoke('update-partner-sale', data),
  deletePartnerSale:  (id)                         => ipcRenderer.invoke('delete-partner-sale', id),

});
