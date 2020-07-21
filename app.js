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
const Member = require('./models/member');
const PetType = require('./models/petType');
const PostType = require('./models/postType');
const Post = require('./models/post');
const Image = require('./models/image');
const Message = require('./models/message');



app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(webRoutes);
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

Member.hasMany(Post, { foreignKey: { allowNull: false }, onDelete: 'CASCADE'});
Post.belongsTo(Member);

Member.hasMany(Message, { foreignKey: { allowNull: false }});
Message.belongsTo(Member, { foreignKey: { allowNull: false }});

Post.hasMany(Message, { foreignKey: { allowNull: false }});
Message.belongsTo(Post, { foreignKey: { allowNull: false }});

Post.hasMany(Image, { foreignKey: { allowNull: false }});
Image.belongsTo(Post, { foreignKey: { allowNull: false }});


sequelize
  .sync()
  .then(result => {
    console.log(result);
    app.listen(3000); 
  })
  .catch(err => {console.log(err)});

