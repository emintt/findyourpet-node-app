const path = require('path');

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const adminRoutes = require('./routes/admin');
const webRoutes = require('./routes/web');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Region = require('./models/region');
const City = require('./models/city');
const PostcodeArea = require('./models/postcodeArea');
const Image = require('./models/image');
const Member = require('./models/member');
const Message = require('./models/message');
const PetType = require('./models/petType');
const Post = require('./models/post');
const PostType = require('./models/postType');


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(webRoutes);
app.use(errorController.get404);

Region.hasMany(City, { foreignKey: 'regionName', sourceKey: 'name' });
City.belongsTo(Region, { foreignKey: 'regionName', targetKey: 'name' });

City.hasMany(PostcodeArea, { foreignKey: 'cityName', sourceKey: 'name' });
PostcodeArea.belongsTo(City, { foreignKey: 'cityName', targetKey: 'name' });

PostcodeArea.hasMany(Post, { foreignKey:'areaName' });
Post.belongsTo(PostcodeArea, { foreignKey: 'areaName' });

PostType.hasMany(Post);
Post.belongsTo(PostType);

Member.hasMany(Post, { foreignKey: { allowNull: false }, onDelete: 'CASCADE'});
Post.belongsTo(Member);

Post.hasMany(Message, { foreignKey: { allowNull: false }});
Message.belongsTo(Post, { foreignKey: { allowNull: false }});

Member.hasMany(Message, { foreignKey: { allowNull: false }});
Message.belongsTo(Member, { foreignKey: { allowNull: false }});

PetType.hasMany(Post, { foreignKey: { allowNull: false }});
Post.belongsTo(PetType, { foreignKey: { allowNull: false }});

Post.hasMany(Image, { foreignKey: { allowNull: false }});
Image.belongsTo(Post, { foreignKey: { allowNull: false }});


sequelize
  .sync({ force: true })
  .then(result => {
    console.log(result);
    app.listen(3000); 
  })
  .catch(err => {console.log(err)});

