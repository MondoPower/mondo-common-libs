const { LernaProject } = require('lerna-projen');
const { TypeScriptProject, NodePackageManager, JsonFile } = require('projen');

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
  ],
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

const project = new LernaProject({
  ...commonOptions,
  name: 'mondo-common-libs',
  releaseToNpm: true,
});

const mondoResultTypeProject = new TypeScriptProject({
  ...commonOptions,
  description: '',
  parent: project,
  name: '@mondopower/result-types',
  outdir: 'packages/mondo-result-types',
  devDeps: [
    'chai',
    '@types/chai',
    'mocha',
    '@types/mocha',
    '@types/babel__core',
    'ts-eager',
  ],
  docgen: true,
  tsconfig: {
    compilerOptions: {
      target: 'ES2019',
      lib: ['ES2019'],
    },
  },
  keywords: [
    'typescript',
    'projen',
    'mondo',
    'result'
  ]
});
mondoResultTypeProject.eslint.addRules(additionalRules);
const mochaConfig = new JsonFile(mondoResultTypeProject, '.mocharc.json', {
  obj: {
    recursive: true,
    require: ['ts-eager/register'],
    extension: ['ts'],
    spec: ['tests/*.spec.ts'],
  },
});
mondoResultTypeProject.files.push(mochaConfig);

mondoResultTypeProject.testTask.exec('mocha');
project.addSubProject(mondoResultTypeProject);

project.synth();