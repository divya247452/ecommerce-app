const express = require('express');
const dotenv = require('dotenv')
const path = require('path')
const app = express()
const connectDb = require('./config/db')
dotenv.config();
const port = process.env.PORT || 5000;
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cookieParser = require('cookie-parser');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Cookie parser middleware
app.use(cookieParser());

connectDb()


app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}))



if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }
  
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})