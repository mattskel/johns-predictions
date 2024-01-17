const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
require('dotenv').config();

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
const spreadsheetId = '1KnLQgFO94jfBR-fV9VP8a-MImPyMoph6VyXL8cGbGv0'
const service = google.sheets({version: 'v4', auth});

function appendRange(range, values) {
  const valueInputOption = 'RAW';
  const resource =  {values};
  return service.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption,
    resource,
  });
}

function getRange(range) {
  return service.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
};

module.exports = {
  appendRange,
  getRange,
};

