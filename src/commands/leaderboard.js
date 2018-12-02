export default function leaderboard({ send, sheetID }) {
  send(':trophy: **Houses leaderboard**:');
  send(`https://docs.google.com/spreadsheets/d/${sheetID}`);
};
