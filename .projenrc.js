const { LernaProject } = require('lerna-projen');
const {commonOptions} = require('./projects/common')
const {getMondoResultTypeProject} = require('./projects/result-types')

const project = new LernaProject({
  ...commonOptions,
  name: 'mondo-common-libs',
  releaseToNpm: true,
});

getMondoResultTypeProject(project)

project.synth();