const path = require('path');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const sequelize = require('./util/database');

// initalize sequelize with session store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const store = new SequelizeStore({
  db: sequelize
});

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



app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.member) {
    return next();
  }
  Member.findByPk(req.session.member.id)
    .then(member => {
      req.member = member;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(webRoutes);
app.use(authRoutes);

app.use(errorController.get404);

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
  .catch(err => {console.log(err)});

