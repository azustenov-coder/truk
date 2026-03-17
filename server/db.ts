import Database from 'better-sqlite3';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const db = new Database(join(process.cwd(), 'logistics.db'));

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS loads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loadId TEXT UNIQUE,
    customer TEXT,
    origin_city TEXT,
    origin_state TEXT,
    origin_location TEXT,
    dest_city TEXT,
    dest_state TEXT,
    dest_location TEXT,
    eta TEXT,
    status TEXT DEFAULT 'PENDING',
    driver_name TEXT,
    driver_id TEXT,
    price REAL DEFAULT 0,
    cargo_type TEXT DEFAULT 'General',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'DISPATCHER',
    full_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    type TEXT DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS truck_positions (
    id TEXT PRIMARY KEY,
    truck_id TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    status TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Expenses table
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    load_id INTEGER,
    truck_id TEXT,
    category TEXT, -- Fuel, Repair, Toll, Other
    amount REAL,
    date TEXT,
    description TEXT,
    FOREIGN KEY(load_id) REFERENCES loads(id)
  )
`);

// Messages table
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT 0,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
  )
`);

// Maintenance table
db.exec(`
  CREATE TABLE IF NOT EXISTS maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    truck_id TEXT,
    type TEXT, -- Oil Change, Inspection, Repair, etc.
    scheduled_date TEXT,
    status TEXT DEFAULT 'Scheduled', -- Scheduled, In Progress, Completed, Cancelled
    notes TEXT
  )
`);

// Insert some seed data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM loads').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO loads (loadId, customer, origin_city, origin_state, origin_location, dest_city, dest_state, dest_location, eta, status, driver_name, driver_id, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run('LD-2024-001', 'Walmart', 'Chicago', 'IL', 'Whse 4', 'Atlanta', 'GA', 'Store 12', '2024-03-20', 'PENDING', '', '', 1500);
  insert.run('LD-2024-002', 'Target', 'Dallas', 'TX', 'Hub A', 'Phoenix', 'AZ', 'DC 5', '2024-03-22', 'ASSIGNED', 'Mike Rodriguez', 'DRV-001', 2200);
  insert.run('LD-2024-003', 'Amazon', 'Seattle', 'WA', 'Fulfillment C', 'Los Angeles', 'CA', 'Port 1', '2024-03-25', 'DELIVERED', 'Jennifer Chen', 'DRV-002', 3500);
}

// Seed truck positions if empty
const positions = db.prepare('SELECT COUNT(*) as count FROM truck_positions').get() as any;
if (positions.count === 0) {
  const initialPositions = [
    { id: '1', truck_id: 'TRK-004', lat: 41.8781, lng: -87.6298, status: 'On Time' },
    { id: '2', truck_id: 'TRK-007', lat: 33.7490, lng: -84.3880, status: 'On Time' },
    { id: '3', truck_id: 'TRK-002', lat: 39.7392, lng: -104.9903, status: 'Delayed' },
    { id: '4', truck_id: 'TRK-015', lat: 33.4484, lng: -112.0740, status: 'On Time' },
    { id: '5', truck_id: 'TRK-009', lat: 25.7617, lng: -80.1918, status: 'On Time' },
  ];
  
  const insert = db.prepare('INSERT INTO truck_positions (id, truck_id, lat, lng, status) VALUES (?, ?, ?, ?, ?)');
  initialPositions.forEach(p => insert.run(p.id, p.truck_id, p.lat, p.lng, p.status));
}

// Seed admin user
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const adminHash = bcrypt.hashSync('admin123', 10);
  const dispatcherHash = bcrypt.hashSync('disp123', 10);
  const driverHash = bcrypt.hashSync('driver123', 10);
  
  db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)')
    .run('driver', driverHash, 'DRIVER', 'Truck Driver 1');

  // Seed some expenses
  db.prepare('INSERT INTO expenses (truck_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)')
    .run('TRK-004', 'Fuel', 450.00, '2024-03-15', 'Full tank refilling');
  db.prepare('INSERT INTO expenses (truck_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)')
    .run('TRK-007', 'Repair', 1200.00, '2024-03-16', 'Brake pad replacement');

  // Seed some maintenance
  db.prepare('INSERT INTO maintenance (truck_id, type, scheduled_date, status) VALUES (?, ?, ?, ?)')
    .run('TRK-002', 'Oil Change', '2024-04-01', 'Scheduled');
  db.prepare('INSERT INTO maintenance (truck_id, type, scheduled_date, status) VALUES (?, ?, ?, ?)')
    .run('TRK-015', 'Annual Inspection', '2024-03-20', 'Scheduled');

  // Seed some messages
  db.prepare('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)')
    .run(1, 2, 'Hello main dispatcher, I am starting the load #1');
  db.prepare('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)')
    .run(2, 1, 'Copy that driver, drive safe!');
}

export default db;
