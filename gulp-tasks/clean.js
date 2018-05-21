var gulp = require('gulp');
var clean = require('gulp-rimraf');

// clean build dir before running hugo
gulp.task('cb', [], function() {
    return gulp.src('./public/build/*', {
        read: false
    }).pipe(clean());
});

// clean dest dir before running hugo
gulp.task('cd', [], function() {
    return gulp.src('./public/dest/*', {
        read: false
    }).pipe(clean());
});
