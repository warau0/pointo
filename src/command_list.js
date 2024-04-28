import leaderboard from './commands/leaderboard.js';
import points from './commands/points.js';
import ping from './commands/ping.js';
import house from './commands/house.js';

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
    },
    {
      name: 'house',
      description: 'Add someone to a house.',
      options: [
        {
          name: 'user',
          description: 'Who to add.',
          required: true,
          type: 6,
        },
        {
          name: 'house',
          description: 'The name of the house.',
          required: true,
          type: 3,
        },
      ],
    },
]

export default {
    ping,
    leaderboard,
    points,
    house,
};
