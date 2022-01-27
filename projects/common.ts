import {javascript, JsonFile, TextFile} from 'projen'

export const commonOptions = {
  author: 'Mondo Power',
  authorAddress: 'MondoUbiDevelopers@mondo.com.au',
  defaultReleaseBranch: 'main',
  docgen: true,
  repository: 'https://github.com/MondoPower/mondo-common-libs.git',
  packageManager: javascript.NodePackageManager.NPM,
  sampleCode: false,
  jest: false,
  npmignore: [
    '.mocharc.json',
    'docs',
    'projects'
  ],
  npmAccess: javascript.NpmAccess.PUBLIC,
  depsUpgradeOptions: {
    ignoreProjen: false
  }
};

export const additionalRules = {
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

export function addMocha(project: javascript.NodeProject) {
  const mochaConfig = new JsonFile(project, '.mocharc.json', {
    obj: {
      recursive: true,
      require: ['ts-eager/register'],
      extension: ['ts'],
      spec: ['tests/*.spec.ts'],
    },
  })

  project.testTask.exec('mocha')
}

export function addNvmrc(project: javascript.NodeProject, nodeVersion: string): void {
  new TextFile(project, '.nvmrc', {
    lines: [nodeVersion]
  });
}