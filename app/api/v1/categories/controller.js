const Category = require('./model');
const {StatusCodes} = require('http-status-codes');
const CustomAPI = require('../../../erorrs');

const getAllCategory = async (req,res,next) =>{
    try {
        const result = await Category.find({user : req.user.id});
        res.status(StatusCodes.OK).json({data : result});
    } catch (error) {
        next(error);
    }
};

const getOneCategory = async (req,res, next) => {
    try {
        const {id: categoryId} = req.params;
        const result = await Category.findOne({
            _id: categoryId,
            user : req.user.id
        });
        if (!result){
            throw new CustomAPI.NotFoundError('No Category with id : ' + categoryId)
        }

        res.status(StatusCodes.OK).json({data : result})
    } catch (error) {
        next(error);
    }
}

const createCategory = async (req,res,next) =>{
    try {
        const {name} = req.body;
        const user = req.user.id;
        
        const check = await Category.findOne({
            user,
            name,
        });

        if (check){
            throw new CustomAPI.BadRequestError('There is duplicate name');
        }

        const result = await Category.create({
            name,
            user
        });

        res.status(StatusCodes.OK).json({data : result})
    } catch (error) {
        next(error);
    }
}


const updateCategory = async (req,res,next) =>{
    try {
        const { id: categoryId } = req.params;
        const {name} = req.body;
        
        const check = await Category.findOne({
            name,
            _id : { $ne : categoryId}
        })

        if (check){
            throw new CustomAPI.BadRequestError('There is duplicate name');
        }

        const result = await Category.findOneAndUpdate(
            {_id : categoryId},
            {
                name,
                user: req.user.id
            },
            {new : true, runValidators: true}
        );

        if(!result){
            throw new CustomAPI.NotFoundError('No Category with id : ' + categoryId);
        }

        res.status(StatusCodes.OK).json({data : result});
    } catch (error) {
        next(error);
    }
}

const deleteCategory = async (req,res,next) =>{
    try {
        const {id: categoryId} = req.params;
        const result = await Category.findOne({
            _id : categoryId
        });

        if(!result){
            throw new CustomAPI.NotFoundError('No Category found');
        }

        await result.remove();
        res.status(StatusCodes.OK).json({data : result});
    } catch (error) {
        next(error);  
    }
}
module.exports = {
    getAllCategory,
    getOneCategory,
    createCategory,
    updateCategory,
    deleteCategory
}

