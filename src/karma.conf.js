// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    files: [
      'typings.d.ts',
      'assets/lib/dist/lib/leaflet.js',
      'assets/lib/dist/lib/leaflet.draw.js',
      'assets/lib/src/MapBBCode.js',
      'assets/lib/src/MapBBCodeUI.js',
      'assets/lib/src/MapBBCodeUI.Editor.js',
      'assets/lib/src/images/EditorSprites.js',
      'assets/lib/src/controls/FunctionButton.js',
      'assets/lib/src/controls/LetterIcon.js',
      'assets/lib/src/controls/PopupIcon.js',
      'assets/lib/src/controls/Leaflet.Search.js',
      'assets/lib/src/controls/PermalinkAttribution.js',
      'assets/lib/src/controls/StaticLayerSwitcher.js',
      'assets/lib/src/handlers/Handler.Text.js',
      'assets/lib/src/handlers/Handler.Color.js',
      'assets/lib/src/handlers/Handler.Width.js',
      'assets/lib/src/handlers/Handler.Measure.js',
      'assets/lib/src/strings/English.js',
      'assets/canvas/canvasjs.min.js'
    ]
  });
};