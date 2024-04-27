import * as utils from '../utils.js'

async function leaderboard(config, interaction, googleAuthClient) {
  try {
    const spreadsheet = await utils.loadSpreadsheet(config, googleAuthClient)
    
    if (Object.keys(spreadsheet).length === 0) await interaction.reply("Leaderboard is empty.")
    else {
      const count = 10;

      let response = ':trophy: **Houses Leaderboard**:\n';

      Object.keys(spreadsheet)
        .sort((a, b) => spreadsheet[b].points - spreadsheet[a].points)
        .filter((_, index) => index < count)
        .forEach((key, index) => {
          if (spreadsheet.hasOwnProperty(key)) {
            response += `**#${index + 1}** ${spreadsheet[key].name}: **${spreadsheet[key].points}**\n`;
          }
        });

      await interaction.reply(response);
    }
  } catch (err) {
    console.error(err);
    await interaction.reply(':x: Failed getting the leaderboard');
  }
}

export default leaderboard
