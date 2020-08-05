/**
 * targets.js
 * 
 * @author masaue
 */

import got from 'got';



export default class Targets {
  
  constructor(targets, url) {
    this._targets = targets;
    this._url = url;
  }
  
  async filter(extensionsString, phrase) {
    const filtered = phrase ? this._targets.filter((target) => {
      return new RegExp(phrase).test(target);
    }) : this._targets;
    const isTargetResults = await Promise.all(filtered.map((target) => {
      // got undefined at https://www.riulynrpg.info/g-l/
      if (!target) {
        return false;
      }
      return this._isTarget(target, extensionsString);
    }));
    return filtered.filter((_, i) => {
      return isTargetResults[i];
    });
  }
  
  async _hasPdfMagicNumber(target) {
    try {
      const { body } = await got(target);
      return body.slice(0, 5) === '%PDF-';
    }
    catch (e) {
      return false;
    }
  }
  
  async _isTarget(target, extensionsString) {
    for (let extension of extensionsString.split(',')) {
      if (target.endsWith(`.${extension}`) ||
          extension === 'pdf' && await this._hasPdfMagicNumber(target)) {
        return true;
      }
    }
    return false;
  }
  
}
