const { src, dest, watch, parallel } = require('gulp');

//css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require ('autoprefixer')
const cssnano = require('cssnano');
const postcss = require ('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Iamges
const cache = require ('gulp-cache')
const webp = require('gulp-webp')
const imagemin = require ('gulp-imagemin')
const avif = require ('gulp-avif')

//java
const terser = require('gulp-terser-js')


function imageMin (done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.jpg')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function css(done) {

    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]) )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
    done();
}
function versionWebp (done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.jpg')
        .pipe(webp(opciones))
        .pipe( dest('build/img'))

    done();
}
function versionAvif (done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.jpg')
        .pipe( avif(opciones))
        .pipe( dest('build/img'))

    done();
}

function javaScript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(dest('build/js'))
        .pipe(sourcemaps.write('.'))
    done()
}

function dev(done){

    watch('src/scss/**/*.scss',css);
    watch('src/js/**/*.js',javaScript);
    done();
}



exports.css = css;
exports.js = javaScript;
exports.imageMin = imageMin;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imageMin,versionWebp,javaScript,css,versionAvif,dev);

