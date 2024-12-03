import { LernaTypescriptProject } from 'lerna-projen';
import { javascript, JsonFile, TextFile } from 'projen';

export const commonOptions = {
  author: 'Mondo Power',
  authorAddress: 'MondoUbiDevelopers@mondo.com.au',
  defaultReleaseBranch: 'main',
  docgen: true,
  repository: 'https://github.com/MondoPower/mondo-common-libs.git',
  packageManager: javascript.NodePackageManager.PNPM,
  sampleCode: false,
  jest: false,
  npmignore: [
    '.mocharc.json',
    'docs',
    'projects',
  ],
  npmAccess: javascript.NpmAccess.PUBLIC,
};

export const additionalRules = {
  'object-curly-spacing': 'error',
  'nonblock-statement-body-position': ['error', 'below'],
};

export function addMocha(project: javascript.NodeProject) {
  new JsonFile(project, '.mocharc.json', {
    obj: {
      recursive: true,
      require: ['ts-eager/register'],
      extension: ['ts'],
      spec: ['test/*.spec.ts'],
    },
  });

  project.testTask.exec('mocha');
}

export function addNvmrc(project: javascript.NodeProject, nodeVersion: string): void {
  new TextFile(project, '.nvmrc', {
    lines: [nodeVersion],
  });
}

export function addAutoMergeWorkflow(project: LernaTypescriptProject): void {
  const workflow = project.github?.addWorkflow('auto-merge');
  if (!workflow) {throw new Error('Failed to create auto-merge workflow');}

  workflow.on({
    pullRequestTarget: {
      branches: ['main'],
      types: [
        'labeled',
        'opened',
        'synchronize',
        'reopened',
        'ready_for_review',
      ],
    },
  });
  workflow.addJob('auto-merge', {
    name: 'Enable Auto Merge',
    permissions: {},
    runsOn: ['ubuntu-latest'],
    steps: [
      {
        name: 'Enable Pull Request Automatic merge',
        if: 'contains(github.event.pull_request.labels.*.name, \'auto-approve\') && (github.event.pull_request.user.login == \'ci-mondo\')',
        uses: 'peter-evans/enable-pull-request-automerge@v1',
        with: {
          'token': '${{ secrets.PROJEN_GITHUB_TOKEN }}',
          'pull-request-number': '${{ github.event.pull_request.number }}',
          'merge-method': 'squash',
        },
      },
    ],
  });
}
