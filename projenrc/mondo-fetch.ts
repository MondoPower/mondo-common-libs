import { LernaTypescriptProject } from 'lerna-projen';
import { typescript } from 'projen';
import { additionalRules, commonOptions } from './common';

export function getMondoFetchProject(parentProject: LernaTypescriptProject): void {
  const mondoFetchProject = new typescript.TypeScriptProject({
    ...commonOptions,
    description: 'Library to use to wrap node fetch',
    parent: parentProject,
    name: '@mondopower/fetch',
    outdir: 'packages/mondo-fetch',
    minMajorVersion: 20,
    jest: true,
    packageManager: parentProject.package.packageManager,
    deps: [
      '@mondopower/result-types',
    ],
    devDeps: [
      '@types/jest',
    ],
    tsconfig: {
      compilerOptions: {
        target: 'ES2019',
        lib: ['ES2019'],
      },
    },
    docgen: true,
    keywords: [
      'typescript',
      'projen',
      'mondo',
      'fetch',
    ],
  });
  mondoFetchProject.eslint?.addRules(additionalRules);
}
