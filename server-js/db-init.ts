import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users2 (
      user_id INTEGER PRIMARY KEY,
      start_date TEXT,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      language_code TEXT,
      wallet_address TEXT,
      public_key TEXT,
      account_information TEXT,
      proof TEXT
    );
  `);

  console.log('Database initialized');
})();
