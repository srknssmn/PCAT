// *** MODULES ***
const express = require('express'); // express modülü
const mongoose = require('mongoose'); // mongoose modülü
const fileUpload = require('express-fileupload'); // fileupload modülü
const methodOverride = require('method-override'); // override modülü

const ejs = require('ejs'); // EJS modülü
const path = require('path'); // PATH modülü
const fs = require('fs');
const Photo = require('./models/Photo'); // Photo dosyası içeri alındı.

const app = express();

//connect DB
// Kendi sunucumuzda database oluşturuldu.
// mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db');
mongoose.connect('mongodb+srv://srknssmn:seko2405@cluster0.kj73wkn.mongodb.net/pcat-db?retryWrites=true&w=majority').then(() => {
  console.log('DB CONNECTED')
}).catch((err) => {
  console.log(err)
})


// *** TEMPLATE ENGINE ***
// EJS - Dinamik modülünü aktifleştirdir.
app.set('view engine', 'ejs');

// *** MIDDLEWARES ***
// Statik modülü aktifleştirildi.
app.use(express.static('public')); // Static Files Middleware
// Forma yazılan String verileri okumak için çalıştırılan modüller.
app.use(express.urlencoded({ extended: true })); //url datasını okumak
app.use(express.json()); // urlde okunan datayı json formatına çevirmek.
// File upload modülünü çalıştırıyoruz.
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

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

  //PAGINATION OLAN HALİ
  const page = req.query.page || 1; // page girmezse 1. sayfa açılacak
  const photosPerPage = 2; // Bir sayfada gösterilecek photo sayısı

  const totalPhotos = await Photo.find().countDocuments(); // Toplam photo sayısı
  // tüm photoları sıralıyor ve limitliyoruz.
  const photos = await Photo.find({})
  .sort('-dateCreated')
  .skip((page-1) * photosPerPage) // Bir önceki sayfadaki gösterilecek photoları pas geçiyor.
  .limit(photosPerPage) // gösterilecek sayfa sayısını limitliyoruz.

  res.render('index', {
    photos: photos, // index sayfasına Photos gönderiliyor
    current: page,  // index sayfasına page bilgisi gönderiliyor
    pages: Math.ceil(totalPhotos / photosPerPage) // index sayfasına gösterilecek page sayıgısı gönderiliyor
  });

  /* PAGINATION OLMAYAN HALİ 
  const photos = await Photo.find({}).sort('-dateCreated'); // sort datecreated ile postları sıraladık.
  res.render('index', {
    photos,
  });
  */
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

// app.post 'un amacı: forma girilen bilgileri database'e kaydetmek.
// add.ejs de form post ve formda yazılan action: /photos burada yakalanıyor.
app.post('/photos', async (req, res) => {
  //console.log(req.files.image); //Formda input name: image //Yapılan isteğin files kısmı console a yazdırılıyor.
  // console.log(req.body);  //Yapılan isteğin body kısmı (String) console a yazdırılıyor.
  //await Photo.create(req.body); // Photo.js e formdan gelen bilgi gönderiliyor.
  //res.redirect('/'); // Ana sayfaya yönlendiriyor ve işlemi kapatıyor.

  const uploadDir = 'public/uploads';
  // upload klasörünün varlığını kontrol ederek, yoksa oluşturuyoruz.
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadImage.name; //Yüklenen görselin yeni klasör adı ile ağ adını oluşturuyoruz.

  // async function tekrar tanımlanarak; mv function'a parametre olarak ekleniyor.
  // yüklenen görsel, istediğimiz klasöre istediğimiz bilgilerle move ediliyor yani gönderiliyor.
  // database'te tüm photo bilgileriyle (string, image) yeni veri (create) oluşturuyoruz.
  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name, //image bilgisini de gönderiyoruz.
    });
    res.redirect('/');
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    //photo.ejs dosyasına photo bilgilerini gönderiyoruz.
    photo,
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    //edit.ejs dosyasına photo bilgilerini gönderiyoruz.
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  // photo'yu yakalıyoruz.
  const photo = await Photo.findOne({ _id: req.params.id });
  // photo bilgilerini güncelliyoruz.
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  // yeni bilgiler kaydedildikten sonra, aynı sayfaya geri dönecek.
  res.redirect(`/photos/${req.params.id}`);
});

// GÖRSELİ UPLOADS KLASÖRÜNDEN SİLMEDEN DELETE İŞLEMİ
/*
app.delete('/photos/:id', async (req,res) => {
  await Photo.findByIdAndRemove(req.params.id)
  res.redirect('/');  // Ana sayfaya yönlendirme.
})
*/

// GÖRSELİ UPLOADS KLASÖRÜNDEN SİLEREK YAPILAN DELETE İŞLEMİ
app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);

  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/'); // Ana sayfaya yönlendirme.
});

// const port =3000;
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi..`);
});