import * as utils from '../utils';

export default function subtract({ send, username, userID, message, scores, sheets, sheetID }) {
  if (!message) return;
  const number = parseInt(message, 10);
  if (isNaN(number)) {
    send('That\'s not a number.. :thinking:');
    return;
  }

  const userObject = utils.getUser(scores, userID, username);
  const newScore = number > userObject.score ? 0 : userObject.score - number;

  userObject.name = username; // In case user has changed their name.
  userObject.scoreFormula = utils.appendFormula(userObject.scoreFormula, `-${newScore ? number : userObject.score}`);
  userObject.score = newScore;

  utils.saveUser(sheets, sheetID, scores,  userObject).then(() => {
    send(`${username}: **-${message}**! Total: **${userObject.score}**`);
  });
};
