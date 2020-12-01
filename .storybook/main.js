const path = require('path');

module.exports = {
  stories: ['../stories/*.stories.js'],
  addons: [
    'storybook-addon-react-docgen',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        controls: false,
        docs: false
      }
    },
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          enforce: 'pre'
        },
      }
    },
    '@storybook/addon-viewport',
    {
      name: '@storybook/addon-a11y',
      options: {
        element: '#story-root'
      }
    }
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.tsx?$/,
      include: path.resolve(__dirname, "../src"),
      use: [
        {
          loader: require.resolve("react-docgen-typescript-loader"),
          options: {
            // Provide the path to your tsconfig.json so that your stories can
            // display types from outside each individual story.
            tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
          },
        },
      ],
    });

    // Return the altered config
    return config;
  },
};
