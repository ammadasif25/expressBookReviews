const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password)
  {
    if(!doesExist(username))
    {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }else{
      return res.status(400).json({message: "username already exists"});
    }
  }
  return res.status(400).json({message: "username &/ password are not provided"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getBooks = new Promise((resolve, reject) => {
    resolve(books)
  }).then((success) => {

    return res.send(JSON.stringify(success));
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books[req.params.isbn]);
  }).then((success) => {
    return  res.send(JSON.stringify(success));
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    for (const key in books) {
      if(books[key].author == req.params.author)
      resolve(books[key]);
    }
  }).then((success) => {
    res.send(success);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    for (const key in books) {
      if(books[key].title == req.params.title)
        return resolve(books[key]);
    }
  }).then((success) => {
    res.send(success);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return  res.send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;
