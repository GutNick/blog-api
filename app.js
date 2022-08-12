require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const user = require('./routes/user');
const post = require('./routes/post');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001, DB_ADDRESS = 'mongodb://localhost:27017/mydb' } = process.env;

const app = express();
mongoose.connect(DB_ADDRESS);
const corsOptions = {
  origin: ['http://localhost:3000'],
};
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/post', post);
app.use('/user', user);
app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
