"use strict";
var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var babel = require('gulp-babel');

gulp.task("docs", function () {
    return gulp.src("lib/*.js")
        .pipe(concat("all.md"))
        .pipe(jsdoc2md())
        .on("error", function(err){
            gutil.log("jsdoc2md failed:", err.message);
        })
        .pipe(gulp.dest("api"));
});

gulp.task('es5', function () {
    gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));

});