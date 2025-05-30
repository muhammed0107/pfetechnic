const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add Zustand alias to use CommonJS version
  config.resolve.alias['zustand'] = 'zustand/traditional';

  return config;
};
