module.exports = {
  apps: [{
    name: 'SHHHHHHH!',
    script: 'src/app.js',
    instances: '1',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
