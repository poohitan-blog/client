const { argv } = require('yargs');
const execSSH = require('exec-ssh');
const fs = require('fs');

const env = argv.e || argv.env || argv.environment;

if (!env) {
  console.error('Error: You must pass the environment as an argument');

  process.exit(1);
}

const config = require('../config')[env];

const { host, username, folder } = config.server;
const { repo } = config.git;
const branch = argv.branch || argv.b || config.git.branch;
const { appName } = config.pm2;

const privateKey = fs.readFileSync('/Users/poohitan/.ssh/id_rsa');

const exec = command => execSSH({ host, username, privateKey })(`source ~/.profile && ${command}`);

const deploymentId = Date.now();

exec(`git clone -b ${branch} ${repo} ${folder}/${deploymentId}`)
  .then(() => exec(`npm install --prefix ${folder}/${deploymentId}`))
  .then(() => exec(`npm run build --prefix ${folder}/${deploymentId}`))
  .then(() => exec(`pm2 delete ${appName}`))
  .then(() => exec(`export NODE_ENV=${env} && cd ${folder}/${deploymentId} && pm2 start server.js --name ${appName} --update-env`))
  .then(() => exec(`cd ${folder} && ls | grep -v ${deploymentId} | xargs rm -rf`))
  .then(() => console.log('Deployed successfully.'))
  .catch(error => console.error(error))
  .then(() => process.exit());
