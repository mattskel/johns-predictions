var express = require('express');
var router = express.Router();
const googleSheetsService = require('../services/googleSheetsService.js')
const range = 'users'; // This is the spreadsheet name

router.get('/', function(req, res) {
  res.render('login', {baseUrl: req.baseUrl});
});

router.post('/', function(req, res) {
  var email = req.body.email;
  googleSheetsService.getRange(range)
    .then((response) => {
      const status = response.status;
      if (status !== 200) {
        res.status(400).send('Something went wrong');
        return;
      }

      const data = response.data;
      const [header, ...users] = data.values;
      const foundUser = users.find((user) => user[0] === email); 
      if (!foundUser) {
        res.status(400).send('Login failed. Email is incorrect');
        return;
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
    })
    .catch((error) => {
      console.log('error', error);
      res.status(400).send('Error');
    });
});

module.exports = router;
