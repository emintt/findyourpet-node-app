const path = require('path');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const sequelize = require('./util/database');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

// initalize sequelize with session store to store session in database
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
// initilize a new store in a constant then pass database requirements to it
const store = new SequelizeStore({
  db: sequelize
});
// csrf() use session as default
const csrfProtection = csrf(); 

// configure file storage for image
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // it is ok to store null (when error)
    cb(null, 'images');
  },
  // concatenate name of image to avoid image with the same name
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-'+ file.originalname);
  }
});

// file filter for image
const fileFilter = (req, file, cb) => {
   if (
     file.mimetype === 'image/png' ||
     file.mimetype === 'image/jpg' ||
     file.mimetype === 'image/jpeg'
   ) {
    cb(null, true);
   } else {
    cb(null, false);
   }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const webRoutes = require('./routes/web');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');




const Member = require('./models/member');
const PetType = require('./models/petType');
const PostType = require('./models/postType');
const Post = require('./models/post');
const Image = require('./models/image');
const Message = require('./models/message');
const PetGender = require('./models/petGender');
const PostcodeArea = require('./models/postcodeArea');
const City = require('./models/city');
const Region = require('./models/region');





app.use(bodyParser.urlencoded({ extended: false }));
//use multer as middleware,we expect just 1 file, image (name attribute on view)
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    // add store option to where we used session, session db will be store in there
    store: store
  })
);
// this must be after session middleware
app.use(csrfProtection);
app.use(flash());
// pass data to view                                                                                 
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  
  next();
});

// member middleware
app.use((req, res, next) => {
  if (!req.session.member) {
    return next();
  }
  Member.findByPk(req.session.member.id)
    .then(member => {
      if (!member) {
        return next();
      }
      req.member = member;
      res.locals.memberName = req.member.name;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// add /admin in the beginning of all adminRoutes
app.use('/admin', adminRoutes);
app.use(webRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', { 
  pageTitle: 'Error',
  isAuthenticated: req.session.isLoggedIn,
  memberName: req.session.member.name
  });
});

// add association between models
Region.hasMany(City, { foreignKey: { name: 'regionName', allowNull: false } });
City.belongsTo(Region, { foreignKey: { name: 'regionName', allowNull: false } });

City.hasMany(PostcodeArea, { foreignKey: { name: 'cityName', allowNull: false } });
PostcodeArea.belongsTo(City, { foreignKey: { name: 'cityName', allowNull: false } });

Post.belongsTo(PostcodeArea, { foreignKey: { name: 'postcode', allowNull: false } });
PostcodeArea.hasMany(Post, { foreignKey:{ name: 'postcode', allowNull: false } });

PostType.hasMany(Post, { foreignKey: { allowNull: false } });
Post.belongsTo(PostType, { foreignKey: { allowNull: false } });

PetType.hasMany(Post, { foreignKey: { allowNull: false } });
Post.belongsTo(PetType, { foreignKey: { allowNull: false } });

PetGender.hasMany(Post, { foreignKey: { allowNull: false } });
Post.belongsTo(PetGender, { foreignKey: { allowNull: false } });

Member.hasMany(Post, { foreignKey: { allowNull: false }, onDelete: 'CASCADE'});
Post.belongsTo(Member);

Member.hasMany(Message, { foreignKey: { allowNull: false }});
Message.belongsTo(Member, { foreignKey: { allowNull: false }});

Post.hasMany(Message, { foreignKey: { allowNull: false }});
Message.belongsTo(Post, { foreignKey: { allowNull: false }});

Post.hasMany(Image, { foreignKey: { allowNull: false }, onDelete: 'CASCADE'}); // delete post -> delete image
Image.belongsTo(Post, { foreignKey: { allowNull: false }});

// sync models to database
sequelize
  .sync()
  .then(result => {
    app.listen(3000);
    console.log('findyourpet app listening at port 3000');
  })
  .catch(err => {
    console.log(err);
  });

