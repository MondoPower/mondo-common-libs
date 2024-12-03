import { LernaTypescriptProject } from 'lerna-projen';
import { NodePackageManager } from 'projen/lib/javascript';
import { commonOptions, addNvmrc, addAutoMergeWorkflow } from './projenrc/common';
import { getMondoFetchProject } from './projenrc/mondo-fetch';
import { getMondoResultTypeProject } from './projenrc/result-types';

const workflowNodeVersion = '20';

const project = new LernaTypescriptProject({
  ...commonOptions,
  projenrcTs: true,
  name: 'mondo-common-libs',
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: '9',
  releaseToNpm: true,
  publishTasks: true,
  docgen: true,
  workflowNodeVersion,
  sinceLastRelease: true,
  devDeps: [
    'lerna-projen',
  ],
  majorVersion: 1,
  stale: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve'],
    },
  },
});

addNvmrc(project, workflowNodeVersion);
addAutoMergeWorkflow(project);

getMondoResultTypeProject(project);
getMondoFetchProject(project);

project.synth();
