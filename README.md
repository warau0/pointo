## Give me your points!

This a very simple bot to keep track of scores or any kind of point system.
You provide the bot with a Google spreadsheet and then anyone can tally up their own points.
Admins can also control other people's points.

### Adding the bot to your server:
1. Add to server from https://discordapp.com/api/oauth2/authorize?client_id=518608155907719168&permissions=0&scope=bot

2. Familiarize yourself with the commands using `p!help`.

3. Add yourself and other any other users you want as admins with `p!admin <user>`.

4. Set up google variables and auth with the commands `p!key <key> <value>` and `p!gauth`.
    - `GOOGLE_SHEET_NAME` example: `Page1`.
    - `GOOGLE_SHEET_ID` example: `1dZHWlxlr-CbPocQ2DB9kQH3Y7TnShSyU-N7v_wsRxjv`.

### Setting up your own instance:

1. Make a `config.json` file in project root that looks like this example:
    ```json
        {
            "DISCORD_TOKEN": "NTF54Ti33Ta1OzY1ODQzOeg2.DugcYQ.Oqsr4cbrfm2A8B_kYrOU2b2Obvi",
            "GOOGLE_CLIENT_ID": "201235522132-12lm7bdba46f21e2i5eadrca2mfjkpf0.apps.googleusercontent.com",
            "GOOGLE_CLIENT_SECRET": "n_Ej_KZp5oIo2ggo_2d2FFew",
            "GOOGLE_PROJECT_ID": "pointo-1553760236124"
        }
    ```

2. Install dependencies:\
    `yarn`

3. Build the project:\
    `yarn build`

4. Start the bot:\
    `yarn start`
