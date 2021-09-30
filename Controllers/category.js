const Category = require ('../routes/CategorySchema');
const {errorHandler} = require('../Helpers/dbErrorHandler')

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                err : 'Category does not exist'
            })
        }

        req.category = category;
        next();
    })
}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error : errorHandler(err)
            })
        }

        res.json({data});
    })
}

exports.categoryRead = (req, res) =>{
    return res.json(req.category)
}

exports.categoryUpdate = (req, res) =>{
    const category = req.category
    category.name = req.body.name
    category.save((err, data) =>{
        if(err){
            return res.status(400).json({
                err : errorHandler(err)
            })
        }

        res.json(data);
    })
}

exports.categoryRemove = (req, res) =>{
    const category = req.category
    category.remove((err, data) =>{
        if(err){
            return res.status(400).json({
                err : errorHandler(err)
            })
        }

        res.json({
            message : 'Category deleted'
        });
    })
}

exports.list = (req, res) =>{
    Category.find().exec((err, data) =>{
        if(err){
            return res.status(400).json({
                err : errorHandler(err)
            })
        }

        res.json(data);
    })
}