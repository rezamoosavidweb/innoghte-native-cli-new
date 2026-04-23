module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: {
    babelOptions: {
      // Babel resolves config from process cwd; IDE/monorepo roots often differ.
      cwd: __dirname,
    },
  },
};
