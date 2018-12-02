import * as utils from '../utils';

export default function subtract({ bot, channelID, send, username, userID, message }) {
  if (!message) return;
  const number = parseInt(message, 10);
  if (isNaN(number)) {
    send('That\s not a number.. :thinking:');
    return;
  }

  const userObject = utils.getUser(userID, username);

  userObject.score = userObject.score - parseInt(message, 10);
  if (userObject.score < 0) userObject.score = 0;

  utils.saveUser(userObject);
  send(`${username}: +${message}! Total: ${userObject.score}`);
};
