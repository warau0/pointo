## Feed me points!

### Setting up:

1. Make a `config.json` file in project root like so:
    ```json
    {
      "discord": "DISCORD_API_KEY",
      "google": "GOOGLE_API_KEY",
      "sheetID": "GOOGLE_SHEET_ID",
      "admins": [
        "YOUR_USER_ID",
        "ANOTHER_ADMINS_USER_ID"
      ]
    }
    ```
    - `DISCORD_API_KEY` and `GOOGLE_API_KEY` self explanatory.
    - `GOOGLE_SHEET_ID` is a google sheet where all the user's points will be stored.
    - `admins` is an array of user id's for people with access to the admin commands.
        - Important to keep userIDs as strings, as they will overflow as number.

2. Get `credentials.json` file from googleapis after setting up google sheet api and place it in project root.

3. Install dependencies:\
    `yarn`

4. Build and run the bot:\
    `yarn start`