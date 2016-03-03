var gulp = require('gulp');
var _ = require('lodash');
var template = require('gulp-template');




var onError = function (err) {
    var gutil = require('gulp-util');
    gutil.log( gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
};


var jsGlob = ['./src/module.js', './src/**/*.js', '!./src/**/*.spec.js'];
var templatesGlob = ['./src/**/*.html', '!./src/index.html'];





gulp.task('js', function(){
    var streamqueue = require('streamqueue');
    var fs = require('fs');
    var plumber = require('gulp-plumber');
    var template = require('gulp-template');
    var htmlmin = require('gulp-html-minifier');
    var templateCache = require('gulp-angular-templatecache');
    var concat = require('gulp-concat');
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');
    var sourcemaps = require('gulp-sourcemaps');
    var rename = require('gulp-rename');
    var stream = streamqueue({objectMode: true});



    stream.queue(
        gulp.src(jsGlob)
    );
    stream.queue(
        gulp.src(templatesGlob)
            .pipe(plumber({errorHandler: onError}))
            //.pipe(htmlmin({collapseWhitespace: true}))
            .pipe(templateCache({filename: 'app.js', module: 'nowzoo.firebase.utils'}))
    );
    return stream.done()
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat('nowzoo.firebase.utils.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./dist'))
        .pipe(rename(function (path) {path.basename += ".min";}))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});



gulp.task('lint', function() {
    var jshint = require('gulp-jshint');
    return gulp.src(jsGlob)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-watch', ['lint'], function() {
    var watch = require('gulp-watch');
    watch(jsGlob, function(){
        gulp.start('lint');
    });

});


gulp.task('build', ['js']);





gulp.task('watch', ['build'], function(){
    var watch = require('gulp-watch');
    watch(jsGlob, function(){
        gulp.start('js');
    });

});
