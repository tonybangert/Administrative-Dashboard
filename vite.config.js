import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fetchAINews } from './server/news.js'
import { fetchZoomNotes } from './server/zoom.js'

import { fetchSlackMessages } from './server/slack.js'
import { proxyAploraRequest } from './server/aplora.js'

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

function aploraPlugin() {
  return {
    name: 'aplora-sales-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/aplora/')) return next();
        const aploraPath = req.url.replace('/api/aplora', '');
        res.setHeader('Content-Type', 'application/json');
        proxyAploraRequest(req, res, aploraPath);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load all .env vars into process.env (not just VITE_-prefixed)
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), tailwindcss(), newsPlugin(), zoomPlugin(), slackPlugin(), aploraPlugin()],
  };
})
