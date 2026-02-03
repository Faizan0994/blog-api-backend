const { Router } = require("express");
const controller = require("../controllers/auth-controller");

const router = new Router();

router.post("/signup", controller.signupPost);
router.post("/login", controller.loginPost);

module.exports = router;
