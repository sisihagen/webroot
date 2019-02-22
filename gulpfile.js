'use strict';

// https://css-tricks.com/gulp-for-beginners/
// https://diezjietal.be/blog/2015/02/18/image-optimizers.html
// http://learningwithjb.com/posts/cleaning-our-build-folder-with-gulp
// https://www.sitepoint.com/how-to-use-postcss-with-gulp/
// https://webdesign.tutsplus.com/series/postcss-deep-dive--cms-889
// https://github.com/kogakure/hugo-stefanimhoff.de

var gulp         = require('gulp'),
    requireDir   = require('require-dir')('./gulp-tasks'),
    runSequence  = require('run-sequence'),
    config       = require('./gulp-tasks/config');

// gulp default
gulp.task('default', function () {
  gulp.watch('./static/static/scss/**/*.scss', gulp.series('devel-sass'));
  gulp.watch('./static/static/js/**/*.js', gulp.series('devel-js'));
});

// gulp managed the assets tasks
gulp.task('static', gulp.series('image', 'json', 'prod-css', 'prod-js', 'fonts', function() {}));

// gulp complete run
gulp.task('build', gulp.series(function(callback) {
    runSequence('hugo',
        'folder',
        'html',
        'static',
        callback);
}));
