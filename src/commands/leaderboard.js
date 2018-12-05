export default function leaderboard({ send, sheetID, scores } = {}) {
  let msg = ':trophy: **Houses leaderboard**:\n';

  if (!scores) {
    msg += `https://docs.google.com/spreadsheets/d/${sheetID}`;
  } else {
    Object.keys(scores).forEach((key, index) => {
      if (scores.hasOwnProperty(key)) {
        msg += `**#${index + 1}** ${scores[key].name}: **${scores[key].score}**\n`;
      }
    });
  }

  send(msg);
};
