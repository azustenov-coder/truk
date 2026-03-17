import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'logistics-secret-key-2024';

app.use(cors());
app.use(express.json());

// Serve static files from the React app
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Auth Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /api/drivers - List all drivers (For dropdowns)
app.get('/api/drivers', (req: Request, res: Response) => {
  try {
    const drivers = db.prepare('SELECT id, username, full_name, role FROM users WHERE role = ?').all('DRIVER');
    res.json(drivers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// User Management Endpoints (Now moved higher for visibility)
// GET /api/users - List all users (Admin only)
app.get('/api/users', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET); // Verify token but don't restrict to admin for chat visibility
    
    // Get current user ID from token to calculate unread counts
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const currentUserId = decoded.id;

    const users = db.prepare(`
      SELECT u.id, u.username, u.role, u.full_name, u.created_at,
             (SELECT COUNT(*) FROM messages 
              WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0) as unread_count
      FROM users u
    `).all(currentUserId);
    res.json(users);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/users - Create new user (Admin only)
app.post('/api/users', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const { username, password, role, full_name } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const info = db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)')
      .run(username, hashedPassword, role, full_name);
    
    res.status(201).json({ id: info.lastInsertRowid, username, role, full_name });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id - Update user (Admin only)
app.patch('/api/users/:id', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const { id } = req.params;
    const { role, full_name, password } = req.body;
    
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare('UPDATE users SET role = ?, full_name = ?, password = ? WHERE id = ?')
        .run(role, full_name, hashedPassword, id);
      db.prepare('UPDATE users SET role = ?, full_name = ? WHERE id = ?')
        .run(role, full_name, id);
    }
    
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const { id } = req.params;
    
    // Safety check: Don't delete self
    if (decoded.id === parseInt(id as string)) {
      return res.status(400).json({ error: "O'z-o'zini o'chirish taqiqlanadi" });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Endpoints

// GET /api/loads - List all loads (with optional status filter)
app.get('/api/loads', (req: Request, res: Response) => {
  const status = req.query.status as string;
  try {
    let query = 'SELECT * FROM loads';
    const params: any[] = [];

    if (status && status !== 'all') {
      if (status === 'ACTIVE') {
        query += " WHERE status IN ('PENDING', 'ASSIGNED')";
      } else {
        query += ' WHERE status = ?';
        params.push(status);
      }
    }

    query += ' ORDER BY created_at DESC';
    const loads = db.prepare(query).all(...params);
    res.json(loads);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/loads - Create new load
app.post('/api/loads', (req: Request, res: Response) => {
  const { customer, origin, destination, eta, price, cargo_type } = req.body;
  const loadId = `LD-2024-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  try {
    const info = db.prepare(`
      INSERT INTO loads (loadId, customer, origin_city, origin_state, origin_location, dest_city, dest_state, dest_location, eta, status, price, cargo_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      loadId, 
      customer, 
      origin.city, origin.state, origin.location || 'Main Hub', 
      destination.city, destination.state, destination.location || 'Main DC', 
      eta, 
      'PENDING',
      price || 1200,
      cargo_type || 'General'
    );
    
    const newLoad = db.prepare('SELECT * FROM loads WHERE id = ?').get(info.lastInsertRowid) as any;
    
    // Create notification
    db.prepare('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)')
      .run('Yangi buyurtma', `${newLoad.customer} uchun yangi yuk (${newLoad.loadId}) yaratildi.`, 'SUCCESS');

    res.status(201).json(newLoad);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/loads/:id - Update load (Assign Driver or Confirm Delivery)
app.patch('/api/loads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, driver_name, driver_id } = req.body;

  try {
    if (status === 'ASSIGNED') {
      db.prepare('UPDATE loads SET status = ?, driver_name = ?, driver_id = ? WHERE id = ?')
        .run(status, driver_name, driver_id, id);
    } else {
      db.prepare('UPDATE loads SET status = ? WHERE id = ?')
        .run(status, id);
    }
    
    const updatedLoad = db.prepare('SELECT * FROM loads WHERE id = ?').get(id) as any;

    // Create notification
    if (status === 'ASSIGNED') {
      db.prepare('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)')
        .run('Haydovchi biriktirildi', `${updatedLoad.loadId} yuki ${driver_name}ga biriktirildi.`, 'INFO');
    } else if (status === 'IN_TRANSIT') {
      db.prepare('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)')
        .run('Yo\'lga chiqildi', `${updatedLoad.loadId} yuki yo'lga chiqdi.`, 'INFO');
    } else if (status === 'DELIVERED') {
      db.prepare('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)')
        .run('Yuk yetkazildi', `${updatedLoad.loadId} yuki muvaffaqiyatli yetkazib berildi.`, 'SUCCESS');
    }

    res.json(updatedLoad);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notifications - List notifications for a user
app.get('/api/notifications', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT 50')
      .all(decoded.id);
    res.json(notifications);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// PATCH /api/notifications/:id - Mark notification as read
app.patch('/api/notifications/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats - Dashboard KPIs
app.get('/api/stats', (req: Request, res: Response) => {
  try {
    const loadStats = db.prepare(`
      SELECT 
        COUNT(CASE WHEN status IN ('PENDING', 'ASSIGNED') THEN 1 END) as activeLoads,
        COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as completedDeliveries,
        SUM(CASE WHEN status = 'DELIVERED' THEN price ELSE 0 END) as totalRevenue
      FROM loads
    `).get() as any;

    const notificationStats = db.prepare(`
      SELECT 
        COUNT(*) as totalAlerts,
        COUNT(CASE WHEN type IN ('ERROR', 'WARNING', 'ALERT') THEN 1 END) as criticalAlerts
      FROM notifications
    `).get() as any;

    const vehicleStats = db.prepare(`
      SELECT COUNT(*) as activeVehicles FROM truck_positions
    `).get() as any;

    res.json({
      activeLoads: loadStats.activeLoads,
      completedDeliveries: loadStats.completedDeliveries,
      totalRevenue: loadStats.totalRevenue || 0,
      totalAlerts: notificationStats.totalAlerts,
      criticalAlerts: notificationStats.criticalAlerts,
      activeVehicles: vehicleStats.activeVehicles,
      onTimeRate: "98.2%" // Still mostly mock as current schema doesn't track delays explicitly
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tracking - List all truck positions
app.get('/api/tracking', (req: Request, res: Response) => {
  try {
    const positions = db.prepare('SELECT * FROM truck_positions').all();
    res.json(positions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Movement Simulation: Update truck coordinates slightly every 8 seconds
setInterval(() => {
  try {
    const trucks = db.prepare('SELECT id, lat, lng FROM truck_positions').all() as any[];
    const update = db.prepare('UPDATE truck_positions SET lat = ?, lng = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?');
    
    trucks.forEach(t => {
      // Move 0.001 approx 100 meters
      const newLat = t.lat + (Math.random() - 0.5) * 0.005;
      const newLng = t.lng + (Math.random() - 0.5) * 0.005;
      update.run(newLat, newLng, t.id);
    });
  } catch (err) {
    console.error('Simulation error:', err);
  }
}, 8000);

// --- EXPENSES ---
app.get('/api/expenses', (req: Request, res: Response) => {
  try {
    const expenses = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const { truck_id, category, amount, date, description, load_id } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO expenses (truck_id, category, amount, date, description, load_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(truck_id, category, amount, date, description, load_id);
    res.json({ id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- MESSAGES ---
app.get('/api/messages/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const { otherUserId } = req.query;
  try {
    // Mark messages as read
    db.prepare(`
      UPDATE messages 
      SET is_read = 1 
      WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
    `).run(otherUserId, userId);

    const messages = db.prepare(`
      SELECT m.*, u.full_name as sender_name, u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.timestamp ASC
    `).all(userId, otherUserId, otherUserId, userId);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { sender_id, receiver_id, content } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO messages (sender_id, receiver_id, content) 
      VALUES (?, ?, ?)
    `).run(sender_id, receiver_id, content);
    res.json({ id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- MAINTENANCE ---
app.get('/api/maintenance', (req: Request, res: Response) => {
  try {
    const maintenance = db.prepare('SELECT * FROM maintenance ORDER BY scheduled_date ASC').all();
    res.json(maintenance);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/maintenance', (req: Request, res: Response) => {
  const { truck_id, type, scheduled_date, notes } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO maintenance (truck_id, type, scheduled_date, notes, status)
      VALUES (?, ?, ?, ?, 'Scheduled')
    `).run(truck_id, type, scheduled_date, notes);
    res.json({ id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/maintenance/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  try {
    db.prepare('UPDATE maintenance SET status = ?, notes = ? WHERE id = ?')
      .run(status, notes, id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trucks', (req: Request, res: Response) => {
  try {
    const trucks = db.prepare('SELECT DISTINCT truck_id FROM truck_positions UNION SELECT DISTINCT truck_id FROM expenses').all();
    res.json(trucks.map((t: any) => t.truck_id).filter(Boolean));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
