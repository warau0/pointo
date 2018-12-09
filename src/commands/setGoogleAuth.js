import * as utils from '../utils';

export default function setGoogleAuth({ send, config, userID, message, evt } = {}) {
  if (!utils.isAdmin(config, userID)) {
    send('Only admins can do that.');
    return;
  }

  send('Not implemented yet.');
};
