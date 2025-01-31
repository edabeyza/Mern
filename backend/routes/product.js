const express = require("express")
const {allProducts, detailProducts, createProduct, deleteProduct, updateProduct} = require('../controllers/product.js')

const router = express.Router()

router.get('/products', allProducts)
router.get('/products/:id', detailProducts)
router.post('/product/new', createProduct)
router.delete('/product/:id', deleteProduct)
router.put('/product/:id', updateProduct)


module.exports = router