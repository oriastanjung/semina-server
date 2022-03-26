const router = require('express').Router();
const {
    getAllCategory,
    getOneCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('./controller');

const {authenticateUser} = require('../../../middlewares/auth');

router.get('/', authenticateUser, getAllCategory);
router.get('/:id', authenticateUser, getOneCategory);
router.post('', authenticateUser, createCategory);
router.put('/:id', authenticateUser, updateCategory);
router.delete('/:id', authenticateUser, deleteCategory);


module.exports = router;