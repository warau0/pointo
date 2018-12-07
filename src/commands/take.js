import * as utils from '../utils';

export default function take({ send, config, userID, message, scores, sheets, sheetID } = {}) {
  if (!utils.isAdmin(config, userID)) {
    send('Only admins can do that.');
    return;
  }

  if (!message) return;
  const msgPieces = message.split(' ');
  if (msgPieces.length < 2) return;
  const query = utils.stripName(msgPieces.slice(0, msgPieces.length - 1).join(' '));
  const number = parseInt(msgPieces[msgPieces.length - 1], 10);

  if (isNaN(number)) {
    send('That\'s not a number.. :thinking:');
    return;
  }

  const userObject = utils.searchForUser(scores, query);

  if (!userObject) {
    send(`No user in data sheet found matching \'${query}\'.`);
    return;
  }

  const newScore = number > userObject.score ? 0 : userObject.score - number;

  userObject.scoreFormula = utils.appendFormula(userObject.scoreFormula, `-${newScore ? number : userObject.score}`);
  userObject.score = newScore;

  utils.saveUser(sheets, sheetID, scores, userObject).then(() => {
    send(`${userObject.name}: **-${number}**! Total: **${userObject.score}**`);
  });
};
