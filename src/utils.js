import { google } from 'googleapis'

export function sheetFormulaTransform(formula) {
  if (!formula) return 0;
  if (!isNaN(parseInt(formula, 10))) return formula;

  return formula
    .substring(1)
    .split('+')
    .reduce((add, num) => (add + parseInt(num, 10)), 0);
}

export function loadSpreadsheet(config, googleAuthClient) {
  const sheets = google.sheets({ version: 'v4', auth: googleAuthClient });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: config.GOOGLE_SHEET_ID,
      valueRenderOption: 'FORMULA',
      range: `${config.GOOGLE_SHEET_NAME}!A2:D`,
    }, async (err, res) => {
        if (err) {
          console.error(err);
          reject("Google sheets API error.")
        } else {
          const rows = res.data.values;
          if (rows && rows.length) {
            resolve(
              rows.map(row => ({
                id: row[0],
                name: row[1],
                pointsFormula: row[2] || '=0',
                points: sheetFormulaTransform(row[2]),
                house: row[3] || '-',
              })).reduce((map, user) => {
                map[user.id] = { ...user };
                return map;
              }, {})
            );
          } else {
            resolve({});
          }
        }
      });
  });
}

export function getUserPointsRow(spreadsheet, user) {
  return spreadsheet[user.id]
  ? spreadsheet[user.id]
  : {
    id: user.id,
    name: user.username,
    points: 0,
    pointsFormula: '=0',
    house: '-'
  };
}

export function updateSpreadsheet(config, spreadsheet, googleAuthClient) {
  const sheets = google.sheets({ version: 'v4', auth: googleAuthClient });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.update({
      spreadsheetId: config.GOOGLE_SHEET_ID,
      valueInputOption: 'USER_ENTERED',
      range: `${config.GOOGLE_SHEET_NAME}!A2:D`,
      resource: { values: Object.entries(spreadsheet)
        .map(item => item[1]) // Get value from key value pair.
        .sort((a, b) => b.points - a.points) // Sort points
        .map(item => ([ // Format row.
          item.id,
          item.name,
          item.pointsFormula,
          item.house,
        ]))
      }
    }, err => {
      if (err) {
        console.error(err);
        reject("Google sheets API error.")
      } else {
        resolve();
      }
    });
  });
}
