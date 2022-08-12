const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, about, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, about, password: hash,
    }))
    .then((user) => res.send({
      data: {
        _id: user._id, name: user.name, email: user.email, about: user.about,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect user data passed.'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('User with this email is already registered.'));
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => next(new NotFoundError('User not found')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Incorrect user data passed.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email, about } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { name, email, about },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => next(new NotFoundError('User not found')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Incorrect user data passed.'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('User with this email is already registered.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`Incorrect user data passed: ${Object.values(err.errors).map((error) => error.message).join(', ')}.`));
      }
      return next(err);
    });
};

module.exports.deleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .orFail(() => next(new NotFoundError('User not found')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Incorrect user data passed.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
