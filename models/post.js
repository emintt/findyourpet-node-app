const fs = require('fs');
const path = require('path');
const { Recoverable } = require('repl');

const p = path.join(
  path.dirname(process.mainModule.filename), 
  'data', 
  'posts.json'
);

const getPostsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Post {
  constructor(title, postText, postType, petDate, gender, owner, area, city, postDate) {
    this.title = title;
    this.postText = postText;
    this.postType = postType;
    this.petDate = petDate;
    this.gender = gender;
    this.owner = owner;
    this.area = area;
    this.city = city;
    this.postDate = postDate;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      getPostsFromFile(posts => {
        posts.push(this);
        fs.writeFile(p, JSON.stringify(posts), (err) => {
          console.log(err);
        });
      });
    });
  
  }

  static fetchAll(cb) {
    getPostsFromFile(cb);
  }
};