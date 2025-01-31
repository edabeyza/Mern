class ProductFilter {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    } //query: tüm ürünler, queryStr: filtrelenmesini istediğimiz parametreler

    // queryStr ={
    //     limit, page, keyword, price
    // }
    //search için keywordleri dikkate alacağız

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex : this.queryStr.keyword,
                $options: "i"
            }
        } : {} //keyword gelme durumu ve gelmeme durumu var gelmeme durumunda ürünleri listeleyeceğiz gelme durumu varsa filtreleme yapacağız

        this.query = this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCopy = {...this.queryStr}
        const deleteArea = ["keyword", "page", "limit"]
        deleteArea.forEach[item => delete queryCopy[item]] // query copy içerisinde tek tek gezerken keyword görürsen buradan kaldır

        const queryStr = JSON.stringify(queryCopy) // iki query verilirse
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`) // fiyat ayarlamaları
        
        this.query = this.query.find(JSON.parse(queryStr)) //kullanırken stringify kullandığımız için parse etmemiz gerekiyor
        return this
    } 
    pagination(resultPerPage){
        const activePage = this.queryStr.page || 1
        const skip = resultPerPage * (activePage - 1)
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}

module.exports = ProductFilter

// bu bir class olduğu için çağırırken new ProductFilter şeklinde çağırmamız gerekiyor