export default function leaderboard({ send, sheetID }) {
  send(`:trophy: **Houses leaderboard**:\n` +
    `https://docs.google.com/spreadsheets/d/${sheetID}`);
};
