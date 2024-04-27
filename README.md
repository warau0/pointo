## Give me your points!

This a very simple bot to keep track of scores or any kind of point system.
You provide the bot with a Google spreadsheet and then anyone can tally up their own points.

### Application requirements:

1. A google project with the Google Sheets API enabled and an OAuth 2.0 client: https://console.cloud.google.com/welcome

2. A Discord application: https://discord.com/developers/applications

3. A Google sheet that will hold all the points.

### Setup

1. Make a `config.json` file in project root that looks like this example (with your own values):
```json
    {
        "DISCORD_CLIENT_ID": "1232615847641129322",
        "DISCORD_TOKEN": "MTIyMTymMDg3MaY6Mxe1QZNxQQ.Glo_Yc....-A",
        "GOOGLE_CLIENT_ID": "100023492722-....apps.googleusercontent.com",
        "GOOGLE_CLIENT_SECRET": "GOCSPX-...-2h",

        "GOOGLE_SHEET_ID": "1vo6hf...hWrBu7VlKto",
        "GOOGLE_SHEET_NAME": "Current"
    }
```

2. Install dependencies:\
    `yarn`

3. Start the bot:\
    `yarn start`
