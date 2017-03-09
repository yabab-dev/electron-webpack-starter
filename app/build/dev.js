const exec = require('child_process').exec;
const treeKill = require('tree-kill');
const conf = require('./conf');

let isElectronOpen = false;
let processes = [];

function run (command, name) {
  let child = exec(command)

  child.stdout.on('data', data => {
    console.log(data.toString());
    if (/webpack: Compiled/g.test(data.toString()) && !isElectronOpen) {
      console.log(`Starting electron...\n`);
      run('export NODE_ENV=development; ./node_modules/.bin/electron .', 'electron');
      isElectronOpen = true
    }
  })

  child.stderr.on('data', data => console.error(data)),
  child.on('exit', code => exit(code));

  processes.push(child);
}

function exit (code) {
  processes.forEach(child => {
    treeKill(child.pid);
  });
}

run(`./node_modules/.bin/webpack-dev-server --config build/webpack/dev --hot --inline --colors --port ${conf.dev.port} `, 'webpack');
