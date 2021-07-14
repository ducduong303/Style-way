class APIfeatures {
    constructor(query, queryStr) {
        this.query = query,
            this.queryStr = queryStr
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }
    category() {
        const categoryStr = this.queryStr.category ? {
            category: {
                $regex: this.queryStr.category,
            }
        } : {}
        this.query = this.query.find({ ...categoryStr })
        return this
    }
    searchOder() {
        const oderStr = this.queryStr.oder ? {
            paymentID: {
                $regex: this.queryStr.oder,
                $options: 'i'
            }
        } : {}
        this.query = this.query.find({ ...oderStr })
        return this
    }
    oderStatus() {
        const oderStatusStr = this.queryStr.oderStatus ? {
            oderStatus: {
                $regex: this.queryStr.oderStatus,
                $options: 'i'
            }
        } : {}
        this.query = this.query.find({ ...oderStatusStr })
        return this
    }
    payStatus() {
        const payStatusStr = this.queryStr.payStatus ? {
            isPaid: this.queryStr.payStatus,
        } : {}
        this.query = this.query.find({ ...payStatusStr })
        return this
    }
    sizes() {
        const sizesStr = this.queryStr.sizes ? {
            sizes: {
                $regex: this.queryStr.sizes,
            }
        } : {}
        this.query = this.query.find({ ...sizesStr })
        return this
    }
    colors() {
        const colorStr = this.queryStr.colors ? {
            colors: {
                $elemMatch: {
                    color: this.queryStr.colors
                }
            }

        } : {}
        this.query = this.query.find({ ...colorStr })
        return this
    }
    filter() {
        const queryObj = { ...this.queryStr } // req.query

        const removeField = ["payStatus", "colors", "sizes", "oderStatus", "oder", "keyword", "category", "sort", "limit", "page"]
        removeField.forEach((el) => delete queryObj[el])
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        this.query = this.query.find(JSON.parse(queryString))
        return this;
    }
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    pagination() {
        const page = this.queryStr.page * 1 || 1
        const limit = this.queryStr.limit * 1 || 20
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }

}

module.exports = APIfeatures