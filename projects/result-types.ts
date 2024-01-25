import {LernaProject} from 'lerna-projen'
import {typescript} from 'projen'
import {additionalRules, addMocha, commonOptions} from './common'
import { MondoTsProject } from '@mondo/projen-projects';

export function getMondoResultTypeProject(parentProject: LernaProject): void {
  const mondoResultTypeProject = new MondoTsProject({
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
  mondoResultTypeProject.eslint?.addRules(additionalRules);
  addMocha(mondoResultTypeProject);
}
