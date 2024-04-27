import leaderboard from './commands/leaderboard.js';
import points from './commands/points.js';
import ping from './commands/ping.js';

export const command_list = [
    {
      name: 'ping',
      description: 'Pong?',
    },
    {
      name: 'leaderboard',
      description: 'Prints the current leaderboard.',
    },
    {
      name: 'points',
      description: 'Add some points to your score.',
      options: [
        {
          name: 'amount',
          description: 'How many points to add.',
          required: true,
          type: 4,
        },
      ],
    }
]

export default {
    ping,
    leaderboard,
    points,
};
