import * as utils from '../utils';

export default function enterHouse({ send, username, userID, message, scores, sheets, sheetID } = {}) {
  if (!message) return;

  const userObject = utils.getUser(scores, userID, username);

  userObject.name = username; // In case user has changed their name.
  userObject.house = message;

  utils.saveUser(sheets, sheetID, scores, userObject).then(() => {
    send(`${username} joined **${message}**!`);
  });
};
