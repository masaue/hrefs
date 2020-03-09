/**
 * targets.js
 * 
 * @author masaue
 */

import path from 'path';



export default class Targets {
  
  constructor(targets) {
    this._targets = targets;
  }
  
  filter(extensionsString, phrase) {
    const filtered = this._targets.filter((target) => {
      return extensionsString.split(',').some((extension) => {
        return target && target.endsWith(`.${extension}`);
      });
    });
    return phrase ? filtered.filter((target) => {
      return new RegExp(phrase).test(target);
    }) : filtered;
  }
  
}