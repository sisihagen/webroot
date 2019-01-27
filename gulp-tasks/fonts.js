var gulp   = require('gulp'),
    config = require('./config');

gulp.task('fonts', gulp.series(function() {
    return gulp.src(config.fonts.src)
      .pipe(gulp.dest(config.fonts.out));
}));
