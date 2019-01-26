import * as utils from './utils';

import * as avatar from './commands/avatar';
import * as gauth from './commands/gauth';
import * as greset from './commands/greset';
import * as help from './commands/help';
import * as key from './commands/key';
import * as ping from './commands/ping';
import * as prefix from './commands/prefix';
import * as source from './commands/source';

export default utils.extractAliases({
    avatar,
    gauth,
    greset,
    help,
    key,
    ping,
    prefix,
    source,
})
