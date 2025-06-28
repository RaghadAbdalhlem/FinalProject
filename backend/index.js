const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const recipeRoute = require('./routes/recipes');
const productRoute = require('./routes/products');
const favoriteRoute = require('./routes/favorites');
const cartRoute = require('./routes/carts');
const waterRoute = require('./routes/waters');
const orderRoute = require('./routes/orders');
const recommendRoute = require('./routes/recommends');
const { seedDatabase } = require('./config/seed');

// Initialize the database connection
connectDB();

// Create the Express application
const app = express();

// Middleware setup
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:8000', // Your front-end URL
        ],
    })
);

app.use(express.json()); // Parses incoming JSON requests
app.use(cookieParser()); // Cookie parser for handling cookies

// Basic route
app.get('/', (req, res) => {
    res.send('Self-Care API Server is running!');
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/recipes', recipeRoute);
app.use('/api/products', productRoute);
app.use('/api/favorites', favoriteRoute);
app.use('/api/carts', cartRoute);
app.use('/api/waters', waterRoute);
app.use('/api/recommends', recommendRoute);
app.use('/api/orders', orderRoute);

// Seed database and start the server
async function init() {
    try {
        // Wait for the database to seed and log success
        await seedDatabase();
        console.log('Database seeding done.');

        // Start the server after seeding is complete
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    } catch (error) {
        console.error('Error during initialization:', error);
        process.exit(1); // Exit the process with failure status
    }
}

init();
