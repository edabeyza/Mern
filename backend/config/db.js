const mongoose = require('mongoose')

const db = () => {
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("mongoDB connected !!!")
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err)
    })
}

module.exports = db