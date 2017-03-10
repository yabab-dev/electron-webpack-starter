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
  },
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
}
