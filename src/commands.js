import * as utils from './utils';

import * as adminadd from './commands/adminadd';
import * as admindel from './commands/admindel';
import * as gauth from './commands/gauth';
import * as greload from './commands/greload';
import * as greset from './commands/greset';
import * as help from './commands/help';
import * as key from './commands/key';
import * as leaderboard from './commands/leaderboard';
import * as pointsadd from './commands/pointsadd';
import * as pointsgive from './commands/pointsgive';
import * as pointssub from './commands/pointssub';
import * as pointstake from './commands/pointstake';
import * as prefix from './commands/prefix';
import * as reboot from './commands/reboot';
import * as source from './commands/source';
import * as stats from './commands/stats';
import * as uinfo from './commands/uinfo';

export default utils.extractAliases({
    adminadd,
    admindel,
    gauth,
    greload,
    greset,
    help,
    key,
    leaderboard,
    pointsadd,
    pointsgive,
    pointssub,
    pointstake,
    prefix,
    reboot,
    source,
    stats,
    uinfo,
})
