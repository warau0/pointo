import * as utils from '../utils.js'

async function points(config, interaction, googleAuthClient) {
  try {
    const spreadsheet = await utils.loadSpreadsheet(config, googleAuthClient);

    const user = utils.getUserPointsRow(spreadsheet, interaction.user);
    const amount = interaction.options.get('amount').value;

    user.pointsFormula = `${user.pointsFormula}+${amount}`;
    user.points = user.points + amount;
    spreadsheet[user.id] = user;

    utils.updateSpreadsheet(config, spreadsheet, googleAuthClient);

    await interaction.reply(`:white_check_mark: ${user.name}: **${amount >= 0 ? '+' : '-'}${amount}**! Total: **${user.points}**.`);
  } catch (err) {
    console.error(err);
    await interaction.reply(':x: Failed adding points.');
  }
}

export default points
