var gulp = require('gulp'),
    exec = require('child_process').exec;

gulp.task('hugo', gulp.series('cb', 'cd', function(fetch) {
    return exec('hugo', function (err, stdout, stderr) {
      console.log(stdout)
      console.log(stderr)
      fetch(err)
    })
}));
