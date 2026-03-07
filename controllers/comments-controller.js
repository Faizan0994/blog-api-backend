const { validationResult, body } = require("express-validator");
const queries = require("../db/queries");
const { verifyToken } = require("./auth-controller");

const commentValidator = [
  body("commentText")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Comment cannot be longer than 200 characters"),
];

// for debugging
exports.getComments = [
  verifyToken,
  async (req, res) => {
    const comments = await queries.getAllComments();
    return res.status(200).json({ comments });
  },
];

exports.getCommentById = [
  verifyToken,
  async (req, res) => {
    const id = +req.params.id;
    const comment = await queries.getComment(id);
    if (comment) return res.status(200).json(comment);
    else return res.sendStatus(404);
  },
];

exports.createComment = [
  verifyToken,
  commentValidator,
  async (req, res) => {
    const user = req.user;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { commentText } = req.body;
    const postId = +req.body.postId;

    await queries.createComment(user.id, postId, commentText);
    return res.sendStatus(201);
  },
];

exports.deleteComment = [
  verifyToken,
  async (req, res) => {
    const id = +req.params.id;
    try {
      const comment = await queries.getComment(id);
      if (comment.authorId !== req.user.id) return res.sendStatus(403);
      await queries.deleteComment(id);
      return res.sendStatus(204);
    } catch (error) {
      return res.sendStatus(404);
    }
  },
];

exports.updateComment = [
  verifyToken,
  async (req, res) => {
    const id = +req.params.id;
    const { commentText } = req.body;
    const comment = await queries.getComment(id);
    if (comment.authorId !== req.user.id) return res.sendStatus(403);
    try {
      await queries.updateComment(id, commentText);
      return res.sendStatus(200);
    } catch (error) {
      res.sendStatus(404);
    }
  },
];
