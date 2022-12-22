// *** MODULES ***
const express = require('express'); // express modülü
const mongoose = require('mongoose'); // mongoose modülü

const ejs = require('ejs'); // EJS modülü
const path = require('path'); // PATH modülü
const Photo = require('./models/Photo') // Photo dosyası içeri alındı.

const app = express();

//connect DB
// Kendi sunucumuzda database oluşturuldu.
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db');

// *** TEMPLATE ENGINE ***
// EJS - Dinamik modülünü aktifleştirdir.
app.set('view engine', 'ejs');

// *** MIDDLEWARES ***
// Statik modülü aktifleştirildi.
app.use(express.static('public')); // Static Files Middleware
// Forma yazılan String verileri okumak için çalıştırılan modüller.
app.use(express.urlencoded({extended:true})) //url datasını okumak
app.use(express.json()) // urlde okunan datayı json formatına çevirmek.

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
// Middleware örneklerini çalıştırmak.
app.use(myLogger); // Kendi oluşturduğumuz Middleware 1
app.use(myLogger2); // Kendi oluşturduğumuz Middleware 2
*/

// ROUTES
// app.get de bir Middlewaredir.
app.get('/', async (req, res) => {
  const photos = await Photo.find({})
  res.render('index', {
    photos
  });
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
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

// Form post
// add.ejs de form post ve formda yazılan action: /photos burada yakalanıyor.
app.post('/photos', async (req, res) => {
  // console.log(req.body);  //Yapılan isteğin body kısmı console a yazdırılıyor.
  await Photo.create(req.body) // Photo.js e formdan gelen bilgi gönderiliyor.
  res.redirect('/') // Ana sayfaya yönlendiriyor ve işlemi kapatıyor.
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  res.render('photo', {
    photo
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi..`);
});