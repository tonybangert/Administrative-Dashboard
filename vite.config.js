import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fetchAINews } from './server/news.js'
import { fetchZoomNotes } from './server/zoom.js'
import { fetchOutlookCalendar } from './server/outlook.js'
import { fetchSlackMessages } from './server/slack.js'

function newsPlugin() {
  return {
    name: 'ai-news-api',
    configureServer(server) {
      server.middlewares.use('/api/ai-news', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const apiKey = process.env.ANTHROPIC_API_KEY || '';
          const forceRefresh = req.method === 'POST';
          const result = await fetchAINews(apiKey, forceRefresh);
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ articles: [], cached: false, fetchedAt: 0, error: err.message }));
        }
      });
    },
  };
}

function zoomPlugin() {
  return {
    name: 'zoom-notes-api',
    configureServer(server) {
      server.middlewares.use('/api/zoom-notes', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const credentials = {
            accountId: process.env.ZOOM_ACCOUNT_ID || '',
            clientId: process.env.ZOOM_CLIENT_ID || '',
            clientSecret: process.env.ZOOM_CLIENT_SECRET || '',
          };
          const forceRefresh = req.method === 'POST';
          const result = await fetchZoomNotes(credentials, forceRefresh);
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ notes: [], cached: false, fetchedAt: 0, error: err.message }));
        }
      });
    },
  };
}

function outlookPlugin() {
  return {
    name: 'outlook-calendar-api',
    configureServer(server) {
      server.middlewares.use('/api/outlook-calendar', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const credentials = {
            tenantId: process.env.OUTLOOK_TENANT_ID || '',
            clientId: process.env.OUTLOOK_CLIENT_ID || '',
            clientSecret: process.env.OUTLOOK_CLIENT_SECRET || '',
            refreshToken: process.env.OUTLOOK_REFRESH_TOKEN || '',
          };
          const forceRefresh = req.method === 'POST';
          const result = await fetchOutlookCalendar(credentials, forceRefresh);
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ events: [], cached: false, fetchedAt: 0, error: err.message }));
        }
      });
    },
  };
}

function slackPlugin() {
  return {
    name: 'slack-messages-api',
    configureServer(server) {
      server.middlewares.use('/api/slack-messages', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const botToken = process.env.SLACK_BOT_TOKEN || '';
          const channelId = process.env.SLACK_CHANNEL_ID || '';
          const forceRefresh = req.method === 'POST';
          const result = await fetchSlackMessages(botToken, channelId, forceRefresh);
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ messages: [], channelName: null, cached: false, fetchedAt: 0, error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load all .env vars into process.env (not just VITE_-prefixed)
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), tailwindcss(), newsPlugin(), zoomPlugin(), outlookPlugin(), slackPlugin()],
  };
})
