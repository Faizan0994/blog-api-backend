const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const queries = require("../db/queries");

const validator = [
  body("name")
    .trim()
    .matches(/^[A-Za-z\s]+$/) // Only letters and spaces
    .withMessage("Name must contain only letters and spaces")
    .isLength({ min: 3, max: 25 })
    .withMessage("Name must be between 3 and 25 characters long"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("username must be between 3 and 25 characters long"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long"),
  body("confirm")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("isAdmin")
    .optional()
    .customSanitizer(
      (value) => value === "on" || value === "true" || value === true,
    ), // Prevent user from messing with the page in dev tools
];

const loginValidator = [
  body("username")
    .trim()
    .isLength({ max: 25 })
    .withMessage("username must be less than 25 characters long"),
  body("password")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long"),
];

exports.signupPost = [
  validator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, password, isAdmin } = req.body;
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    const type = isAdmin ? "admin" : "standard";
    console.log(type);
    const userCreated = await queries.createUser(name, username, hashed, type);
    if (!userCreated)
      return res.status(409).json({ errors: ["Username already Taken"] });
    const user = await queries.getUserByName(username);
    return res.status(201).json(user);
  },
];

exports.loginPost = [
  loginValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const user = await queries.getUserByName(username);
    let isPasswordCorrect = false;
    if (user) isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!(user && isPasswordCorrect)) {
      return res.status(401).json({ errors: ["invalid username or password"] });
    }
    return res.status(200).json(user);
  },
];
