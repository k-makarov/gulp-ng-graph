var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha');

gulp.task('jshint', function() {
    return gulp.src(['./lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
    return gulp.src(['./test/**/*.test.js'], {
            read: false
        })
        .pipe(mocha({
            reporter: 'mocha-unfunk-reporter',
            globals: {
                expect: require('expectations')
            }
        }));
});

gulp.task('default', ['test', 'jshint']);