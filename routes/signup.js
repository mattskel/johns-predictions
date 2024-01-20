var express = require('express');
var router = express.Router();
const googleSheetsService = require('../services/googleSheetsService.js')
const range = 'users'; // This is the spreadsheet name

router.get('/', function(req, res) {
  res.render('login', {baseUrl: req.baseUrl});
});

router.post('/', async function(req, res) {
  var email = req.body.email;
  const getResponse = await googleSheetsService.getRange(range)
  const status = getResponse.status;
  if (status !== 200) {
    res.status(400).send('Something went wrong');
    return;
  }

  const data = getResponse.data;
  const [header, ...users] = data.values;
  const foundUser = users.find((user) => user[0] === email); 
  if (foundUser) {
    res.status(400).send('Email is already in use.');
    return;
  }

  const appendResponse = await googleSheetsService.appendRange(range, [[email]])
  if (!appendResponse || appendResponse.status !== 200) {
    res.status(400).send('Something went wrong');
  }

  req.session.regenerate(function (err) {
    if (err) next(err)

    // store user information in session, typically a user id
    req.session.user = email 

    // save the session before redirection to ensure
    // page load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err)

      res.redirect('/');
    })
  })
});

module.exports = router;
