const express = require('express')
const cors = require('cors') // frontendden endpointlere istekte bulunduğumuzda kullanacağız
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const db = require('./config/db.js')
const product = require('./routes/product.js')
const user = require('./routes/user.js')
const cloudinary = require('cloudinary').v2

/* --------------------------------- dotenv --------------------------------- */
dotenv.config()

  // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

/* --------------------------------- express -------------------------------- */
const app = express()

/* ---------------------------------- cors ---------------------------------- */
app.use(cors())

/* ------------------------------- bodyParser ------------------------------- */
app.use(bodyParser.json({limit:"30mb", extended: true}))
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}))

/* ------------------------------ cookieParser ------------------------------ */
app.use(cookieParser())

app.use('/', product)
app.use('/', user)

/* ------------------------------ dbConnection ------------------------------ */
db()

const PORT = 4000
app.listen(PORT, () => {
    console.log("server is running on port 4000")
} )