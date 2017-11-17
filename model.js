const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const redditArticleScheme = new Schema({}, { strict: false });
const RedditArticle = mongoose.model('RedditArticle', redditArticleScheme);

module.exports = RedditArticle;