const express = require('express'); // express modülü
const path = require('path')  // PATH modülü
const app = express();

/*
// Middleware Örnekleri
const myLogger = (req, res, next) => {
  console.log('Middleware Log 1');
  next(); // Middleware bir sonrakine aktarıldı.
};

const myLogger2 = (req, res, next) => {
  console.log('Middleware Log 1');
  next(); // Middleware bir sonrakine aktarıldı.
};
*/

// MIDDLEWARES
app.use(express.static('public')); // Static Files Middleware
// Middleware örneklerini çalıştırmak.
// app.use(myLogger); // Kendi oluşturduğumuz Middleware 1
// app.use(myLogger2); // Kendi oluşturduğumuz Middleware 2

app.get('/', (req, res) => {
  // Bu da bir middlewaredir.

  // Örnek "send" Gönderimi.
  /*const photo = {
    id: 1,
    name: 'Phote Name',
    description: 'Photo description',
  };
  res.send(photo);
  */

  res.sendFile(path.resolve(__dirname, 'temp/index.html'));   // Path __mkdir ile klasör bulunuyor.
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi..`);
});