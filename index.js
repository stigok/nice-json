'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const canAccess = Promise.promisify(fs.access);
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

function parseAsync(infile, outfile) {
  return Promise.all([
    canAccess(infile, fs.R_OK)
  ]).then(function () {
    return readFile(infile, {encoding: 'utf8'});
  }).then(function (buf) {
    let str = JSON.parse(buf);
    let parsed = JSON.stringify(str, null, 2);
    return writeFile(outfile, parsed, {encoding: 'utf8', flag: 'wx'});
  });
}

module.exports = parseAsync;
