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

const envVariables = {
  NODE_ENV: env,
};

const envVariablesString = Object.keys(envVariables).map(envVariableName => `export ${envVariableName}=${envVariables[envVariableName]}`).join(' && ');

exec(`git clone -b ${branch} ${repo} ${folder}/new`)
  .then(() => exec(`npm install --prefix ${folder}/new`))
  .then(() => exec(`rm -rf ${folder}/current`))
  .then(() => exec(`mv ${folder}/new ${folder}/current`))
  .then(() => exec(`npm run build --prefix ${folder}/current`))
  .then(() => exec(`pm2 stop ${appName}`))
  .then(() => exec(`${envVariablesString} && cd ${folder}/current && pm2 start server.js --name ${appName} --update-env`))
  .then(() => console.log('Deployed successfully.'))
  .catch(error => console.error(error))
  .then(() => process.exit());
