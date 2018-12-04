export default function leaderboard({ send }) {
  send(
    ':mega: Commands can be started with \`!\`, \`-\` or \`.\`.\n' +
    '__Commands:__\n' +
    '`!ping`: Pong!\n' +
    '`!help`: List all available commands. Alt: `commands`, `h`\n' +
    '`!add <number>`: Give yourself some points. Alt: `plus`, `points`, `p`\n' +
    '`!sub <number>`: Remove some of your points. Alt: `minus`, `subtract`, `s`\n' +
    '`!leaderboard`: Link to the score spreadsheet. Alt: `hiscore`, `scores`, `hs`\n' +
    '`!reset`: Clear all scores. Alt: `archive`\n' +
    '`!reload`: Reload the spreadsheet data.'
  );
};
