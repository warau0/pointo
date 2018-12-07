import * as utils from '../utils';

export default function give({ send, config, userID, message, scores, sheets, sheetID } = {}) {
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

  userObject.scoreFormula = utils.appendFormula(userObject.scoreFormula, number);
  userObject.score = userObject.score + number;

  utils.saveUser(sheets, sheetID, scores, userObject).then(() => {
    send(`${userObject.name}: **+${number}**! Total: **${userObject.score}**`);
  });
};
