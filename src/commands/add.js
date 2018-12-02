export default function add({ bot, channelID, send, username, userID, message }) {
  if (!message) return;

    const number = parseInt(message, 10);
    if (isNaN(number)) {
      send('That\s not a number.. :thinking:');
      return;
    }

  send(`${username}: +${message}!`);
};
