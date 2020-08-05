/**
 * utils.js
 * 
 * @author masaue
 */

import path from 'path';



export const downloadUrl = (url, target) => {
  if (_httpProtocol(target)) {
    return target;
  }
  const dirname = path.extname(url) === '' ? url : path.dirname(url);
  return path.join(dirname, target);
};

const _httpProtocol = (target) => {
  return /^https?:\/\//.test(target);
};
