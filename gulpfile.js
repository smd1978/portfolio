"use strict";

//Подключаем плагины к проекту

const {src, dest} = require("gulp");
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const rigger = require("gulp-rigger");
const rename = require("gulp-rename");
const comments = require("gulp-strip-css-comments");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const panini = require("panini");
const del = require("del");
const sass = require('gulp-sass')(require('sass'));
var sassGlob = require('gulp-sass-glob');
const cssbeautify = require("gulp-cssbeautify");
const browsersync = require("browser-sync").create();
//Прописываем пути выходных (собранных) данных проекта
var path = {
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/img/" 
    },
    //Прописываем источник (откуда будут браться файлы исходники для отптимизации)
    src: {
        html: "src/*.html",
        js: "src/assets/js/*.js",
        css: "src/assets/sass/**/style.scss",
        images: "src/assets/img/**/*.{jpg,jpeg,png,svg,gif}"    
    },
    watch: {
        html: "src/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        images: "src/assets/img/**/*.{jpg,jpeg,png,svg,gif}"   
    },
    clean: "./dist"
}

/* Tasks */

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './dist',
            injectChanges: true
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browsersync.reload();
    
}

function html() {
    panini.refresh();
    return src(path.src.html, { base: "src/" }) //таск для работы html файлами - ОТКУДА
    .pipe(plumber())    
    .pipe(panini({
        root: 'src/', // страницы где будут храниться файлы html (about, portfolio и прочие)
        layouts: 'src/tpl/layouts/', // шаблоны страниц html (например страница без сайдбара или стартовая страница)
        partials: 'src/tpl/partials/', // фрагменты кода (шапка сайта, подвал, тег head и прочее)
        helpers: 'src/tpl/helpers/',
        data: 'src/tpl/data/'
    }
    ))
    .pipe(dest(path.build.html)) //КУДА
    .pipe(browsersync.stream()); //КУДА
        
    }
function css() {
    return src(path.src.css, { base: "src/assets/sass/"}) //таск для работы с css файлами - ОТКУДА
    // .pipe(plumber())  //предотвращает ошибки gulp - закоментил не обновлялся после ошибки в css
    .pipe(sassGlob())
    .pipe(sass()) // преобразует sass в css
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 8 versions'],
        cascade: true
    })) // подставляет префиксы
    .pipe(cssbeautify()) // красиво форматирует код css  
    .pipe(dest(path.build.css)) // место куда собираются файлы
    .pipe(cssnano({
        zindex: false,
        discardComments: {
            removeAll: true
        }
    }))
    .pipe(comments())   //убираем комментарии   
    .pipe(rename({ // все сохраняем в файл .min.css
        suffix: ".min",
        extname: ".css"
    })) 
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream()); //локальный сервер атоперегружается при изменениях

}
function js() {
    return src(path.src.js, { base: "./src/assets/js/"}) //таск для работы с js файлами - ОТКУДА
    .pipe(plumber())  //предотвращает ошибки gulp
    .pipe(rigger()) // склеивает js файлы
    .pipe(gulp.dest(path.build.js)) // место куда собираются файлы
    .pipe(uglify()) //сжимаем файл
    .pipe(comments()) //убираем комментарии  
    .pipe(rename({ //все отптимизированное сохраняем в файл .min.js
        suffix: ".min",
        extname: ".js"
    })) 
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream()); //локальный сервер атоперегружается при изменениях

}
function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images))
}  
    
function clean() {
    return del(path.clean);
}

    function watchFiles()   {
        gulp.watch([path.watch.html], html); 
        gulp.watch([path.watch.css], css); 
        gulp.watch([path.watch.js], js); 
        gulp.watch([path.watch.images], images); 
    }

    gulp.task('watch', function() {
        watch('src/assets/sass/**/*.scss', {readDelay: 100}, function(event, cb) {
                console.log(event.event + ' ' + event.path);
                gulp.start('sass');
        });
    });
    

    const build = gulp.series(clean, gulp.parallel(html, css, js, images));
    const watch = gulp.parallel(build, watchFiles, browserSync);

    // Экспортируем 

    exports.html = html;
    exports.css = css;
    exports.js = js;
    exports.images = images;
    exports.clean = clean;
    exports.build = build;
    exports.watch = watch;
    exports.default = watch;