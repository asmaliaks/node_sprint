
"use strict";

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var react = require('gulp-react');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');

gulp.task('default', function () {

});

// Basic usage 
gulp.task('scripts', function() {
     return browserify('./test/browserify/source/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('app.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./test/browserify/'));
});
 
gulp.task('reactify', function () {
    var bundler = browserify({
        entries: ['./test/react/app.jsx'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: false, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    }).bundle() // Create the initial bundle when starting the task
      .pipe(source('app.js'))
      .pipe(gulp.dest('./test/react/'));
});	

gulp.task('react1', function () {
    return gulp.src('./jsx/components/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('./app/components/'));
});

gulp.task('react2', function () {
    return gulp.src('./jsx/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('./app/'));
});

gulp.task('state', function () {
    return browserify('./test/state/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('app-client.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./test/state/'));   
});

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./public/index.html')
    .pipe(connect.reload());
});

// gulp.task('uncss', function() {
//     return gulp.src('./public/css/main.min.css')
//         .pipe(uncss({
//             html: ['./public/index.html']
//         }))
//         .pipe(gulp.dest('./public/css/'));
// });

gulp.task('less', function () {
    return gulp.src('./less/main.less')
        .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
    }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'ie 9'],
            cascade: false
        }))
        // .pipe(minifyCss())
        // .pipe(rename("main.min.css"))
        .pipe(gulp.dest('./public/css/'))
        .pipe(connect.reload());
}); 

gulp.task('app', function () {
    return browserify('./app/client.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('client.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./public/'));   
});

gulp.task('watch', function () {

    // Run both tasks on first run
    // gulp.run('react1', 'react2','app','less','html','connect');

    // Watch the jsx components_jsx folder for changes
    gulp.watch('./jsx/components/*.jsx', function () {
        // Run the css task
        gulp.run('react1','app');
    });

    // Watch the jsx app for changes
    gulp.watch('./jsx/*.jsx', function () {
        // Run the js task
        gulp.run('react2','app');
    });

    // Watch the app.js app for changes
    gulp.watch('./app/app.js', function () {
        // Run the app task
        gulp.run('app');
    });  

    // Watch the main.less app for changes
    gulp.watch('./less/main.less', function () {
        // Run the app task
        gulp.run('less');
    }); 

    gulp.watch('./public/index.html', function () {
        // Run the app task
        gulp.run('html');
    }); 

});

// gulp.task('uglify', function() {
//   return gulp.src('./public/client.js')
//     .pipe(uglify())
//     .pipe(rename("client.min.js"))
//     .pipe(gulp.dest('./public/'));
// });
gulp.task('test-router', function () {
    return browserify('./app/client.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./app/'));
});
gulp.task('default', ['watch']);

