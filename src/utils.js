import fs from 'fs';
import * as admins from './admins';

export function isCommand(msg) {
  const commandChar = ['!', '.', '-'];

  return commandChar.indexOf(msg.substring(0, 1)) !== -1;
}

export function isAdmin(userID) {
  return admins.admins.indexOf(`${userID}`) !== -1;
}

export function getUser(userID, username) {
  const file = `db/${userID}.json`;

  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
  }

  return {
    username,
    userID,
    score: 0
  };
}

export function saveUser(user) {
  if (!fs.existsSync('db')){
    fs.mkdirSync('db');
  }
  fs.writeFileSync(`db/${user.userID}.json`, JSON.stringify(user), 'utf8')
}