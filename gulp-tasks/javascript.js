var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    config = require('./config');

// scripting for development
gulp.task('devel-js', [], function() {
    return gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/wikiquotes-api/wikiquote-api.js',
            './bower_components/svgxuse/svgxuse.js',
            './bower_components/twitterfeed/index.js',
            './static/static/js/quote.js',
            './static/static/js/app.js'
        ])
        .pipe(concat('site.js'))
        .pipe(gulp.dest(config.scripts.dev));
});

// scripting for production system
gulp.task('prod-js', ['picture'], function() {
    return gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/wikiquotes-api/wikiquote-api.js',
            './bower_components/svgxuse/svgxuse.js',
            './bower_components/twitterfeed/index.js',
            './static/static/js/quote.js',
            './static/static/js/app.js'
        ])
        .pipe(concat('site.js'))
        .pipe(gulp.dest(config.scripts.out))
        .pipe(uglify())
        .pipe(gulp.dest(config.scripts.out));
});

gulp.task('picture',[], function() {
    return gulp.src([
            './bower_components/picturefill/dist/picturefill.min.js'
        ])
        .pipe(gulp.dest(config.scripts.out));
});
