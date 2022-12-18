const express = require('express'); // express modülü
const ejs = require('ejs');
const path = require('path'); // PATH modülü

const app = express();

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

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

// ROUTES
// app.get de bir Middlewaredir.
app.get('/', (req, res) => {
  // Örnek "send" Gönderimi.
  /*const photo = {
    id: 1,
    name: 'Phote Name',
    description: 'Photo description',
  };
  res.send(photo);
  */
  // ejs olmadan çalıştırmak için bu şekilde.
  // res.sendFile(path.resolve(__dirname, 'temp/index.html')); // Path __mkdir ile klasör bulunuyor.
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi..`);
});
