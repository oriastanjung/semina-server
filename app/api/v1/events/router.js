const router = require('express').Router();
const {
    getAllEvents,
    createEvents, 
    getOneEvents, 
    updateEvents, 
    deleteEvents
} = require('./controller');
const {authenticateUser} = require('../../../middlewares/auth');
const upload = require('../../../middlewares/multer');

router.get('/',authenticateUser ,getAllEvents);
router.post('/',authenticateUser,upload.single('cover') ,createEvents);
router.get('/:id',authenticateUser ,getOneEvents);
router.put('/:id', authenticateUser, upload.single('cover') ,updateEvents);
router.delete('/:id', authenticateUser ,deleteEvents);


module.exports = router;