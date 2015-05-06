# gulp-ng-graph
## Wtf?
Gulp plugin for building graph of angular modules relations.

It renders a html file with some d3.js script that visualize all finded angular modules with dependecies. Also it renders .dot file that you can visualize by yourself (by example with [Graphviz](http://www.graphviz.org/))

## Examples
![Some simple project](https://github.com/k-makarov/gulp-ng-graph/blob/master/demo/screenshots/result1.png)
more complex...
![Some simple project](https://github.com/k-makarov/gulp-ng-graph/blob/master/demo/screenshots/result2.png)
and more...
![Some simple project](https://github.com/k-makarov/gulp-ng-graph/blob/master/demo/screenshots/result3.png)

## Install
```
npm install gulp-ng-graph
```

## Usage

```
var gulp = require('gulp'),
    ngGraph = require('gulp-ng-graph');

gulp.task('default', function() {
    return gulp.src(['./App/**/*.js'])
        .pipe(ngGraph())
        .pipe(gulp.dest('./graph/'));
});


You can also pass options to rename default files ng-graph.dot and ng-graph.html:

gulp.task('default', function() {
    return gulp.src(['./App/**/*.js'])
        .pipe(ngGraph({
        	dot: 'my-angular-project-graph.dot',
        	html: 'my-angular-project.html'
        }))
        .pipe(gulp.dest('./graph/'));
});

```



## Features
- zoom
- drag

## TODO features
- arrows on links
- module info on click
- print
