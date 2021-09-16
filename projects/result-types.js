const { TypeScriptProject } = require('projen');
const {additionalRules, commonOptions, addMocha} = require('./common');

function getMondoResultTypeProject(parentProject) {
  const mondoResultTypeProject = new TypeScriptProject({
    ...commonOptions,
    description: 'Library to use for result type of typescript functions and helper functions.',
    parent: parentProject,
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
  addMocha(mondoResultTypeProject);

  parentProject.addSubProject(mondoResultTypeProject);
}

module.exports = {
  getMondoResultTypeProject
}
