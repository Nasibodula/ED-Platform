

// // server.js - Debug version
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging middleware for debugging
// app.use((req, res, next) => {
//   console.log(`🔵 ${new Date().toISOString()} - ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   if (req.body && Object.keys(req.body).length > 0) {
//     console.log('Body:', req.body);
//   }
//   next();
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   });

// // Load routes one by one to identify the problematic one
// try {
//   console.log('Loading auth routes...');
//   const authRoutes = require('./routes/authRoutes');
//   app.use('/api/auth', authRoutes);
//   console.log('✅ Auth routes loaded successfully');
// } catch (error) {
//   console.error('❌ Error loading auth routes:', error.message);
//   process.exit(1);
// }

// try {
//   console.log('Loading user routes...');
//   const userRoutes = require('./routes/userRoutes');
//   app.use('/api/users', userRoutes);
//   console.log('✅ User routes loaded successfully');
// } catch (error) {
//   console.error('❌ Error loading user routes:', error.message);
//   process.exit(1);
// }

// try {
//   console.log('Loading course routes...');
//   const courseRoutes = require('./routes/courseRoutes');
//   app.use('/api/courses', courseRoutes);
//   console.log('✅ Course routes loaded successfully');
// } catch (error) {
//   console.error('❌ Error loading course routes:', error.message);
//   process.exit(1);
// }

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.json({ message: 'Server is running successfully' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     message: 'Something went wrong!', 
//     error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
//   });
// });

// // Handle undefined routes
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Database connection error:', error));

// Routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Cushite Learning Platform API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});