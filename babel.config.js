require('dotenv').config();

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'babel-plugin-transform-inline-environment-variables',
      { include: ['REACT_NATIVE_IS_DOT_IR', 'IS_DOT_IR'] },
    ],
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          appPackage: require('path').resolve(__dirname, 'package.json'),
        },
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.json',
          '.tsx',
          '.ts',
          '.svg',
        ],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
