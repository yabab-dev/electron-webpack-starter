// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: [
    'airbnb-base',
  ],
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'semistandard',
  ],
  plugins: [
    'html',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack/base.js',
      }
    }
  },
  rules: {
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never',
    }]
  },
}
