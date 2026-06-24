/**
 * Build tasks
 */

const { src, dest } = require('gulp');
const fs = require('fs');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const header = require('gulp-header');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const { distSkinPath, distContainerPath } = require('../helpers');
const { config, localConfig } = require('../config');


const less = require('gulp-less');


/**
 * Build skins to dist
 */
function buildSkinsToDist() {
  const skinGlobs = (localConfig.skinGlobs || config.skinGlobs || ['**/*'])
    .map(g => `skin/${g}`);
  return src(skinGlobs, { base: 'skin', encoding: false })
    .pipe(dest(distSkinPath()));
}

/**
 * Build containers to dist
 */
function buildContainersToDist() {
  return src('container/**/*', { encoding: false })
    .pipe(dest(distContainerPath()));
}

/**
 * Build SCSS to CSS
 */
function buildScss() {
  if (!fs.existsSync('src/scss')) {
    console.log('No src/scss folder found, skipping SCSS build.');
    return Promise.resolve();
  }
  const generatedFileWarning = config.generatedFileWarning || '';
  const parsePath = localConfig.parsePath || config.parsePath || '';
  const cssDestPath = parsePath ? `${distSkinPath()}/${parsePath}` : distSkinPath();
  return src('src/scss/skin.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(header(generatedFileWarning + '\n'))
    .pipe(rename('skin.css'))
    .pipe(dest(cssDestPath));
}


/**
 * Build LESS to CSS
 */
function buildLess() {
  if (!fs.existsSync('src/less')) {
    console.log('No src/less folder found, skipping LESS build.');
    return Promise.resolve();
  }
  const generatedFileWarning = config.generatedFileWarning || '';
  const parsePath = localConfig.parsePath || config.parsePath || '';
  const cssDestPath = parsePath ? `${distSkinPath()}/${parsePath}` : distSkinPath();
  return src('src/less/skin.less')
    .pipe(less().on('error', function(err) {
      console.error(err.message);
      this.emit('end');
    }))
    .pipe(cleanCSS())
    .pipe(header(generatedFileWarning + '\n'))
    .pipe(rename('skin.css'))
    .pipe(dest(cssDestPath));
}

/**
 * Build JavaScript
 */
function buildJs() {
  // Check local config first, fall back to base config, then auto-detect
  const jsFiles = localConfig.jsFiles || config.jsFiles || ['src/js/**/*.js'];
  const generatedFileWarning = config.generatedFileWarning || '';
  
  const jsOutputFile = localConfig.jsOutputFile || config.jsOutputFile || 'skin.js';
  const parsePath = localConfig.parsePath || config.parsePath || '';
  const destPath = parsePath ? `${distSkinPath()}/${parsePath}/Js` : distSkinPath();

  return src(jsFiles)
    .pipe(concat(jsOutputFile))
    .pipe(terser())
    .pipe(header(generatedFileWarning + '\n'))
    .pipe(dest(destPath));
}

/**
 * Copy pre-built vendor files
 */
function copyVendors() {
  if (!fs.existsSync('vendors')) {
    console.log('No vendors folder found, skipping vendor copy.');
    return Promise.resolve();
  }
  
  return src('vendors/**/*', { encoding: false })
    .pipe(dest(`${distSkinPath()}/vendors`));
}

module.exports = {
  buildSkinsToDist,
  buildContainersToDist,
  buildScss,
  buildLess,
  buildJs,
  copyVendors,
};
