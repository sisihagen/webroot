var gulp = require('gulp'),
    exec = require('gulp-exec');

gulp.task('hugo', ['cb', 'cd'], function() {
    return gulp.src('./')
        .pipe(exec('hugo'))
});
