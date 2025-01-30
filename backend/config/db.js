const mongoose = require('mongoose')

const db = () => {
    mongoose.connect('mongodb+srv://edabeyza:Beyzaemre1@cluster1.djfob.mongodb.net/',{
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