const prisma = require("./prisma");

/*------------------------------------
  User Queries
--------------------------------------*/
exports.getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

exports.getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

// Returns true if user is created, false if username is already in use
exports.createUser = async (name, username, password, type = "standard") => {
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user) {
    await prisma.user.create({
      data: {
        type: type,
        name: name,
        username: username,
        password: password,
      },
    });
    return true;
  }
  return false;
};

exports.deleteUser = async (id) => {
  await prisma.user.delete({
    where: {
      id: id,
    },
  });
};

exports.updateUser = async (data) => {
  await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      type: data.type,
      name: data.name,
      username: data.username,
      password: data.password,
    },
  });
};

/*------------------------------------
  Post Queries
--------------------------------------*/
exports.getAllPosts = async () => {
  const posts = await prisma.post.findMany({ include: { comments: true } });
  return posts;
};

exports.getAllPublishedPosts = async () => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      comments: true,
    },
  });
  return posts;
};

exports.getPostsOfAuthor = async (id) => {
  const posts = await prisma.post.findMany({
    where: { authorId: id },
    include: { comments: true },
  });
  return posts;
};

exports.getPost = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { comments: true },
  });
  return post;
};

exports.createPost = async (userId, title, text, published) => {
  await prisma.post.create({
    data: {
      title: title,
      text: text,
      published: published,
      authorId: userId,
    },
  });
};

exports.deletePost = async (id) => {
  await prisma.post.delete({ where: { id: id } });
};

/*------------------------------------
  Comment Queries
--------------------------------------*/
exports.getAllComments = async () => {
  const comments = await prisma.comment.findMany();
  return comments;
};

exports.getComment = async (id) => {
  const comment = await prisma.comment.findUnique({ where: { id: id } });
  return comment;
};

exports.createComment = async (userId, postId, text) => {
  await prisma.comment.create({
    data: {
      text: text,
      authorId: userId,
      postId: postId,
    },
  });
};

exports.deleteComment = async (id) => {
  await prisma.comment.delete({ where: { id: id } });
};

// For testing queries
async function test() {}

test();
