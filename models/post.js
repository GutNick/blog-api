const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
  },
  image: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('post', postSchema);
