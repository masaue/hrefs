/**
 * index.js
 * 
 * @author masaue
 */

import { Command } from 'commander';
import colors from 'colors';

import { version } from '../package.json';

import Downloader from './downloader';



(() => {
  const program = new Command();
  program
    .version(version, '-v, --ver', 'output the version number')
    .usage('[options] url')
    .option('--dry', 'dry run')
    .option('--extension <s>', 'specify extension(s)', 'pdf,zip')
    .option('--phrase <s>', 'specify included phrase')
    .parse(process.argv);
  if (program.args.length !== 1) {
    program.outputHelp((txt) => { return colors.red(txt); });
    process.exit(1);
  }
  Downloader.run(program);
})();
