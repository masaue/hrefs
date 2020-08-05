/**
 * targets.js
 * 
 * @author masaue
 */

import got from 'got';

import { downloadUrl } from './utils';



export default class Targets {
  
  constructor(targets, url) {
    this._targets = targets;
    this._url = url;
  }
  
  async filter(extensionsString, phrase) {
    const isTargetResults = await Promise.all(this._targets.map((target) => {
      // got undefined at https://www.riulynrpg.info/g-l/
      if (!target) {
        return false;
      }
      return this._isTarget(target, extensionsString);
    }));
    const filtered = this._targets.filter((_, i) => {
      return isTargetResults[i];
    });
    return phrase ? filtered.filter((target) => {
      return new RegExp(phrase).test(target);
    }) : filtered;
  }
  
  async _hasPdfMagicNumber(target) {
    try {
      const { body } = await got(downloadUrl(this._url, target));
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
