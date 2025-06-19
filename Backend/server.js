require('dotenv').config()
const cors = require('cors');

const express = require('express')
const mongoose = require('mongoose')
const productRoutes = require('./routes/productRoutes');
const blogRoutes = require('./routes/blogRoutes');
const ebookRoutes = require('./routes/ebookRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');

// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials : true,
})); // Enable CORS for all routes

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/user',userRoutes);
app.use('/api/appointment',appointmentRoutes);
app.use('/api/contact', contactRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })