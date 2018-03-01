const gulp = require('gulp'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

const config = {
    dist: {
        html: 'dist/'
    },
    src: {
        html: 'src/pages/*.html'
    },
    watch: [
        'src/pages/**/*.html'
    ],
    browser: {
        server: {
            baseDir: './dist'
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: 'project'
    }
};

gulp.task('reload', reload);
gulp.task('build', ['html:build']);
gulp.task('html:build', function () {
    gulp.src(config.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(config.dist.html));
});

gulp.task('default', ['build'], () => {
    browserSync(config.browser);
    gulp.watch(config.watch, ['build', 'reload']);
});
