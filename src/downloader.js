/**
 * downloader.js
 * 
 * @author masaue
 */

import { promisify } from 'util';
import client from 'cheerio-httpcli';
import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import stream from 'stream';

import Targets from './targets';



export default class Downloader {
  
  static async run(program) {
    const url = program.args[0];
    const targets = new Targets(await this._targets(url), url);
    const filtered = await targets.filter(program.extension, program.phrase);
    const downloadTo = await Promise.all(filtered.map((target) => {
      return this._downloadTo(url, program.phrase, target);
    }));
    let skipCount = 0;
    filtered.forEach((target, index) => {
      if (fse.pathExistsSync(downloadTo[index])) {
        console.log(`skip downloading '${target}', ` +
                    `'${downloadTo[index]}' is already exists`);
        skipCount++;
        return;
      }
      console.log(`download '${target}' to '${downloadTo[index]}'`);
      if (!program.dry) {
        this._mkdirs(path.dirname(downloadTo[index]));
        // TODO progressbar
        console.log('downloading...');
        this._download(target, downloadTo[index]);
      }
    });
    console.log(`downloaded ${filtered.length - skipCount} file(s)`);
  }
  
  
  
  static async _basename(target) {
    const basename = path.basename(target);
    // test for https://www.ninsheetmusic.org/
    return /^\d+$/.test(basename) ? await this._filename(target) : basename;
  }
  
  static async _download(url, to) {
    const pipeline = promisify(stream.pipeline);
    await pipeline(
      got.stream(url),
      fse.createWriteStream(to)
    );
  }
  
  static async _downloadTo(url, phrase, target) {
    const removed = this._removeProtocol(url);
    const basename = await this._basename(target);
    return phrase ? path.join(removed, phrase, basename) :
                    path.join(removed, basename); // eslint-disable-line indent
  }
  
  static async _filename(target) {
    const { headers } = await got(target, { method: 'HEAD' });
    const dispositions = headers['content-disposition'].split(/\s*;\s*/);
    const regexp = /^filename="(.+)"$/;
    const filename = dispositions.find((disposition) => {
      return regexp.test(disposition);
    }).replace(regexp, '$1');
    const [ dirname ] = filename.split(/\s*-\s*/);
    return path.join(dirname, filename);
  }
  
  static _mkdirs(to) {
    if (!fse.pathExistsSync(to)) {
      fse.mkdirsSync(to);
    }
  }
  
  static _removeProtocol(url) {
    return url.replace(/^https?:\/\//, '');
  }
  
  static _targets(url) {
    return new Promise((resolve) => {
      client.fetch(url, (_, $) => {
        const targets = [];
        $('a').each(function() {
          targets.push($(this).url());
        });
        resolve(targets);
      });
    });
  }
  
}
