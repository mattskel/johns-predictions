var express = require('express');
var router = express.Router();

const googleSheetsService = require('../services/googleSheetsService.js')
const range = 'admin';

/* GET home page. */
router.get('/', function(req, res, next) {
  googleSheetsService.getRange(range)
    .then((response) => {
      const status = response.status;
      if (status !== 200) {
        res.status(400).send('Something went wrong');
        return;
      }

      const data = response.data;
      const [header, ...rows] = data.values;
      if (!header || !rows) {
        res.status(400).send('Something went wrong');
        return;
      }

      const years = rows.map(([value, status]) => ({value, status}))
      res.render('index', { title: 'Express', years });
    })
    .catch((error) => {
      res.status(400).send('Error');
    });
});

module.exports = router;
