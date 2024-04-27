import * as utils from './utils';

import * as admin from './commands/admin';
import * as gauth from './commands/gauth';
import * as greload from './commands/greload';
import * as greset from './commands/greset';
import * as help from './commands/help';
import * as house from './commands/house';
import * as key from './commands/key';
import * as leaderboard from './commands/leaderboard';
import * as pointsadd from './commands/pointsadd';
import * as pointsgive from './commands/pointsgive';
import * as pointssub from './commands/pointssub';
import * as pointstake from './commands/pointstake';
import * as prefix from './commands/prefix';
import * as reboot from './commands/reboot';
import * as roleedit from './commands/roleedit';
import * as roletoggle from './commands/roletoggle';
import * as say from './commands/say';
import * as stats from './commands/stats';
import * as support from './commands/support';
// import * as tauth from './commands/tauth';
// import * as treset from './commands/treset';
// import * as twitch from './commands/twitch';
import * as uinfo from './commands/uinfo';

export default utils.extractAliases({
    admin,
    gauth,
    greload,
    greset,
    help,
    house,
    key,
    leaderboard,
    pointsadd,
    pointsgive,
    pointssub,
    pointstake,
    prefix,
    reboot,
    roleedit,
    roletoggle,
    say,
    stats,
    support,
    // tauth,
    // treset,
    // twitch,
    uinfo,
});
