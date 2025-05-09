const path = require('path');
const fs = require('fs');
const versions = require('../versions');

/**
 * Check and try to set EMME's Python location on Windows, searching from common known paths.
 */
const searchEMMEPython = () => {

  // Set Windows' python exe path postfix (e.g. Python27\python.exe)
  const p = getVersion(versions.emme_python);
  const pythonPathPostfix = `Python${p.major}${p.minor}\\python.exe`;

  // Search from environment variable "EMMEPATH"
  const envEmmePath = process.env.EMMEPATH || '';
  const envEmmePythonPath = path.join(envEmmePath, pythonPathPostfix);

  if (envEmmePath && fs.existsSync(envEmmePythonPath)) {
    return [true, envEmmePythonPath];
  }

  // Not found based on EMMEPATH, try guessing some common locations on Windows
  const e = getVersion(versions.emme_system);
  const commonEmmePath = `Bentley\\OpenPaths`;
  const emmeMajor = `\\EMME ${e.major}`;
  const emmeSemver = `\\Emme ${e.semver}`;
  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/'];
  const paths = [
    `\\Program Files\\${commonEmmePath}\\${emmeSemver}\\${pythonPathPostfix}`,
    `\\Program Files (x86)\\${commonEmmePath}\\${emmeSemver}\\${pythonPathPostfix}`,
    `\\${commonEmmePath}\\${emmeSemver}\\${pythonPathPostfix}`,
    `\\${commonEmmePath}\\${emmeMajor}\\${emmeSemver}\\${pythonPathPostfix}`,
    `usr/bin/python2` // mainly for developers on Mac & Linux
  ];

  const allPathCombinations = drives.reduce(
    (accumulator, d) => {
      // Combine each (d)rive to all (p)aths, and merge results via reduce
      return accumulator.concat(paths.map((p) => `${d}${p}`));
    }, []);

  const firstExisting = allPathCombinations.find(fs.existsSync);
  if (firstExisting) {
    return [true, firstExisting];
  } else {
    return [false, null];
  }
};

/**
 * Dissect given semantic version number string
 */
function getVersion(semver) {
  const tokens = semver ? semver.split('.', 3) : [];
  return {
    semver,
    major: tokens[0] || '',
    minor: tokens[1] || '',
    patch: tokens[2] || '',
  }
}

module.exports = {
  searchEMMEPython: searchEMMEPython,
};
