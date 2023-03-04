const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");

gulp.task("styles", function () {
    return gulp
        .src("src/scss/*.scss")
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 2 versions", "> .5%"],
                cascade: false,
            })
        )
        .pipe(cleancss())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("dist/css/"))
        .pipe(browserSync.stream());
});

gulp.task("scripts", function () {
    return gulp
        .src("src/js/*.js")
        .pipe(babel({presets: ["@babel/preset-env"]}))
        .pipe(uglify())
        .on("error", function (e) {
            console.log(e);
        })
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("dist/js/"))
        .pipe(browserSync.stream());
});

gulp.task("images", function () {
    return gulp
        .src("src/images/*.*")
        .pipe(gulp.dest("dist/images/"))
        .pipe(browserSync.stream());
});

gulp.task("libs", function () {
    return gulp
        .src("src/libs/*.*")
        .pipe(gulp.dest("dist/libs/"))
        .pipe(browserSync.stream());
});

gulp.task("fonts", function () {
    return gulp
        .src("src/fonts/*.*")
        .pipe(gulp.dest("dist/fonts/"))
        .pipe(browserSync.stream());
});

gulp.task("browser-sync", function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000,
    })
})

gulp.task('html', async function () {
    return gulp.src(['src/*.html', 'src/index.html'])
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}))
});


gulp.task("watch", function () {
    gulp.watch("src/scss/**/*.scss", gulp.series("styles"));
    gulp.watch("src/images/*.*", gulp.series("images"));
    gulp.watch("src/libs/*.*", gulp.series("libs"));
    gulp.watch("src/fonts/*.*", gulp.series("fonts"));
    gulp.watch("src/js/*.js", gulp.series("scripts"));
    gulp.watch("src/*.html", gulp.series("html"))
});

gulp.task(
    "default",
    gulp.parallel("browser-sync", "styles", "scripts", "images", "libs", "fonts", "watch")
);

gulp.task(
    "build",
    gulp.parallel("styles", "scripts", "images", "libs", "fonts", "html")
);
