// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
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
}
