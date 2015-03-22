"use strict";
var gulp = require("gulp");
var babel = require('gulp-babel');

gulp.task('es5', function () {
    gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));

});