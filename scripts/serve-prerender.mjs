/**
 * Serves prerendered static HTML from dist/premium-ui/browser.
 * Used for E2E / Lighthouse against the production docs build.
 */
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const browserRoot = join(process.cwd(), 'dist/premium-ui/browser');
const port = Number(process.env['PORT'] ?? 4000);
const app = express();

app.use((req, res, next) => {
  const path = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
  if (!path || path === '/') {
    return next();
  }

  const indexPath = join(browserRoot, path, 'index.html');
  if (existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return next();
});

app.use(express.static(browserRoot, { index: 'index.html', extensions: ['html'] }));

app.use((_req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Premium UI prerender server listening on http://localhost:${port}`);
});
