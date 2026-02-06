const { Router } = require("express");
const controller = require("../controllers/posts-controller");

const router = new Router();

router.get("/", controller.getPosts);
router.get("/:id", controller.getPostById);
router.post("/", controller.createPost);
router.delete("/:id", controller.deletePost);
router.put("/:id", controller.updatePost);

module.exports = router;
