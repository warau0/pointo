import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

export function isCommand(msg) {
  const commandChar = ['!', '.', '-'];
  return commandChar.indexOf(msg.substring(0, 1)) !== -1;
}

export function isAdmin(config, userID) {
  if (config && config.admins && config.admins.length) {
    return config.admins.indexOf(`${userID}`) !== -1;
  }
  return false;
}

export function getUser(scores, userID, name) {
  if (scores.hasOwnProperty(userID)) {
    return scores[userID];
  }

  return {
    id: userID,
    name,
    score: 0,
    scoreFormula: '=0'
  };
}

export function searchForUser(scores, query) {
  if (scores.hasOwnProperty(query)) {
    return scores[query];
  }

  return Object.values(scores).find(user => user.name.toLowerCase() == query.toLowerCase());
}

export function saveUser(sheets, sheetID, scores, user) {
  return new Promise((resolve, reject) => {
    function cb(err, res) {
      if (err) {
        console.log('Google API error:', err);
        return reject('Google API error');
      }

      return resolve();
    }

    scores[user.id] = user;

    sheets.spreadsheets.values.update({
      spreadsheetId: sheetID,
      valueInputOption: 'USER_ENTERED',
      range: `Current!A$2:D`,
      resource: { values: Object.entries(scores)
          .map(item => item[1])
          .sort((a, b) => b.score - a.score)
          .map(item => { return [
            item.id,
            item.name,
            item.scoreFormula,
            item.house,
          ] })
      }
    }, cb);
  });
}

export function fetchScores(sheets, sheetID) {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetID,
      range: 'Current!A2:D', // Sheet data selector
      valueRenderOption: 'FORMULA',
    }, (err, res) => {
      if (err) {
        console.log('Google API error:', err);
        return reject('Google API error');
      }

      const rows = res.data.values;
      if (rows && rows.length) {
        return resolve(
          rows.map((row, index) => ({
            // Order of sheet columns.
            id: row[0],
            name: row[1],
            scoreFormula: row[2] || '=0',
            score: basicFormulaTransform(row[2]),
            house: row[3] || '',
          })).reduce((map, user) => {
            map[user.id] = { ...user };
            return map;
            }, {})
        );
      } else {
        return resolve({});
      }
    });
  });
}

function basicFormulaTransform(formula) {
  if (!formula) return 0;

  if (!isNaN(parseInt(formula, 10))) return formula; // Not a formula.

  return formula
    .substring(1) // Remove '='.
    .split('+') // Can only split up formulas containing pluses.
    .reduce((add, num) => (add + parseInt(num, 10)), 0); // Add all numbers together.
}

export function appendFormula(formula, addition) {
  let newFormula = formula;
  if (!isNaN(parseInt(formula, 10))) newFormula = `=${formula}`;
  return `${newFormula}+${addition}`;
}

// @Username#1234 -> Username
// <@!502625985365542974> -> 519927985365843988
export function stripName(name) {
  return name
    .replace('@', '')
    .replace('!', '')
    .replace('<', '')
    .replace('>', '')
    .slice(0, name.indexOf('#') !== -1 ? name.indexOf('#') - 1 : name.length);
}

export function getNewGoogleToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile('token.json', JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to token.json');
      });
      callback(oAuth2Client);
    });
  });
}

export function googleAuth(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile('token.json', (err, token) => {
    if (err) return getNewGoogleToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

export function capitalize(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}