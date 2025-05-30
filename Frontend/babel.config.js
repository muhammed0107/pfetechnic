module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true, // 👈 This is key in SDK 53+
        },
      ],
    ],
  };
};
