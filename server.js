const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Дозволити доступ із будь-якого домену
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Дозволені методи
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Дозволені заголовки
    next(); // Передати запит далі
});

// Підключення до бази даних
const db = new sqlite3.Database('bot.sqlite3');

// Створення таблиці користувачів
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        balance INTEGER DEFAULT 100
    )
`);

// Реєстрація
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.json({ success: true, userId: this.lastID });
    });
});

// Логін
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Server error. Please try again later.' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // Генеруємо токен
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

        // Повертаємо успішну відповідь
        res.json({ success: true, token, user: { email: user.email, balance: user.balance, kills: user.kills } });
    });
});


// Отримання балансу
app.get('/balance', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        db.get('SELECT balance FROM users WHERE id = ?', [decoded.id], (err, row) => {
            if (err || !row) return res.status(404).json({ error: 'User not found' });
            res.json({ balance: row.balance });
        });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Оновлення балансу
app.post('/balance', (req, res) => {
    const token = req.headers['authorization'];
    const { balance } = req.body;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        db.run('UPDATE users SET balance = ? WHERE id = ?', [balance, decoded.id], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update balance' });
            res.json({ success: true });
        });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));