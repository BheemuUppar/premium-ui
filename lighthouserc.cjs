/** @type {import('@lhci/cli').LighthouseCiConfig} */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist/premium-ui/browser',
      url: [
        'docs/components/button/overview/index.html',
        'docs/components/button/playground/index.html',
        'docs/components/tabs/overview/index.html',
        'docs/components/tabs/playground/index.html',
        'docs/components/select/overview/index.html',
        'docs/components/select/playground/index.html',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:performance': ['warn', { minScore: 0.85 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: 'tests/reports/lighthouse',
    },
  },
};
