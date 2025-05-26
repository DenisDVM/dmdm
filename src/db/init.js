// src/db/init.js

const sqlite3 = require('sqlite3').verbose();
const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcryptjs');

const dbDir      = __dirname;
const dbFile     = path.join(dbDir, 'data.sqlite');
const schemaFile = path.join(dbDir, 'schema.sql');

// Создаём файл БД, если его нет
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, '');
}

const db = new sqlite3.Database(dbFile, err => {
  if (err) {
    console.error('Ошибка открытия БД:', err);
    return;
  }

  db.serialize(() => {
    // Включаем внешние ключи
    db.run('PRAGMA foreign_keys = ON;');

    // Загружаем и выполняем схему
    const schema = fs.readFileSync(schemaFile, 'utf-8');
    db.exec(schema, err => {
      if (err) {
        console.error('Ошибка создания схемы:', err);
        return;
      }
    });
  });
});
