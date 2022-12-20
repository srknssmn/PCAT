const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', PhotoSchema);
// 'Photo' dan dolayı oto. olarak photos collection oluşturuldu.

module.exports = Photo; // Photo dışarıya açıldı.