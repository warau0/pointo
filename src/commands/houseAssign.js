import * as utils from '../utils';

export default function houseAssign({ send, config, userID, message, scores, sheets, sheetID } = {}) {
  if (!utils.isAdmin(config, userID)) {
    send('Only admins can do that.');
    return;
  }

  if (!message) return;
  const msgPieces = message.split(' ');
  if (msgPieces.length < 2) return;
  const query = utils.stripName(msgPieces[0]);
  const house = utils.capitalize(msgPieces.slice(1, msgPieces.length).join(' '));

  const userObject = utils.searchForUser(scores, query);

  if (!userObject) {
    send(`No user in data sheet found matching \'${query}\'.`);
    return;
  }

  userObject.house = house;

  utils.saveUser(sheets, sheetID, scores, userObject).then(() => {
    send(`${userObject.name} joined **${house}**!`);
  });
};
