const Event = require("./model");
const { StatusCodes } = require("http-status-codes");
const config = require("../../../config");
const fs = require("fs");
const CustomAPI = require("../../../erorrs");
const { status } = require("express/lib/response");
const Category = require("../categories/model");
const Speaker = require("../speakers/model");

const getAllEvents = async (req, res, next) => {
  try {
    const { keywoard, category, speaker } = req.query;
    const user = req.user.id;

    let condition = { user: user };

    if (keywoard) {
      condition = { ...condition, title: { $regex: keywoard, $options: "i" } };
    }

    if (category) {
      condition = { ...condition, category };
    }
    if (speaker) {
      condition = { ...condition, speaker };
    }

    const result = await Event.find(condition)
      .populate({
        path: "category",
        select: "_id name",
      })
      .populate({
        path: "speaker",
        select: "_id name role avatar",
      })
      .populate({
        path: "user",
        select: "_id name",
      });
    // jika ingin mengubah nama field
    // result.forEach((result) => {
    //     result._doc.speaker._doc.foto = result._doc.speaker._doc.avatar;
    //     delete result._doc.speaker._doc.avatar;
    //   });

    res.status(StatusCodes.OK).json({ data: result });
  } catch (error) {
    next(error);
  }
};

// const getOneEvents = async (req,res, next) =>{
//     try {
//         const {id : eventId} = req.params;
//         const result = await Event.findOne({user : req.user.id, _id : eventId});
//         if (!result){
//             throw new CustomAPI.NotFoundError("No event with id : " + eventId);
//         }
//         res.status(StatusCodes.OK).json({data : result});
//     } catch (error) {
//         next(error);
//     }
// };

const createEvents = async (req, res, next) => {
  try {
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagline,
      keyPoint,
      category,
      speaker,
    } = req.body;

    const user = req.user.id;

    let result;
    if (!keyPoint) {
      throw new CustomAPI.BadRequestError("Please provide key point");
    }

    const checkCategory = await Category.findOne({
      _id: category,
      user,
    });
    const checkSpeaker = await Speaker.findOne({
      _id: speaker,
      user,
    });

    if (!checkCategory) {
      throw new CustomAPI.NotFoundError("No Category with id :" + category);
    }
    if (!checkSpeaker) {
      throw new CustomAPI.NotFoundError("No Speaker with id :" + speaker);
    }
    if (!req.file) {
      throw new CustomAPI.BadRequestError("Please upload image / cover");
    } else {
      result = new Event({
        title,
        price,
        date,
        cover: req.file.filename,
        about,
        venueName,
        tagline,
        keyPoint: JSON.parse(keyPoint),
        category,
        speaker,
        user,
      });
    }
    await result.save();
    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getOneEvents = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const result = await Event.findOne({ _id: eventId });
    if (!result) {
      throw new CustomAPI.NotFoundError("No event with id : " + eventId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const updateEvents = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagline,
      keyPoint,
      category,
      speaker,
    } = req.body;

    const user = req.user.id;

    if (!keyPoint) {
      throw new CustomAPI.BadRequestError("Please provide key point");
    }

    const checkCategory = await Category.findOne({
      _id: category,
      user,
    });
    const checkSpeaker = await Speaker.findOne({
      _id: speaker,
      user,
    });

    if (!checkCategory) {
      throw new CustomAPI.NotFoundError("No Category with id :" + category);
    }
    if (!checkSpeaker) {
      throw new CustomAPI.NotFoundError("No Speaker with id :" + speaker);
    }
    let result = await Event.findOne({ _id: eventId, user });
    if (!req.file) {
      result.title = title;
      result.price = price;
      result.date = date;
      result.about = about;
      result.venueName = venueName;
      result.tagline = tagline;
      result.category = category;
      result.user = user;
      result.keyPoint = JSON.parse(keyPoint);
    } else {
      let currentImage = `${config.rootPath}/public/uploads/${result.cover}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      result.title = title;
      result.price = price;
      result.date = date;
      result.about = about;
      result.venueName = venueName;
      result.tagline = tagline;
      result.category = category;
      result.user = user;
      result.keyPoint = JSON.parse(keyPoint);
      result.cover = req.file.filename;
    }
    await result.save();
    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const deleteEvents = async (req,res,next) =>{
  try {
      const {id: eventId} = req.params;
      let result = await Event.findOne({_id : eventId, user : req.user.id});
      
      if(!result){
          throw new CustomAPI.NotFoundError('No Event with id :' + eventId);
      }
      
      let currentImage = `${config.rootPath}/public/uploads/${result.cover}`;
      if(fs.existsSync(currentImage)){
          fs.unlinkSync(currentImage);
      }
      await result.remove();
      res.status(StatusCodes.OK).json({data : result})
  } catch (error) {
      next(error);
  }
}


module.exports = {
  getAllEvents,
  createEvents,
  getOneEvents,
  updateEvents,
  deleteEvents
};
