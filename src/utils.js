const crypto = require("crypto");

const { CHURCHILL_DEBUG, CHURCHILL_DEBUG_NAMESPACES } = require("./config");

/**
 * Identity function
 * @param {*} item
 */
function identity(item) {
  return item;
}

/**
 * Check if value is set
 * @param {*} value Value
 */
function isset(value) {
  return value !== undefined;
}

/**
 * Check if namespace is enabled
 * @param {string} input Namespace
 * @param {?string} debug Debug
 * @param {?RegExp[]} namespaces Namespaces
 */
function isNamespaceEnabled(
  input,
  debug = CHURCHILL_DEBUG,
  namespaces = CHURCHILL_DEBUG_NAMESPACES
) {
  if (!isset(debug)) return true;
  return namespaces.some(namespace => input.match(namespace));
}

/**
 * Creates an MD5 hash from string input
 * @param {String} str Input
 */
function md5(str) {
  return crypto
    .createHash("md5")
    .update(str)
    .digest("hex");
}

/**
 * Convert HSV color to RGB
 * (Hue ∈ [0°, 360°], Saturation ∈ [0, 1], and Value ∈ [0, 1])
 * https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
 * @param {Number} hue
 * @param {Number} saturation
 * @param {Number} value
 */
function HSVtoRGB(hue, saturation, value) {
  const chroma = value * saturation;
  const h = hue / 60;
  const x = chroma * (1 - Math.abs((h % 2) - 1));

  let r;
  let g;
  let b;
  if (h >= 0 && h <= 1) {
    r = chroma;
    g = x;
    b = 0;
  } else if (h > 1 && h <= 2) {
    r = x;
    g = chroma;
    b = 0;
  } else if (h > 2 && h <= 3) {
    r = 0;
    g = chroma;
    b = x;
  } else if (h > 3 && h <= 4) {
    r = 0;
    g = x;
    b = chroma;
  } else if (h > 4 && h <= 5) {
    r = x;
    g = 0;
    b = chroma;
  } else if (h > 5 && h <= 6) {
    r = chroma;
    g = 0;
    b = x;
  } else {
    r = 0;
    g = 0;
    b = 0;
  }

  const m = value - chroma;

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Generate random stable pretty color for a namespace
 * @param {String} namespace Namespace
 */
function randomStableColor(namespace) {
  const randomStableHue =
    md5(namespace)
      .split("")
      .map(i => i.charCodeAt(0))
      .reduce((acc, i) => acc + i, 0) % 360;
  return HSVtoRGB(randomStableHue, 0.8, 1);
}

module.exports = { identity, isset, isNamespaceEnabled, md5, HSVtoRGB, randomStableColor };
