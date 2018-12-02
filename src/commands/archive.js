import * as utils from '../utils';

export default function archive({ send, userID }) {
  if (!utils.isAdmin(userID)) {
    send('Only admins can do that.');
    return;
  }

  send('Not implemented yet.');
};
