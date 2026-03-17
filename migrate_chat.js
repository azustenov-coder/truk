import Database from 'better-sqlite3';
const db = new Database('logistics.db');
try {
  db.exec('ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT 0');
  console.log('Migration successful: added is_read column to messages table');
} catch (e) {
  if (e.message.includes('duplicate column name')) {
    console.log('Column is_read already exists');
  } else {
    console.error('Migration failed:', e.message);
  }
}
db.close();
