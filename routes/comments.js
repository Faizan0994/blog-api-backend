const { Router } = require("express");
const controller = require("../controllers/comments-controller");

const router = new Router();

router.get("/", controller.getComments);
router.get("/:id", controller.getCommentById);
router.post("/", controller.createComment);
router.delete("/:id", controller.deleteComment);
router.put("/:id", controller.updateComment);

module.exports = router;
