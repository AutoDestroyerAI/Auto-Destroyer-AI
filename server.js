const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to SQLite database.');
});

db.run(`
    CREATE TABLE IF NOT EXISTS gifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE
    )
`);

app.post('/send-gift', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: '用户名不能为空！' });
    }

    db.get('SELECT * FROM gifts WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: '数据库错误！' });
        }

        if (row) {
            return res.status(400).json({ success: false, message: '该用户已领取礼物！' });
        }

        db.run('INSERT INTO gifts (username) VALUES (?)', [username], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: '数据库错误！' });
            }

            res.json({
                success: true,
                giftImage: 'https://via.placeholder.com/300x300?text=Gift+Image'
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
