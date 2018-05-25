var gulp       = require('gulp'),
    jsonminify = require('gulp-jsonminify'),
    config     = require('./config');

gulp.task('json',[], function() {
    gulp.src('./static/static/q.json')
      .pipe(jsonminify())
      .pipe(gulp.dest('./public/dest/static.silviosiefke.com/htdocs'));
});
