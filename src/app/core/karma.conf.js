// Section-private Karma config for the APP CHROME thread only.
// Scopes `ng test` to chrome specs without touching the repo root:
//   ng test --karma-config=src/app/core/karma.conf.js --watch=false \
//     --include='src/app/core/**/*.spec.ts' \
//     --include='src/app/shared/**/*.spec.ts' \
//     --include='src/app/i18n/**/*.spec.ts' \
//     --include='src/app/app.spec.ts'
module.exports = function (config) {
  config.set({
    basePath: '../../../..',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    reporters: ['progress'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: false,
  });
};
