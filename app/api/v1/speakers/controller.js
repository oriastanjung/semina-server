const Speaker = require('./model');
const {StatusCodes} = require('http-status-codes');
const config = require('../../../config');
const fs = require('fs');
const CustomAPI = require('../../../erorrs');

const getAllSpeaker = async (req,res,next) =>{
    try {
        const {keywoard} = req.query;
        let condition = {user : req.user.id};

        if(keywoard){
            condition = {...condition, name: {$regex : keywoard, $options : 'i'}};
        }

        const result = await Speaker.find(condition);
        res.status(StatusCodes.OK).json({data : result})
    } catch (error) {
        next(error);
    }
}

const createSpeaker = async (req,res,next) =>{
    try {
        const {name, role } = req.body;
        const user = req.user.id;
        let result;

        if(!req.file){
            result = new Speaker({ name, role, user});
        }else{
            result = new Speaker({ name, role, user, avatar: req.file.filename});
        }
        await result.save();

        res.status(StatusCodes.CREATED).json({data : result})
        
    } catch (error) {
        next(error);
    }
}

const getOneSpeaker = async (req, res, next) =>{
    try {
        const {id : speakerId} = req.params;
        const result = await Speaker.findOne({_id : speakerId, user : req.user.id});
        res.status(StatusCodes.OK).json({data : result});
    } catch (error) {
        next(error);
    }
}

const updateSpeaker = async (req,res,next) =>{
    try {
        const {id : speakerId} = req.params;
        const {name, role} = req.body;
        const result = await Speaker.findOne({_id : speakerId, user : req.user.id});

        if(!result){
            throw new CustomAPI.NotFoundError('No Speaker with id :' + speakerId);
        }

        if(!req.file){
            result.name = name;
            result.role = role;
        }else{
            let currentImage =`${config.rootPath}/public/uploads/${result.avatar}`;

            if(result.avatar !== 'default.png' && fs.existsSync(currentImage)){
                fs.unlinkSync(currentImage);
            }
            result.name = name;
            result.role = role;
            result.avatar = req.file.filename;
        }
        await result.save();
        res.status(StatusCodes.OK).json({data : result})
    } catch (error) {
        next(error);
    }
}

const deleteSpeaker = async (req,res,next) =>{
    try {
        const {id: speakerId} = req.params;
        result = await Speaker.findOne({_id : speakerId, user : req.user.id});
        
        if(!result){
            throw new CustomAPI.NotFoundError('No Speaker with id :' + speakerId);
        }
        
        let currentImage = `${config.rootPath}/public/uploads/${result.avatar}`;
        if(!result.avatar !== 'default.png' && fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage);
        }
        result.remove();
        res.status(StatusCodes.OK).json({data : result})
    } catch (error) {
        next(error);
    }
}
 
module.exports = {
    getAllSpeaker,
    createSpeaker,
    getOneSpeaker,
    updateSpeaker,
    deleteSpeaker
}