var express = require('express');
var router = express.Router();

const googleSheetsService = require('../services/googleSheetsService.js')

router.param('year', function(req, res, next, year) {
  googleSheetsService.getRange(year)
    .then((response) => {
      const status = response.status;
      if (status !== 200) {
        res.status(400).send('Something went wrong');
        return;
      }

      const data = response.data;
      const [questions, options, answers = [], actuals = [], ...predictions] = data.values;
      if (!questions || !options) {
        res.status(400).send('Something went wrong');
        return;
      }

      // Remove the first element for each array
      // First element is always blank
      req.questions = questions.slice(1);
      req.options = options.slice(1)
        .map((str) => str.split(','));

      req.answers = answers.slice(1);
      req.actuals = actuals.slice(1);
      req.predictions = predictions;
      next();
    })
    .catch((error) => {
      res.status(400).send('Error');
    })

});

router.get('/:year/submit', function(req, res, next) {
  const email = req.session.user;
  const predictions = req.predictions;
  const foundUserPrediction = predictions.find((prediction) => prediction[0] === email); 
  if (foundUserPrediction) {
    res.status(400).send('Already submitted');
    return;
  }

  const questions = req.questions;
  const options = req.options;
  res.render('submit', {questions, options});
});

router.post('/:year/submit', function(req, res, next) {
  const email = req.session.user
  const questions = req.questions
  const row = [email]
  questions.forEach((question) => row.push(req.body[question] || ''));
  const values = [row];
 
  const year = req.params.year
  googleSheetsService.appendRange(year, values) 
  res.redirect('/');

});

router.get('/:year/results', function(req, res) {
  const email = req.session.user;
  const predictions = req.predictions
    .map((prediction) => prediction.slice(1));

  const questions = req.questions;
  const answers = req.answers;
  const actuals = req.actuals;
  const users = req.predictions
    .map((prediction) => prediction[0])
    .map((email) => email.split('@')[0]);
      
  const tableHeaders = ['', 'Answer', ...users];
  const tableRows = questions
    .map((question, index) => {
      const actual = actuals[index];
      const userPredictions = predictions
        .map((prediction) => prediction[index + 1]);

      return [question, actual, ...userPredictions];
    });
  
  res.render('results', {tableHeaders, tableRows, answers, questions, predictions, actuals});
});

module.exports = router;
