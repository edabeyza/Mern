const express = require('express')
const cors = require('cors') // frontendden endpointlere istekte bulunduğumuzda kullanacağız
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const db = require('./config/db.js')
const product = require('./routes/product.js')

/* --------------------------------- dotenv --------------------------------- */
dotenv.config()

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

/* ------------------------------ dbConnection ------------------------------ */
db()

const PORT = 4000
app.listen(PORT, () => {
    console.log("server is running on port 4000")
} )