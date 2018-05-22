'use strict';

const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const mqpacker = require('css-mqpacker');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('gulp-webpack');
require('babel-register');

gulp.task('style', function () {
	gulp.src('src/css/style.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				browsers: [
					'last 1 version',
					'last 2 Chrome versions',
					'last 2 Firefox versions',
					'last 2 Opera versions',
					'last 2 Edge versions'
				]
			}),
			mqpacker({sort: true})
		]))
		.pipe(gulp.dest('public/css'))
		.pipe(server.stream())
		.pipe(minify())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function () {
	return gulp.src('src/js/*.js')
		.pipe(plumber())
		.pipe(webpack({
			devtool:'source-map',
			module: {
				loaders: [
					{ test: /\.js$/,
						loader: 'babel-loader',
						query: {
							presets: ['es2015']
						}}
				]
			},
			output:{
				filename:'main.bundle.js'
			}
		}))
		.pipe(gulp.dest('public/js/'))
		.pipe(server.stream());
});

gulp.task('imagemin', ['copy'], function () {
	return gulp.src('public/img/**/*.{jpg,png,gif}')
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest('public/img'));
});


gulp.task('pug', function () {
	return gulp.src('src/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('public'))
		.pipe(server.stream())
});

gulp.task('copy-img', function () {
	return gulp.src([
		'src/img/**/*.*'
	])
		.pipe(gulp.dest('public/img'));
});

gulp.task('copy-static', function () {
	return gulp.src([
		'src/static/fonts/**/*.{woff,woff2}',
		'src/static/data/*.*'
	], {base: 'src/static'})
		.pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
	return del('public');
});

gulp.task('serve', ['assemble'], function () {
	server.init({
		server: './public',
		notify: false,
		open: true,
		port: 3010,
		ui: false
	});

	gulp.watch('src/css/**/*.{scss,sass}', ['style']).on('change', server.reload);
	gulp.watch('src/**/*.pug', ['pug']).on('change', server.reload);
	gulp.watch('src/js/**/*.js', ['scripts']).on('change', server.reload);
	gulp.watch('src/static/data/**/*.*', ['copy-static']).on('change', server.reload);
});

gulp.task('assemble', ['clean'], function () {
	gulp.start('pug', 'copy-static', 'copy-img', 'scripts', 'style');
});

gulp.task('build', ['assemble', 'imagemin']);