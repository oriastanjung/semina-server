const User = require('../users/model');
const {StatusCodes} = require('http-status-codes');
const CustomAPI = require('../../../erorrs');
const {createTokenUser, createJwt} = require('../../../utils'); 

const signup = async (req,res, next) => {
    try {
        const {email, password, name, role} = req.body;
        const result = new User({
            email,
            password,
            role,
            name,
        });

        await result.save();
        
        delete result._doc.password;

        res.status(StatusCodes.CREATED).json({data : result});
    } catch (err) {
        next(err);
    }
};

const signin = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        
        if(!email || !password){
            throw new CustomAPI.BadRequestError('Please provide your email and password')
        }
        const result = await User.findOne({ email : email});

        if (!result){
            throw new CustomAPI.BadRequestError('Invalid Credentials');
        }

        const isPasswordCorrect = await result.comparePassword(password);
        if (!isPasswordCorrect){
            throw new CustomAPI.BadRequestError('Invalid Credentials');
        }
        const token = createJwt({payload: createTokenUser(result)});

        res.status(StatusCodes.OK).json({data : token});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    signin,
}