import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fetchAINews } from './server/news.js'

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

export default defineConfig({
  plugins: [react(), newsPlugin()],
})
