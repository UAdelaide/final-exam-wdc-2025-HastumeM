const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const db = require('./models/db');

const session = require('express-session');
app.use(session({
    secret: 'dogsecret',
    resave: false,
    saveUninitialized: true,
}));


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.get('/api/dogs', async (req, res) => {
  try {
    if (req.query.owner) {
        const [dogs] = await db.execute('SELECT dog_id, name FROM Dogs d JOIN Users u ON d.owner_id = u.user_id WHERE u.username = ?');
    }
    const [dogs] = await db.execute('SELECT d.name AS dog_name, d.size, u.username AS owner_username FROM Dogs d JOIN Users u ON d.owner_id = u.user_id');
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// Export the app instead of listening here
module.exports = app;