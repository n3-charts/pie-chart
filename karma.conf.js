module.exports = function(config) {
  config.set({
    basePath: '',

    files: [
      JASMINE,
      JASMINE_ADAPTER,
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/d3/d3.js',
      'dist/pie-chart.min.js',
      'dist/pie-chart.spec.js'
    ],

    preprocessors: {
      'dist/pie-chart.min.js': 'coverage'
    },

    exclude: [],
    
    coverageReporter: {
      type : 'text-summary',
      dir : 'coverage/'
    },

    reporters: ['dots', 'coverage'],

    port: 9876,

    runnerPort: 9100,

    autoWatch: true,
    
    browsers: ['PhantomJS']
  });
};
