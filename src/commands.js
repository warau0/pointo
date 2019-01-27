import * as utils from './utils';

import * as avatar from './commands/avatar';
import * as gauth from './commands/gauth';
import * as greload from './commands/greload';
import * as greset from './commands/greset';
import * as help from './commands/help';
import * as key from './commands/key';
import * as leaderboard from './commands/leaderboard';
import * as ping from './commands/ping';
import * as pointsadd from './commands/pointsadd';
import * as pointssub from './commands/pointssub';
import * as prefix from './commands/prefix';
import * as reboot from './commands/reboot';
import * as source from './commands/source';

export default utils.extractAliases({
    avatar,
    gauth,
    greload,
    greset,
    help,
    key,
    leaderboard,
    ping,
    pointsadd,
    pointssub,
    prefix,
    reboot,
    source,
})
