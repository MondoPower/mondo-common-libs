import { LernaTypescriptProject } from 'lerna-projen';
import { typescript } from 'projen';
import { additionalRules, addMocha, commonOptions } from './common';

export function getMondoResultTypeProject(parentProject: LernaTypescriptProject): void {
  const mondoResultTypeProject = new typescript.TypeScriptProject({
    ...commonOptions,
    description: 'Library to use for result type of typescript functions and helper functions.',
    parent: parentProject,
    packageManager: parentProject.package.packageManager,
    name: '@mondopower/result-types',
    outdir: 'packages/mondo-result-types',
    devDeps: [
      'chai',
      '@types/chai',
      'mocha',
      '@types/mocha',
      'ts-eager',
    ],
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
      'result',
    ],
  });
  mondoResultTypeProject.eslint?.addRules(additionalRules);
  addMocha(mondoResultTypeProject);
}
