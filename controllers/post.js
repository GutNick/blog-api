const Post = require('../models/post');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createPost = (req, res, next) => {
  Post.create({
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
    creator: req.user._id,
  })
    .then((post) => res.send({ data: post }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect post data passed.'));
      }
      return next(err);
    });
};

module.exports.getPosts = (req, res, next) => {
  Post.find({})
    .populate('creator')
    .then((posts) => res.send({ data: posts }))
    .catch(next);
};

module.exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .orFail(() => next(new NotFoundError('Post with specified id was not found.')))
    .populate('creator')
    .then((post) => res.send({ data: post }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Incorrect post id passed.'));
      }
      return next(err);
    });
};

module.exports.updatePost = (req, res, next) => {
  const {
    title, image, content, creatorId,
  } = req.body;
  Post.findByIdAndUpdate(
    req.params.id,
    {
      title, image, content, creator: creatorId,
    },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => next(new NotFoundError('Post not found')))
    .then((post) => res.send({ data: post }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Incorrect post id passed.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect post data passed.'));
      }
      return next(err);
    });
};

module.exports.deletePost = (req, res, next) => {
  Post.findById(req.params.id)
    .orFail(() => next(new NotFoundError('Post not found')))
    .then((post) => {
      if (post.creator.toString() !== req.user._id) {
        return next(new ForbiddenError('Can\'t delete someone else\'s post.'));
      }
      return post.remove()
        .then(() => res.send({ message: 'Post deleted' }));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Incorrect post id passed.'));
      }
      return next(err);
    });
};
