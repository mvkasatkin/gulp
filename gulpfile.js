const gulp = require('gulp'),
    rimraf = require('rimraf'),
    include = require('gulp-file-include'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    beautify = require('gulp-html-beautify'),
    sourcemaps = require('gulp-sourcemaps'),
    cleancss = require('gulp-clean-css'),
    glob = require('gulp-sass-glob'),
    babel = require('gulp-babel'),
    strip = require('gulp-strip-comments'),
    useref = require('gulp-useref'),
    run = require('run-sequence'),
    gulpif = require('gulp-if'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

let production = false;
const config = {
    assets: [
        'dist/css/main.css',
        'dist/js/bower_components/jquery/dist/jquery.js',
        'dist/js/bower_components/jquery-migrate/jquery-migrate.js',
        'dist/js/bower_components/vue/dist/vue.js',
        'dist/js/bower_components/underscore/underscore.js',
        'dist/js/vue/vue-hello.js',
        'dist/js/page1.js',
    ],
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        bower: 'dist/js/bower_components/',
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        css: 'src/css/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        bower: 'bower_components/**/*.*',
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
gulp.task('server', () => { browserSync(config.browser); return gulp.watch(config.watch, ['build', 'reload']); });
gulp.task('build:html', () => {
    return gulp.src(config.src.html)
        .pipe(include({prefix: '//@', basepath: '@file'}))
        .pipe(inject(
            gulp.src(config.assets, {read: false}),
            {ignorePath: 'dist', addRootSlash: false})
        )
        .pipe(beautify({indent_size: 4, preserve_newlines: false}))
        .pipe(gulpif(production, useref({searchPath: 'dist'})))
        .pipe(strip())
        .pipe(gulp.dest(config.dist.html));
});
gulp.task('build:css', () => {
    return gulp.src(config.src.css)
        .pipe(sourcemaps.init())
        .pipe(glob())
        .pipe(sass())
        .pipe(cleancss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.css));
});
gulp.task('build:js', ['build:js:bower'], () => {
    return gulp.src(config.src.js)
        .pipe(include({prefix: '//@', basepath: '@file'}))
        .pipe(babel({presets: ['es2015-without-strict']}))
        .pipe(gulp.dest(config.dist.js));
});
gulp.task('build:js:bower', () => { return gulp.src(config.src.bower).pipe(gulp.dest(config.dist.bower)); });
gulp.task('build:img', () => { return gulp.src(config.src.img).pipe(gulp.dest(config.dist.img)); });
gulp.task('build:fonts', () => { return gulp.src(config.src.img).pipe(gulp.dest(config.dist.fonts)); });
gulp.task('build', (cb) => { run(['build:js', 'build:css', 'build:img', 'build:fonts'], 'build:html', cb); });
gulp.task('production', (cb) => { production = true; run('default', cb); });
gulp.task('default', (cb) => { run('clean', 'build', 'server', cb); });
