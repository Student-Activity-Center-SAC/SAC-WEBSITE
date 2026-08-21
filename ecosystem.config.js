module.exports = {
  apps: [
    {
      name: 'sac-website',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3003,
        NODE_ENV: 'production',
      },
    },
  ],
};
