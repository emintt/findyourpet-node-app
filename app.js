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

// initalize sequelize with session store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const store = new SequelizeStore({
  db: sequelize
});
const csrfProtection = csrf(); 
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-'+ file.originalname);
  }
});

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
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  
  next();
});

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


sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

