const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
const fs = require('fs');
const os = require('os');

// Create and serve a temp uploads directory (useful for serverless runtimes fallback)
const tmpUploadsDir = path.join(os.tmpdir(), 'mugshot_uploads');
try {
    if (!fs.existsSync(tmpUploadsDir)) fs.mkdirSync(tmpUploadsDir, { recursive: true });
} catch (err) {
    console.warn('Could not create tmp uploads dir:', err.message);
}
app.use('/uploads', express.static(tmpUploadsDir));
// Also serve repository uploads if present (local dev)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
    res.send('Mug Shot Cafe API is running...');
});

// Remove your old app.listen() and replace it with this:
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

// CRUCIAL: Vercel needs this export to handle the routing
module.exports = app;