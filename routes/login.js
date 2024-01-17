var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  res.redirect('/');
});

module.exports = router;
