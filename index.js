const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const canAccess = Promise.promisify(fs.access);
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);
const args = process.argv.splice(2);

if (args.length !== 2) {
  console.error('Missing arguments. Usage: nice-json <infile> <outfile>');
  process.exit(1);
}

const infile = args[0];
const outfile = args[1];

Promise.all([
  canAccess(infile, fs.R_OK)
]).then(function () {
  return readFile(infile, {encoding: 'utf8'});
}).then(function (buf) {
  let str = JSON.parse(buf);
  let parsed = JSON.stringify(str, null, 2);
  return writeFile(outfile, parsed, {encoding: 'utf8', flag: 'wx'});
}).then(function () {
  console.log('Wrote nice JSON to %s', outfile);
  process.exit(0);
}, function (err) {
  var msg = 'Failed! ';
  switch (err.code) {
    case 'EEXIST':
      msg += 'Outfile already exists.';
      console.error(msg);
      break;
    default:
      msg += 'An error occured';
      console.error(msg, err);
      break;
  }

  process.exit(1);
});
