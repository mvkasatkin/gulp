const gulp = require('gulp'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    rigger = require('gulp-rigger'), // todo https://www.npmjs.com/package/gulp-file-include
    stream = require('streamqueue'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'), // todo change to new gulp-cssmin
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

const config = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
    },
    src: {
        html: 'src/*.html',
        js: {
            external: 'src/js/external.js',
            internal: 'src/js/internal.js',
        },
        css: 'src/css/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    watch: [
        'src/**/*.html',
        'src/**/*.js',
        'src/**/*.scss',
    ],
    clean: './dist',
    browser: {
        server: {
            baseDir: './dist'
        },
        tunnel: false,
        host: 'localhost',
        port: 9000,
        logPrefix: 'project'
    }
};

gulp.task('clean', (cb) => { rimraf(config.clean, cb); });
gulp.task('reload', reload);
gulp.task('build:html', () => {
    gulp.src(config.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(config.dist.html));
});
gulp.task('build:css', () => {
    gulp.src(config.src.css)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.css));
});
gulp.task('build:js', () => {
    stream({ objectMode: true },
        gulp.src(config.src.js.external).pipe(rigger()),
        gulp.src(config.src.js.internal)
            .pipe(rigger())
            .pipe(babel({presets: ['es2015-without-strict']}))
    )
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.dist.js));
});
gulp.task('build:img', () => {
    gulp.src(config.src.img)
        .pipe(gulp.dest(config.dist.img));
});
gulp.task('build:fonts', () => {
    gulp.src(config.src.img)
        .pipe(gulp.dest(config.dist.fonts));
});
gulp.task('build', ['build:html', 'build:js', 'build:css', 'build:img', 'build:fonts']);
gulp.task('default', ['build'], () => {
    browserSync(config.browser);
    gulp.watch(config.watch, ['build'/*, 'reload'*/]);
});
