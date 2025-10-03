#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer').default;
const chalk = require('chalk').default;
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { copyRecursive, genConfigFiles } = require('../src/utils');

program
  .name('node-micro')
  .description('CLI to generate a Node.js microservice project')
  .version('1.0.0-alpha.0');

program.action(async () => {
  console.log(chalk.green('🚀 Welcome to Microservice Generator'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Service name:',
      validate: (input) => (input.trim() ? true : 'Service name is required!'),
    },
    { type: 'input', name: 'version', message: 'Version:', default: '1.0.0' },
    { type: 'input', name: 'description', message: 'Description:' },
    {
      type: 'input',
      name: 'author',
      message: 'Author:',
      validate: (input) => (input.trim() ? true : 'Author is required!'),
    },
    {
      type: 'list',
      name: 'protocol',
      message: 'Protocol:',
      choices: ['HTTP', 'gRPC'],
      filter(val) {
        return val.toLowerCase();
      },
    },
  ]);

  const src = path.resolve(__dirname, `../templates/${answers.protocol}`);
  const dest = path.resolve(process.cwd(), answers.name);
  console.log(chalk.yellow('📂 Copying source files...'));
  copyRecursive(src, dest);

  console.log(chalk.yellow('📂 Generating config files...'));
  genConfigFiles(path.join(dest, 'config'), answers);

  // write package.json
  fs.writeFileSync(
    path.join(dest, 'package.json'),
    JSON.stringify(
      {
        name: answers.name,
        version: answers.version,
        description: answers.description,
        author: answers.author,
        main: 'index.js',
        scripts: {
          start: `${answers.protocol === 'grpc' ? 'node-micro-grpc' : 'node-micro-http'} --spec=${answers.protocol === 'grpc' ? 'spec.proto' : 'spec.yaml'} --config=config/dev.yaml index.js`,
          dev: 'nodemon --exec npm run start',
          lint: 'eslint . --ext .js,.mjs',
          'lint:fix': 'eslint . --ext .js,.mjs --fix',
          audit: 'npm audit --audit-level=low --production --json',
          'audit:fix': 'npm audit fix --audit-level=low --json',
          outdated: 'npm outdated --json',
          'outdated:fix': 'npm update',
          test: 'mocha',
          'test:coverage': 'nyc mocha',
        },
      },
      null,
      2,
    ),
  );

  // install dependencies
  const dependencies = {
    http: ['@node-micro/http', '@node-micro/common'],
    grpc: ['@node-micro/grpc', '@node-micro/common'],
  };
  const devDependencies = [
    'chai',
    'eslint',
    'eslint-plugin-import',
    'eslint-plugin-n',
    'mocha',
    'nodemon',
    'nyc',
    'prettier',
    'sinon',
  ];

  console.log(chalk.yellow('📦 Installing dependencies...'));
  try {
    execSync(`npm install ${dependencies[answers.protocol].join(' ')}`, {
      stdio: 'inherit', // so user can see logs
      cwd: dest,           // install inside the created directory
    });
    console.log(chalk.yellow('📦 Installing dev dependencies...'));
    execSync(`npm install -D ${devDependencies.join(' ')}`, {
      stdio: 'inherit', // so user can see logs
      cwd: dest,           // install inside the created directory
    });
    console.log(chalk.blue('✅ Dependencies installed successfully'));
  } catch (err) {
    console.error(chalk.red('❌ Failed to install dependencies'), err);
  }

  console.log(chalk.green(`🎉 Microservice "${answers.name}" is ready!`));
  console.log(`\nNext steps:\n  cd ${answers.name}\n  npm start`);
  console.log(chalk.blue(`✅ Microservice "${answers.name}" created at ${dest}`));
});

program.parse(process.argv);
