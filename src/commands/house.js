import * as utils from '../utils.js'

async function house(config, interaction, googleAuthClient) {
  try {
    const spreadsheet = await utils.loadSpreadsheet(config, googleAuthClient);

    const user = utils.getUserPointsRow(spreadsheet, interaction.options.getUser('user'));
    const house = interaction.options.get('house').value

    user.house = house;
    spreadsheet[user.id] = user;

    utils.updateSpreadsheet(config, spreadsheet, googleAuthClient);

    await interaction.reply(`:white_check_mark: **${user.name}** added to the **${house}** house.`);
  } catch (err) {
    console.error(err);
    await interaction.reply(':x: Failed adding to house.');
  }
}

export default house
