import {LernaProject} from 'lerna-projen'
import {commonOptions, addNvmrc, addAutoMergeWorkflow} from './projects/common'
import {getMondoResultTypeProject} from './projects/result-types'
import {getMondoFetchProject} from './projects/mondo-fetch'
import { NodePackageManager } from 'projen/lib/javascript'

const workflowNodeVersion = '20'

const project = new LernaProject({
  ...commonOptions,
  projenrcTs: true,
  name: 'mondo-common-libs',
  packageManager: NodePackageManager.PNPM,
  releaseToNpm: true,
  publishTasks: true,
  docgen: true,
  workflowNodeVersion,
  sinceLastRelease: true,
  devDeps: [
    'lerna-projen',
    '@mondo/projen-projects',
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
getMondoFetchProject(project)

project.synth()
