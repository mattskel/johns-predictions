var express = require('express');
var router = express.Router();
const googleSheetsService = require('../services/googleSheetsService.js')
const range = 'users'; // This is the spreadsheet name

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  googleSheetsService.getRange(range)
    .then((response) => {
      const status = response.status;
      if (status !== 200) {
        res.status(400).send('Something went wrong');
        return;
      }

      const data = response.data;
      const [header, ...users] = data.values;
      const foundUser = users.find((user) => user[0] === email && user[1] === password); 
      if (!foundUser) {
        res.status(400).send('Login failed. Email or password is incorrect');
        return;
      }

      res.redirect('/');
    })
    .catch((error) => {
      console.log('error', error);
      res.status(400).send('Error');
    });
});

module.exports = router;
