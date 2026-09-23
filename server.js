require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Product Catalog Management API is running');
});

const PORT = process.env.PORT || 5051;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});