var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    config = require('./config');

// svg fix
gulp.task('picture', gulp.series(function() {
    return gulp.src([
            './bower_components/picturefill/dist/picturefill.min.js'
        ])
        .pipe(gulp.dest(config.scripts.out));
}));

// html5shiv
gulp.task('html5shiv', gulp.series(function() {
    return gulp.src([
            './bower_components/html5shiv/dist/html5shiv.min.js'
        ])
        .pipe(gulp.dest(config.scripts.out));
}));

// scripting for development
gulp.task('devel-js', gulp.series(function() {
    return gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/svgxuse/svgxuse.js',
            './static/static/js/app.js'
        ])
        .pipe(concat('site.js'))
        .pipe(gulp.dest(config.scripts.dev));
}));

// scripting for production system
gulp.task('prod-js', gulp.series('picture', 'html5shiv', function() {
    return gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/svgxuse/svgxuse.js',
            './static/static/js/app.js'
        ])
        .pipe(concat('site.js'))
        .pipe(gulp.dest(config.scripts.out))
        .pipe(uglify())
        .pipe(gulp.dest(config.scripts.out));
}));
