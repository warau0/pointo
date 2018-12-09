export default function help({ send } = {}) {
  send(
    ':mega: Commands can be started with \`!\`, \`-\` or \`.\`.\n' +
    '__Commands:__\n' +
    '`!ping`: Pong!\n' +
    '`!help`: List all available commands. Alt: `commands`\n' +
    '`!add <number>`: Give yourself some points. Alt: `plus`, `points`\n' +
    '`!sub <number>`: Remove some of your points. Alt: `minus`, `subtract`\n' +
    '`!house <house name>`: Join a house. Alt: `enter`\n' +
    '`!leaderboard`: Link to the score spreadsheet. Alt `data`, `scoreboard`\n' +
    '`!scores`: Print all scores to chat. Alt: `print`\n' +
    '`!reload`: Reload the spreadsheet data.\n' +
    '__Admins:__\n' +
    '`!give <userID/name> <number>`: Give a user some points.\n' +
    '`!take <userID/name> <number>`: Take some points from a user.\n' +
    '`!assign <userID/name> <house name>`: Assign a user to a house.'
    // '`!reset`: Clear all scores. Alt: `archive`'
  );
};
