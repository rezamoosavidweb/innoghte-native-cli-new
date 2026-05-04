module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'android/', 'ios/', 'coverage/'],
  extends: '@react-native',
  parserOptions: {
    babelOptions: {
      cwd: __dirname,
    },
  },
  plugins: ['import', 'boundaries'],

  settings: {
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app/*' },
      { type: 'shared', pattern: 'src/shared/*' },
      { type: 'ui', pattern: 'src/ui/*' },
      { type: 'domain', pattern: 'src/domains/*' },
    ],
  },

  rules: {
    /** Inline layout hints on `Button` / `Pressable` are common; StyleSheet churn is high. */
    'react-native/no-inline-styles': 'off',
    'boundaries/dependencies': 'off',
    'import/no-internal-modules': [
      'error',
      {
        forbid: [
          'src/domains/*/*/*/*/*',
          'src/app/*/*/*/*',
          'src/shared/*/*/*/*',
          'src/ui/*/*/*/*',
        ],
      },
    ],
    'no-restricted-imports': 'off',
    'import/no-relative-parent-imports': 'error',
    'import/no-cycle': 'off',
    'import/no-useless-path-segments': 'error',
  },
  overrides: [
    {
      files: ['src/app/**/*.{ts,tsx}'],
      excludedFiles: ['src/app/bridge/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/domains/*', '@/domains/**'],
                message:
                  'app: only app/bridge may import @/domains; keep App shell decoupled',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/ui/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '@app/*',
                  '@/app/*',
                  '@/domains/*',
                  '@/domains/**',
                  '@/shared/infra/*',
                  '@/shared/infra/**',
                  '@/shared/utils/*',
                  '@/shared/utils/**',
                ],
                message:
                  'ui: only @/ui/** and @/shared/contracts/** (and external deps)',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['__tests__/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'import/no-relative-parent-imports': 'off',
      },
    },
  ],
};
