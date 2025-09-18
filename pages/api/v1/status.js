// Status endpoint for RABKL Newsroom
import { articles } from '../publish.js';

export default function handler(req, res) {
  return res.status(200).json({
    status: 'running',
    message: 'RABKL Newsroom Agent is running!',
    articles_count: articles?.length || 0,
    endpoints: {
      newsroom_loop: '/api/v1/newsroom-loop',
      status: '/api/v1/status',
      publish: '/api/publish',
      weekly_power_rankings: '/api/v1/weekly-power-rankings'
    }
  });
}

