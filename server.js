const express = require('express');
const connectDB = require('./config/db'); // חיבור ל-Database
const recipesRoutes = require('./routes/recipes_routes'); // ייבוא ה-Routes

const app = express();
app.use(express.json());

// חיבור ה-Routes
app.use('/api', recipesRoutes);

// התחלת השרת
const PORT = process.env.PORT || 5000;
connectDB(); // חיבור ל-MongoDB
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
