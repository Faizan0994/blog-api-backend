const { Router } = require("express");
const controller = require("../controllers/auth-controller");

const router = new Router();

router.post("/signup", controller.signupPost);

module.exports = router;
