const express = require('express');
const randomString = require('../src/utils');
const router = express.Router();

// Databases
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//========= for '/'
router.get('/', (req, res) => {
  res.send('Hello!');
});

//========= for '/urls'
router.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
  };

  console.log(`Cookies! `, req.cookies)
  console.log(users);
  
  res.render('urls_index', templateVars);
});

router.post('/urls', (req, res) => {
  const UID = randomString(6);
  const longURL = req.body.longURL;
  urlDatabase[UID] = longURL;

  res.redirect(`/urls/${UID}`);
});


//========= for '/urls/~'
router.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

router.get('/urls/new', (req, res) => {
  let templateVars = {
    username: req.cookies['username']
  };
  res.render('urls_new', templateVars);
});

router.get('/urls/:shortURL', (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username']
  };
  res.render('urls_show', templateVars);
});

router.post('/urls/:newURL', (req, res) => {
  const key = req.params.newURL;
  const newURL = req.body.newURL;
  urlDatabase[key] = newURL;

  res.redirect('/urls');
});

//========= for '/u/~'
router.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];console.log(longURL);

  res.redirect(longURL);
});

//========= for '/u/~/delete'
router.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//========= for '/login'
router.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  console.log('Here are the cookies: ', req.cookies);
  res.redirect('/urls');
});

//========= for '/logout'
router.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//========= for '/register'
router.get('/register', (req, res) => {
  let templateVars = {
    username: req.cookies['username']
  };
  res.render('urls_register', templateVars);
});

router.post('/register', (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;
  const userID = randomString(5); // user ID length 5

  users[userID] = {
    id: userID,
    email: userEmail,
    password: userPass
  }

  res.cookie('user_id', userID);
  res.redirect('/urls');
});


module.exports = router;