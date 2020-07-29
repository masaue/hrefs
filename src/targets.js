/**
 * targets.js
 * 
 * @author masaue
 */



export default class Targets {
  
  constructor(targets) {
    this._targets = targets;
  }
  
  filter(extensionsString, phrase) {
    const filtered = this._targets.filter((target) => {
      // got undefined at https://www.riulynrpg.info/g-l/
      if (!target) {
        return false;
      }
      return extensionsString.split(',').some((extension) => {
        return target.endsWith(`.${extension}`);
      });
    });
    return phrase ? filtered.filter((target) => {
      return new RegExp(phrase).test(target);
    }) : filtered;
  }
  
}
