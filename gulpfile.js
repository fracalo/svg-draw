var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	compass = require('gulp-compass'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch');

gulp.task('default', function() {
  console.log('woggie-boggie');
});

// gulp.task('css-process',function(){
// 	return gulp.src('app/scss/app.scss')
// 		.pipe(sass({style:'expanded'}))
// 		.pipe(gulp.dest('app/css'));
// });

 
gulp.task('compass', function() {
  	gulp.src('./app/sass/*.scss')
	    .pipe(compass({
	      config_file: './config.rb',
	      // css: 'app/css',
	      sass: 'app/sass',
	      style:'expanded'
	    }))
	.pipe(gulp.dest('./app/css'));
});

gulp.task('bundlejs', function(){
	gulp.src(['./app/js/draw-path/*.js','./app/js/draw-path/*/*.js'])
		.pipe(concat('draw-path.js'))
		.pipe(gulp.dest('./app/js'));

})

gulp.task('watchjs',function(){
	watch(['./app/js/draw-path/*.js','./app/js/draw-path/*/*.js'],
		batch(function (events, done) {
        gulp.start('bundlejs', done);
    }))
})