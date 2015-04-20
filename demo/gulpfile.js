var gulp = require('gulp'),
    ngGraph = require('../index');

gulp.task('default', function() {
    return gulp.src(['./App/**/*.js'])
        .pipe(ngGraph())
        .pipe(gulp.dest('./graph/'));
});

