module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'android/', 'ios/', 'coverage/'],
  extends: '@react-native',
  parserOptions: {
    babelOptions: {
      // Babel resolves config from process cwd; IDE/monorepo roots often differ.
      cwd: __dirname,
    },
  },
  plugins: ['import', 'boundaries'],

  settings: {
    'boundaries/elements': [
      { type: 'shared', pattern: 'src/shared/*' },
      { type: 'feature', pattern: 'src/features/*' },

      // internal layers
      { type: 'api', pattern: 'src/features/*/api/*' },
      { type: 'hooks', pattern: 'src/features/*/hooks/*' },
      { type: 'components', pattern: 'src/features/*/components/*' },
      { type: 'screen', pattern: 'src/features/*/screen/*' },
    ],
  },

  rules: {
    /**
     * 🚫 Prevent cross-feature imports
     */
    'boundaries/dependencies': 'off',

    /**
     * 🚫 No deep imports (important!)
     */
    'import/no-internal-modules': [
      'error',
      {
        forbid: ['src/features/*/*/*', 'src/shared/*/*/*'],
      },
    ],

    /**
     * 🚫 No relative imports across features
     */
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../features/*', '../../features/*'],
      },
    ],

    /**
     * ✅ Enforce absolute imports
     */
    'import/no-relative-parent-imports': 'error',

    /**
     * 🚫 Prevent circular dependencies
     */
    'import/no-cycle': 'off',

    /**
     * ✅ Optional: file naming consistency
     */
    'import/no-useless-path-segments': 'error',
  },
  overrides: [
    {
      files: ['__tests__/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'import/no-relative-parent-imports': 'off',
      },
    },
  ],
};
