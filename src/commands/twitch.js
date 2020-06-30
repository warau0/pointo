import request from 'request';

import * as utils from '../utils';

export const usage = 'twitch <username>';
export const short = 'List / Add / Remove Twitch stream watch.';
export const description = `Add / Remove live notifications for a Twitch stream. Emit username to list all watched.`;
export const aliases = ['stream', 'streams'];
export const examples = ['twitch', 'twitch studio_trigger'];
export const group = 'settings';

export function run(message) {
    const msg = utils.stripCommand(message);

    if (!msg) {
        if (GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.length) {
            return message.channel.send(`:film_frames: **Twitch streams:**\n${GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.map(member =>
                `\`${member.split('::')[0]}\``).join(' **|** ')}`);
        }
        return message.channel.send(utils.formatResponse('neg', '', 'No streamers are being watched.'));
    }

    if (!GUILD_CONFIGS[message.guild.id].TWITCH_TOKEN) {
        return message.channel.send(utils.formatResponse('neg', 'Missing authentication',
            `Run \`${utils.getPrefix(message)}tauth\` to setup Twitch authentication.`));
    }

    let streamer;
    GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.forEach(s => {
        let [user, id] = s.split('::');
        user = user.toLowerCase();
        if (user === msg) {
            streamer = [user, id];
        }
    });

    if (streamer) {
        utils.guildUpdate(message.guild, {
            ...GUILD_CONFIGS[message.guild.id],
            TWITCH_STREAMS: GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.filter(i => i !== `${streamer[0]}::${streamer[1]}`),
        });
        utils.destroyWebHook(message.guild.id, streamer[1], streamer[0]);
        message.channel.send(utils.formatResponse('pos', '', `**${msg}** is no longer being watched.`));
    } else {
        request({
            method: 'GET',
            uri: `https://api.twitch.tv/helix/users?login=${msg}`,
            headers: { 'Client-ID': CONFIG.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${GUILD_CONFIGS[message.guild.id].TWITCH_TOKEN.access_token}`,
        }
          }, (err, _, body) => {
            if (err) { return message.channel.send(utils.formatResponse('neg', '', `Twitch API error looking up \`${msg}\`.`)); }
            const res = JSON.parse(body);
            if (res && res.data && res.data.length) {
                const twitchID = res.data[0].id;
                utils.guildUpdate(message.guild, {
                    ...GUILD_CONFIGS[message.guild.id],
                    TWITCH_STREAMS: [...GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS, `${msg}::${twitchID}`],
                });
                utils.createWebHook(message.guild.id, twitchID, msg);
                message.channel.send(utils.formatResponse('pos', '', `**${msg}** is now being watched!`));
            } else if (res && res.error && res.message) {
                message.channel.send(utils.formatResponse('neg', res.error, res.message));
            } else {
                message.channel.send(utils.formatResponse('neg', '', `Found no Twitch user named \`${msg}\`.`));
            }
        });
    }
}
