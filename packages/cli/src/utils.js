const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src)
    .filter((file) => !file.includes('package.json') && !file.includes('package-lock.json'))
    .forEach((file) => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      if (fs.lstatSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
}

function genConfigFiles(configPath, answers) {
  fs.readdirSync(configPath)
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .forEach((file) => {
      const fullPath = path.join(configPath, file);
      const config = yaml.load(fs.readFileSync(fullPath, 'utf8'));
      config.infra.serviceName = answers.name;
      config.infra.serviceVersion = answers.version;
      fs.writeFileSync(fullPath, yaml.dump(config), 'utf8');
    });
}

module.exports = { copyRecursive, genConfigFiles };