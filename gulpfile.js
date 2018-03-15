"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs Local dev Server
var open = require('gulp-open'); // Open a  URL in a Web Browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify');     // Transform React JSX to JS
var source = require('vinyl-source-stream');  // Use conventional text Stream wih Gulp
var concat = require('gulp-concat'); // Concatenates files
var lint = require('gulp-eslint'); // lint JS files , including JSX files 

//Local Config 
var config = {
    port: 8080,
    devBaseUrl: 'http://localhost',
    paths:{
        html: './src/*.html',
        js: './src/**/*.js',
        images:'./src/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        mainJs: './src/main.js',
        dist:'./dist'
    }
};

//Start a local Development server
gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});
// Connect and Start the function
gulp.task('open',['connect'], function() {
   gulp.src('dist/index.html')
        .pipe(open({
            uri: config.devBaseUrl + ':' + config.port + '/' 
        }));
});
// Move all my html file to Dist and reload 
gulp.task('html', function() {
    gulp.src(config.paths.html)
         .pipe(gulp.dest(config.paths.dist))
         .pipe(connect.reload());
 });

//Move all JSX files efter transformation JS and Bundle to main.js
gulp.task('js', function () {
    browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload())
});

// Bundle and  Move all the CSS files css
gulp.task('css', function () {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
})

// Bundle and  Move all the images files dist folder
gulp.task('images', function () {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(connect.reload());

        //publish Favicon
        gulp.src('./src/favicon.ico')
        .pipe(gulp.dest(config.paths.dist))

})

// Lint alla the JSX files 
gulp.task('lint', function () {
    return gulp.src(config.paths.js)
                .pipe(lint({config: 'eslint.config.json'}))
                .pipe(lint.format());
});

// Run html för every html change
 gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js','lint']);
    
 });

// Task that run with gulp command 
 gulp.task('default',['html','js','css','images','lint','open', 'watch']);