/**
 * Distribution tasks
 */

const { src, dest } = require('gulp');
const { distSkinPath, distContainerPath, skinTarget, containerTarget, themeName, distFolder } = require('../helpers');
const { config } = require('../config');

const targetPaths = config.targetPaths || [];

/**
 * Distribute skins from dist to target paths
 */
function distributeSkins() {
  if (targetPaths.length === 0) {
    console.log('No targetPaths configured, skipping distribution.');
    return Promise.resolve();
  }

  return targetPaths.reduce((stream, basePath) => {
    return stream.pipe(dest(skinTarget(basePath)));
  }, src(`${distFolder}/Skins/${themeName}/**/*`, { encoding: false }));
}

/**
 * Distribute containers from dist to target paths
 */
function distributeContainers() {
  if (targetPaths.length === 0) {
    console.log('No targetPaths configured, skipping distribution.');
    return Promise.resolve();
  }

  return targetPaths.reduce((stream, basePath) => {
    return stream.pipe(dest(containerTarget(basePath)));
  }, src(`${distFolder}/Containers/${themeName}/**/*`, { encoding: false }));
}

/**
 * Distribute only skin.css to target paths
 */
function distributeCss() {
  if (targetPaths.length === 0) return Promise.resolve();
  const parsePath = config.parsePath || '';
  const srcPath = parsePath ? `${distFolder}/Skins/${themeName}/${parsePath}/skin.css` : `${distFolder}/Skins/${themeName}/skin.css`;
  const destSuffix = parsePath ? `/${parsePath}` : '';
  return targetPaths.reduce((stream, basePath) => {
    return stream.pipe(dest(`${skinTarget(basePath)}${destSuffix}`));
  }, src(srcPath, { encoding: false }));
}

/**
 * Distribute only skin.js to target paths
 */
function distributeJs() {
  if (targetPaths.length === 0) return Promise.resolve();
  const parsePath = config.parsePath || '';
  const jsOutputFile = config.jsOutputFile || 'skin.js';
  const srcPath = parsePath ? `${distFolder}/Skins/${themeName}/${parsePath}/Js/${jsOutputFile}` : `${distFolder}/Skins/${themeName}/${jsOutputFile}`;
  const destSuffix = parsePath ? `/${parsePath}/Js` : '';
  return targetPaths.reduce((stream, basePath) => {
    return stream.pipe(dest(`${skinTarget(basePath)}${destSuffix}`));
  }, src(srcPath, { encoding: false }));
}

/**
 * Distribute only vendors folder to target paths
 */
function distributeVendors() {
  if (targetPaths.length === 0) return Promise.resolve();
  return targetPaths.reduce((stream, basePath) => {
    return stream.pipe(dest(`${skinTarget(basePath)}/vendors`));
  }, src(`${distFolder}/Skins/${themeName}/vendors/**/*`, { encoding: false }));
}

module.exports = {
  distributeSkins,
  distributeContainers,
  distributeCss,
  distributeJs,
  distributeVendors,
};
