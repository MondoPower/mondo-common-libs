const { NodePackageManager, NpmAccess, JsonFile } = require('projen');

const commonOptions = {
  author: 'Mondo Power',
  authorAddress: 'MondoUbiDevelopers@mondo.com.au',
  defaultReleaseBranch: 'main',
  repository: 'https://github.com/MondoPower/mondo-common-libs.git',
  packageManager: NodePackageManager.NPM,
  sampleCode: false,
  jest: false,
  npmignore: [
    '.mocharc.json',
    'docs',
    'projects'
  ],
  npmAccess: NpmAccess.PUBLIC
};

const additionalRules = {
  'curly': [
    'error',
    'multi',
    'consistent',
  ],
  'semi': [
    'error',
    'never',
  ],
  'object-curly-spacing': 'error',
  'nonblock-statement-body-position': ['error', 'below'],
};

function addMocha(project) {
  const mochaConfig = new JsonFile(project, '.mocharc.json', {
    obj: {
      recursive: true,
      require: ['ts-eager/register'],
      extension: ['ts'],
      spec: ['tests/*.spec.ts'],
    },
  });
  project.files.push(mochaConfig);
  project.testTask.exec('mocha');
}

module.exports = {
  commonOptions,
  additionalRules,
  addMocha
}