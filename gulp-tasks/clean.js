var gulp = require('gulp'),
    del  = require('del');

// clean build dir before running hugo
gulp.task('cb', [], function() {
    return del('./public/build/**', {force: true})
});

// clean dest dir before running hugo
gulp.task('cd', [], function() {
    return del(['./public/dest/silviosiefke.com/htdocs/**',
                './public/dest/silviosiefke.de/htdocs**',
                './public/dest/silviosiefke.fr/htdocs/**'],
                {force: true});
});
