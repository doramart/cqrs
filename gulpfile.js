"use strict";
var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var babel = require('gulp-babel');

gulp.task('es5', function () {
    gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));

});