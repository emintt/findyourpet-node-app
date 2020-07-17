const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename), 
  'data', 
  'saved-post.json'
);

module.exports = class SavedPosts {
  static addPost(id) {
    // Fetch the previous post in tab, if err occur, there is no file yet
    fs.readFile(p, (err, fileContent) => {
      let savedPosts = { posts: [] };
      if (!err) {
        savedPosts = JSON.parse(fileContent);
      }
      // Analyze the tab to find existing post
      const existingPostIndex = savedPosts.posts.findIndex(post => post.id === id);
      const existingPost = savedPosts.posts[existingPostIndex];
      let updatedPost;
      // Add new product
      if (existingPost) {
        updatedPost = {...existingPost};
        savedPosts.posts = [...savedPosts.posts]; //copy old array
        savedPosts.posts[existingPostIndex] = updatedPost;
      } else {
        updatedPost = { id: id };
        savedPosts.posts = [...savedPosts.posts, updatedPost];
      }
      fs.writeFile(p, JSON.stringify(savedPosts), err => {
        console.log(err);
      });
    });
  }

  static deletePost(id) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {  
        return;
      }
      const updatedSavedPosts = {...JSON.parse(fileContent)};
      updatedSavedPosts.posts = updatedSavedPosts.posts.filter(p => p.id !== id);
      // if there is no post, stop and don't do anything
      if (!post) {
        return;
      }
      fs.writeFile(p, JSON.stringify(updatedSavedPosts), err => {
        console.log(err);
      });
    });
  }

  static getSavedPosts(cb) {
    fs.readFile(p, (err, fileContent) => {
      const savedPosts = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(savedPosts);
      }
    });
  }
}