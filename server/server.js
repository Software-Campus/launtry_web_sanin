const express = require('express');
const colors = require('colors');
const router = require('./routes/authRoutes');
const connectDB = require('./config/database');
const app = express()
require('dotenv').config()

const PORT = process.env.PORT
app.use(express.json())
app.use(express.urlencoded())

connectDB()

app.use('/api',router)





app.listen(PORT,()=>{
    console.log('server running on port'.bold,PORT.yellow.bold);
})