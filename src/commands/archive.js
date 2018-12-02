import fs from 'fs';
import * as utils from '../utils';

export default function archive({ send, userID }) {
  if (!utils.isAdmin(userID)) {
    send('Only admins can do that.');
    return;
  }

  if (!fs.existsSync('db')) {
    send('Nothing to archive.');
    return;
  }

  if (!fs.existsSync('archive')) {
    fs.mkdirSync('archive');
  }

  fs.renameSync('db', `archive/${+new Date()}`);
  send('Archived current data.');
};
