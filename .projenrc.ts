import {LernaProject} from 'lerna-projen'
import {commonOptions} from './projects/common'
import {getMondoResultTypeProject} from './projects/result-types'

const project = new LernaProject({
  ...commonOptions,
  projenrcTs: true,
  name: 'mondo-common-libs',
  releaseToNpm: true,
  publishTasks: true
});

getMondoResultTypeProject(project)

project.synth();