var gulp = require('gulp');
var exec = require('gulp-exec');

gulp.task('hugo', ['cb'], function() {
    return gulp.src('./')
        .pipe(exec('hugo'))
});
