import {LernaProject} from 'lerna-projen'
import {commonOptions, addNvmrc} from './projects/common'
import {getMondoResultTypeProject} from './projects/result-types'

const workflowNodeVersion = '14.18.1'

const project = new LernaProject({
  ...commonOptions,
  projenrcTs: true,
  name: 'mondo-common-libs',
  releaseToNpm: true,
  publishTasks: true,
  docgen: true,
  workflowNodeVersion,
  sinceLastRelease: true,
  devDeps: [
    'lerna-projen'
  ],
  majorVersion: 1,
  stale: true
})

addNvmrc(project, workflowNodeVersion)

getMondoResultTypeProject(project)

project.synth();