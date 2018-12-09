import * as utils from '../utils';

export default function houseEnter({ send, username, userID, message, scores, sheets, sheetID } = {}) {
  if (!message) return;

  const userObject = utils.getUser(scores, userID, username);

  userObject.name = username; // In case user has changed their name.
  userObject.house = utils.capitalize(message);

  utils.saveUser(sheets, sheetID, scores, userObject).then(() => {
    send(`${userObject.name} joined **${userObject.house}**!`);
  });
};
