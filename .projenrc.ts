import {LernaProject} from 'lerna-projen'
import {commonOptions, addNvmrc, addAutoMergeWorkflow} from './projects/common'
import {getMondoResultTypeProject} from './projects/result-types'

const workflowNodeVersion = '14'

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
  stale: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve']
    }
  },
})

addNvmrc(project, workflowNodeVersion)
addAutoMergeWorkflow(project)

getMondoResultTypeProject(project)

project.synth();