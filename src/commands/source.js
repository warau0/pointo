const pkg = require('../../package.json');

export default function (message) {
    message.channel.send(`Project source code: __${pkg.homepage}__`);
}
