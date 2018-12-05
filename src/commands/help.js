export default function leaderboard({ send } = {}) {
  send(
    ':mega: Commands can be started with \`!\`, \`-\` or \`.\`.\n' +
    '__Commands:__\n' +
    '`!ping`: Pong!\n' +
    '`!help`: List all available commands. Alt: `commands`\n' +
    '`!add <number>`: Give yourself some points. Alt: `plus`, `points`\n' +
    '`!sub <number>`: Remove some of your points. Alt: `minus`, `subtract`\n' +
    '`!leaderboard`: Link to the score spreadsheet. Alt: `scores`\n' +
    '`!print`: Print all scores to chat.\n' +
    '`!reload`: Reload the spreadsheet data.'
    // TODO '__Admins:__\n' +
    // '`!give <userID> <number>`: Give a user some points.\n' +
    // '`!take <userID> <number>`: Take some points from a user.\n' +
    // '`!reset`: Clear all scores. Alt: `archive`'
  );
};
