const express = require("express")
const {allProducts, detailProducts, createProduct, deleteProduct, updateProduct, createReview, adminProducts/controllers/product.js')

const router = express.Router()

router.get('/products', allProducts)
router.get('/admin/products', adminProducts)
router.get('/products/:id', detailProducts)
router.post('/product/new', createProduct)
router.post('/product/newReview', createReview)
router.delete('/product/:id', deleteProduct)
router.put('/product/:id', updateProduct)


module.exports = router