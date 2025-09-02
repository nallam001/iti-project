const AppError = require("../utilts/AppError")

const validate = (schema)=>{
    return (req,res,next)=>{
        const {error}=schema.validate(req.body)
        if(error){
            throw new AppError(error.details[0].message,400)
        }
        next()
    }
}
module.exports = validate