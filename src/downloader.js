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
import { downloadUrl } from './utils';



export default class Downloader {
  
  static async run(program) {
    const url = program.args[0];
    const targets = new Targets(await this._targets(url), url);
    const filtered = await targets.filter(program.extension, program.phrase);
    let skipCount = 0;
    filtered.forEach((target) => {
      const targetUrl = downloadUrl(url, target);
      const downloadTo = this._downloadTo(url, program.phrase, target);
      if (fse.pathExistsSync(downloadTo)) {
        console.log(`skip downloading '${targetUrl}', ` +
                    `'${downloadTo}' is already exists`);
        skipCount++;
        return;
      }
      console.log(`download '${targetUrl}' to '${downloadTo}'`);
      if (!program.dry) {
        this._mkdirs(path.dirname(downloadTo));
        // TODO progressbar
        console.log('downloading...');
        this._download(targetUrl, downloadTo);
      }
    });
    console.log(`downloaded ${filtered.length - skipCount} file(s)`);
  }
  
  
  
  static async _download(url, to) {
    const pipeline = promisify(stream.pipeline);
    await pipeline(
      got.stream(url),
      fse.createWriteStream(to)
    );
  }
  
  static _downloadTo(url, phrase, target) {
    const removed = this._removeProtocol(url);
    const basename = path.basename(target);
    return phrase ? path.join(removed, phrase, basename) :
                    path.join(removed, basename); // eslint-disable-line indent
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
          targets.push($(this).attr('href'));
        });
        resolve(targets);
      });
    });
  }
  
}
