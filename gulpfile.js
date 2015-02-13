var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', function() {
    browserSync({
        server: {
            routes : {
                '/js' : './lib',
                '/flash' : './flash'
            },
            baseDir: ['www']
        }
    });

    gulp.watch(['lib/*'], reload);
    gulp.watch(['www/*'], reload);
});
