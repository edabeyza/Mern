const express = require("express")
const {allProducts, detailProducts, createProduct, deleteProduct, updateProduct, createReview, adminProducts} = require('../controllers/product.js')
const { authenticationMid, roleChecked } = require('../middlewares/auth.js')

const router = express.Router()

router.get('/products', allProducts)
router.get('/admin/products', authenticationMid, roleChecked("admin"), adminProducts)
router.get('/products/:id', detailProducts)
router.post('/product/new', authenticationMid, roleChecked("admin"), createProduct)
router.post('/product/newReview', authenticationMid, createReview)
router.delete('/product/:id', authenticationMid, roleChecked("admin"), deleteProduct)
router.put('/product/:id', authenticationMid, roleChecked("admin"), updateProduct)


module.exports = router