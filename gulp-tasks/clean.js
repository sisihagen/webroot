var gulp = require('gulp'),
    del  = require('del');

//clean build dir before running hugo
gulp.task('cb', gulp.series(function() {
    return del('./public/build/**', {force: true})
}));

// clean dest dir before running hugo
gulp.task('cd', gulp.series(function() {
    return del(['./public/dest/silviosiefke.com/htdocs/**',
                './public/dest/silviosiefke.de/htdocs**',
                './public/dest/silviosiefke.fr/htdocs/**'],
                {force: true});
}));
