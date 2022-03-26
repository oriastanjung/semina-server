const router = require("express").Router();
const {
  getAllPayments,
  getOnePayment,
  createPayment,
  updatePayment,
  deletePayment,
  changeStatusPayment,
} = require("./controller");
const { authenticateUser } = require("../../../middlewares/auth");
const upload = require("../../../middlewares/multer");

router.get("/", authenticateUser, getAllPayments);
router.get("/:id", authenticateUser, getOnePayment);
router.post("/", authenticateUser, upload.single("imageUrl"), createPayment);
router.put("/:id", authenticateUser, upload.single("imageUrl"), updatePayment);
router.put("/:id/status", authenticateUser, changeStatusPayment);
router.delete("/:id", authenticateUser, deletePayment);

module.exports = router;
