const User = require('../users/model');

const getAllUser = async (req,res,next) => {
  try {
    const user = await User.find();

    res.send(user);
  } catch (error) {
    next(error)
  }
}

module.exports = {getAllUser}