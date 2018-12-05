import * as utils from '../utils';

export default function add({ send, username, userID, message, scores, sheets, sheetID } = {}) {
  if (!message) return;
  const number = parseInt(message, 10);
  if (isNaN(number)) {
    send('That\'s not a number.. :thinking:');
    return;
  }

  const userObject = utils.getUser(scores, userID, username);

  userObject.name = username; // In case user has changed their name.
  userObject.scoreFormula = utils.appendFormula(userObject.scoreFormula, number);
  userObject.score = userObject.score + number;

  utils.saveUser(sheets, sheetID, scores, userObject).then(() => {
    send(`${username}: **+${number}**! Total: **${userObject.score}**`);
  });
};
