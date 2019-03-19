var gulp = require('gulp'),
    fs   = require('fs');


gulp.task('folder', gulp.series('cd', function(done) {

    var folders = [
        './public/dest',
        './public/dest/silviosiefke.de',
        './public/dest/silviosiefke.com',
        './public/dest/silviosiefke.fr',
        './public/dest/silviosiefke.ru',
        './public/dest/silviosiefke.de/htdocs',
        './public/dest/silviosiefke.com/htdocs',
        './public/dest/silviosiefke.fr/htdocs',
        './public/dest/silviosiefke.ru/htdocs',
        './public/dest/static.silviosiefke.com',
        './public/dest/static.silviosiefke.com/htdocs',
        './public/dest/static.silviosiefke.com/htdocs/css',
        './public/dest/static.silviosiefke.com/htdocs/img',
        './public/dest/static.silviosiefke.com/htdocs/fonts',
        './public/dest/static.silviosiefke.com/htdocs/js'
    ];

    folders.forEach(dir => {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir),
            console.log('folder created:', dir);
    });
    done();
}));
