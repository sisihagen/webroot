var gulp   = require('gulp'),
    change = require('gulp-changed'),
    config = require('./config');

gulp.task('fonts', gulp.series(function() {
    return gulp.src(config.fonts.src)
      .pipe(changed(config.fonts.out))
      .pipe(gulp.dest(config.fonts.out));
}));
