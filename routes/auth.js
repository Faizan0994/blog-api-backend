const { Router } = require("express");
const controller = require("../controllers/auth-controller");

const router = new Router();

router.post("/signup", controller.signupPost);
router.post("/login", controller.loginPost);
router.post("/logout", controller.logout);
router.get("/refresh", controller.refresh);

module.exports = router;
