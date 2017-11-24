var gulp         = require('gulp'),
    webserver    = require('gulp-webserver'),
    os           = require('os'),
    ifaces       = os.networkInterfaces();

//开启本地 Web 服务器功能
gulp.task('webserver', function() {
    return gulp.src('./')
        .pipe(webserver({
            host             : getIP(),
            port             : 8082,
            livereload       : true,
            open             : true,
            directoryListing : false
        }));
});

//默认任务
gulp.task('default', ['webserver']);

function getIP(){
    var ip = 'localhost';
    for (var dev in ifaces) {
        ifaces[dev].every(function(details){
            if (details.family==='IPv4' && details.address!=='127.0.0.1' && !details.internal) {
                ip = details.address;
                return false;
            }
            return true;
        });
    }
    return ip;
}
