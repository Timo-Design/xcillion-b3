/**
 * Watch tasks
 */

const { watch, series } = require('gulp');
const path = require('path');
const del = require('del');
const { buildSkinsToDist, buildContainersToDist, buildScss, buildLess, buildJs, copyVendors } = require('./build');
const { cleanSkins, cleanContainers } = require('./clean');
const { distributeSkins, distributeContainers, distributeCss, distributeJs, distributeVendors } = require('./distribute');
const { distSkinPath, distContainerPath } = require('../helpers');

function mirrorUnlink(srcBase, distBase, cleanTarget, distribute) {
  return (filePath) => {
    const distFile = path.join(distBase, path.relative(srcBase, filePath));
    return del([distFile], { force: true }).then(() => series(cleanTarget, distribute)());
  };
}

/**
 * Watch files for changes
 */
function watchFiles() {
  const skinWatcher = watch('skin/**/*');
  skinWatcher.on('add', series(buildSkinsToDist, cleanSkins, distributeSkins));
  skinWatcher.on('change', series(buildSkinsToDist, cleanSkins, distributeSkins));
  skinWatcher.on('unlink', mirrorUnlink('skin', distSkinPath(), cleanSkins, distributeSkins));

  const containerWatcher = watch('container/**/*');
  containerWatcher.on('add', series(buildContainersToDist, cleanContainers, distributeContainers));
  containerWatcher.on('change', series(buildContainersToDist, cleanContainers, distributeContainers));
  containerWatcher.on('unlink', mirrorUnlink('container', distContainerPath(), cleanContainers, distributeContainers));

  watch(['src/scss/**/*.scss', '_dnn-base/scss/**/*.scss'], series(buildScss, distributeCss));
  watch(['src/less/**/*.less', '_dnn-base/less/**/*.less'], series(buildLess, distributeCss));
  watch('src/js/**/*.js', series(buildJs, distributeJs));
  watch('vendors/**/*', series(copyVendors, distributeVendors));
}

module.exports = {
  watchFiles,
};
