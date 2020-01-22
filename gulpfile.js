const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');

function browserSync(done) {
	browsersync.init({
		proxy: 'http://localhost/ppldev/'
	});
	done();
}

function browserSyncReload(done) {
	browsersync.reload();
	done();
}

//Compile SASS files to style.css file.
function css() {
	return gulp
	.src('sass/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./'))
	.pipe(browsersync.stream());
}

//Minify style.css.
function minifyCSS() {
	return gulp
	.src('style.css')
	.pipe(cleanCSS({debug:true}, function(details) {
		console.log(details.name + ': '+details.stats.originalSize);
		console.log(details.name + ': '+details.stats.minifiedSize);
	}))
	.pipe(gulp.dest('./'))
	.pipe(browsersync.stream());
}

//Compress javascript files to minified versions in dist folder.
function compressJS(done) {
	return gulp
	.src(['js/full-calendar.js', 'js/widget.js', 'js/clndr.js', 'js/lcwp-admin.js', 'js/underscore.js', 'js/moment.js', 'js/iScroll.js', 'js/ppl-event-scroll.js'])
	.pipe(minify({
		ext: {
			min: '.min.js'
		},
		noSource: true
	}))
	.pipe(gulp.dest('dist'));
	done();
}

//Watches folders for changes and invokes the above functions.
function watchFiles() {
	gulp.watch('sass/**/*.scss', gulp.series(css, minifyCSS));
	gulp.watch('js/*.js', compressJS);
	gulp.watch([
		'./**/*.php',
		'./inc/**/*.php',
		'js/**/*.js'
		],
		gulp.series(browserSyncReload));
}

const watch = gulp.parallel(watchFiles, browserSync);

exports.css = css;
exports.js = compressJS;
exports.watch = watch;
