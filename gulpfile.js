'use strict';
/* globals require */

const gulp = require('gulp'),
	// sass = require('gulp-ruby-sass'),
	sass = require('gulp-sass'),
	compass = require('gulp-compass'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require("gulp-babel");
	// livereload = require('gulp-livereload');


gulp.task('bootstrap-css-process',function(){
	return gulp.src('app/bootstrap/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({style:'expanded'}))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('app/css'));
});

gulp.task('bundlejs', function(){
	gulp.src(['./app/js/draw-path/*.js','./app/js/draw-path/*/*.js'])
		.pipe(sourcemaps.init())
		.pipe(babel({
            presets: ['es2015']
        }))
		.pipe(concat('draw-path.js'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('./app/js'));
		// .pipe(livereload({ start: true }));

});

gulp.task('compass', function() {
  	gulp.src('./app/sass/**/*.scss')
	    // .pipe(sourcemaps.init())
	    .pipe(compass({
	    	// config_file: './config.rb',
			sourcemap:true,
			sass: 'app/sass',
			css:'app/css',
	      	style:'expanded'
	    }))
	    // .pipe(sourcemaps.write('../maps'))
	    .pipe(gulp.dest('./app/css'));
});

// watchers

function watchJsAndCompass(){
	watch(['./app/js/draw-path/*.js','./app/js/draw-path/*/*.js'],
		batch(function (events, done) {
        gulp.start('bundlejs', done);
    }));
    watch(['./app/sass/*.scss','.app/sass/**/*.scss'],
    	batch(function (events, done){
    		gulp.start('compass',done);
    }));
}

function watchjs(){
	watch(['./app/js/draw-path/*.js','./app/js/draw-path/*/*.js'],
		batch(function (events, done) {
        gulp.start('bundlejs', done);
    }));
}
gulp.task('watchjs',watchjs);

gulp.task('watchJsAndCompass',watchJsAndCompass);