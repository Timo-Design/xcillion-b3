/**
 * Clean tasks
 */

const del = require('del');
const { distFolder, distSkinPath, distContainerPath, skinTarget, containerTarget } = require('../helpers');
const { config } = require('../config');

const targetPaths = config.targetPaths || [];

/**
 * Clean dist folder
 */
function cleanDist() {
  return del([`${distFolder}/**`], { force: true });
}

/**
 * Clean dist skin folder
 */
function cleanDistSkins() {
  const cleanGlobs = config.cleanSkinGlobs || ['**'];
  return del(cleanGlobs.map(g => `${distSkinPath()}/${g}`), { force: true });
}

/**
 * Clean dist container folder
 */
function cleanDistContainers() {
  return del([`${distContainerPath()}/**`], { force: true });
}

/**
 * Clean skin targets
 */
function cleanSkins() {
  const cleanGlobs = config.cleanSkinGlobs || ['**'];
  const paths = targetPaths.flatMap(p => cleanGlobs.map(g => `${skinTarget(p)}/${g}`));
  return del(paths, { force: true });
}

/**
 * Clean container targets
 */
function cleanContainers() {
  const paths = targetPaths.map(p => containerTarget(p));
  return del(paths, { force: true });
}

module.exports = {
  cleanDist,
  cleanDistSkins,
  cleanDistContainers,
  cleanSkins,
  cleanContainers,
};
