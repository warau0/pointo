export default function leaderboard({ send }) {
  send(
    'Commands:\n' +
    '!help: List all available commands.\n' +
    '!add <number>: Give yourself some points.\n' +
    '!sub <number>: Remove some of your points.\n' +
    '!archive: (Admins only): Archive all points to start fresh.'
  );
};
