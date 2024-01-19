const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let valid = users.filter((user) => {
    return user.username === username && user.password === password
  });
  return valid.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password)
  {
    return res.status(404).json({message: "Error logging in"})
  }
  if(authenticatedUser(username, password))
  {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    // return res.send(req.session);

    return res.status(200).json({message: "User successfully logged in"});
  }
  return res.status(208).json({message: "incorrent password"});

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // books[req.params.isbn].reviews[req.session.username] = req.query.review; 
  books[req.params.isbn].reviews[req.session.authorization.username] = req.query.review; 
  return res.send(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  delete books[req.params.isbn].reviews[req.session.authorization.username]
  return res.send(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
