const Product = require('../models/product.js')
const ProductFilter = require('../utils/productFilter.js')
const cloudinary = require('cloudinary').v2

const allProducts = async(req, res) => {
    const resultPerPage = 10 //sayfada max 10 sonuç gözüksün
    const productFilter = new ProductFilter(Product.find(), req.query).search().filter().pagination(resultPerPage)
    const products = await productFilter.query

    res.status(200).json({
        products
    })
}

// http://localhost:4000/products?keyword="deneme"
//kişi productlar içerisindeki deneme içeren şeyi aramak isterse

const detailProducts = async(req, res) => {
    const product = await Product.findById(req.params.id)

    res.status(200).json({
        product
    })
}

//adminin yapabileceği şeyler
const createProduct = async(req, res, next) => {
    let images = []
    if(typeof req.body.images === "string") {
        images.push(req.body.images)
    }else{
        images = req.body.images
    }

    let allImage = []
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products"
        })

        allImage.push[{
            public_id: result.public_id,
            url: result.secure_url
        }]
    }

    req.body.images = allImage

    const product = await Product.create(req.body)

    res.status(201).json({
        product
    })
}

const deleteProduct = async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id)
    }

    await product.remove()

    res.status(200).json({
        message: "Deleted succesfully."
    })
}

const updateProduct = async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    let images = []
    if(typeof req.body.images === "string") {
        images.push(req.body.images)
    }else{
        images = req.body.images
    }

    if(images !==undefined){ // dışarıdan yeni bir resim geliyorsa
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id)
        }
    }

    let allImage = []
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products"
        })

        allImage.push[{
            public_id: result.public_id,
            url: result.secure_url
        }]
    }

    req.body.images = allImage

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    res.status(200).json({
        product
    })
}

const createReview = async (req, res, next) => {
    const {productId, comment, rating} = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        comment,
        rating: Number(rating)
    }
    const product = await Product.findById(productId) // procuctId ye göre ürünü bulabilmek için

    product.reviews.push(review) // dışarıdan gelen yorumu pruduct'ların içerisine push'lamak için

    let avg = 0// ürünün rating ortalaması yapılan puanlamalara göre değişiyor bunu hesaplamak için
    product.reviews.forEach(rev => {
        avg += rev.rating
    })
    product.rating = avg / product.reviews.length

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        message: "Your comment was added succesfully."
    })
}


module.exports = {allProducts, detailProducts, createProduct, deleteProduct, updateProduct, createReview}