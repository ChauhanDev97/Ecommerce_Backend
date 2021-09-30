const userModel = require('../routes/users');

exports.userById = (req, res, next, id) => {
    userModel.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error:' User not found '
            });
        }
        req.profile = user;
        next();
    })
}

exports.readUser = (req, res) => {
    req.profile.hashed_password  = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    userModel.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, (err, user) => {
        if(err){
            return res.status(400).json({
                error : "You are not authorised to perform this action"
            })
        }
        user.hashed_password  = undefined;
        user.salt = undefined;
        res.json(user);
    })
}