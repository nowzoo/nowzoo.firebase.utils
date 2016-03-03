// Karma configuration
// Generated on Wed Nov 18 2015 17:58:09 GMT-0600 (CST)

var path = require('path');
var _ = require('lodash');

module.exports = function(config) {

    config.set({

        reportSlowerThan: 500,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [

            './bower_components/mockfirebase/browser/mockfirebase.js',
            './bower_components/firebase/firebase.js',
            './bower_components/angular/angular.min.js',
            './bower_components/angularfire/dist/angularfire.min.js',
            './bower_components/angular-mocks/angular-mocks.js',
            './test/**/*.js',
            './src/module.js',
            './src/**/*.js',
            './src/**/*.html'

        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/!(*.spec).js': ['coverage'],
            'src/**/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            cacheIdFromPath: function(filepath) {
                // example strips 'public/' from anywhere in the path
                // module(app/templates/template.html) => app/public/templates/template.html
                var newPath = filepath.replace(/^src\//, '');
                return newPath;
            },

            moduleName: function (htmlPath, originalPath) {
                var m = 'nowzoo.firebase.utils';
                return m;
            }
        },


        // test results reporter to use
        // possible values: 'dots', 'progress', 'spec'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'coverage'],

        coverageReporter: {
            type : 'lcov',
            dir : 'coverage/',
            excludes: ['src/**/*.spec.js']
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DISABLE,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity
    })
};
