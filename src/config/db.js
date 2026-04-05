const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let memoryDb = null;

async function getDbConnection() {
  if (memoryDb) return memoryDb;
  
  memoryDb = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await memoryDb.run('PRAGMA foreign_keys = ON');
  
  return memoryDb;
}

module.exports = { getDbConnection };
