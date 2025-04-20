const { registerUser, verifyEmail,  login } = require("../controllers/userController");

const router = require("express").Router();


router.post("/user/register", registerUser)

router.get("/user/verify/:token", verifyEmail)


router.post("/user/login", login)



module.exports = router;