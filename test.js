const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//connect DB
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db');

//create schema (şablon)
// Şablonun veri özellikleri belirleniyor.
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model('Photo', PhotoSchema);
// 'Photo' dan dolayı oto. olarak photos collection oluşturuldu.

mongoose.set('strictQuery', true); // DeprecationWarning hatasını düzeltmek için.

//create a photo
/*
Photo.create({
    title: 'Photo Title 3',
    description: 'Photo description 3 lorem ipsum',
  });


//read photo
Photo.find({}, (err, data) => {
  console.log(data);
});


//update photo
const id = '63a19596fe7be2f802146d05';

Photo.findByIdAndUpdate(
  id,
  {
    title: 'Photo Title 111 Updated',
    description: 'Photo description 111 Updated',
  },
  {
    new: true   // Console logda yeni veriyi yazması için!
  },
  (err, data) => {
    console.log(data);
  }
);
*/

//delete a photo
const id = "63a19a0add7ae0bf8d9ffcce" 
Photo.findByIdAndDelete(id, (err,data) => {
    console.log("Photo is removed")
} )