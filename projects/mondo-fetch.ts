import {LernaProject} from 'lerna-projen'
import {typescript} from 'projen'
import {additionalRules, addMocha, commonOptions} from './common'

export function getMondoFetchProject(parentProject: LernaProject): void {
  const getMondoFetchProject = new typescript.TypeScriptProject({
    ...commonOptions,
    description: 'Library to use to wrap node fetch',
    // jest: true, // TODO: May want to get jest working.
    parent: parentProject,
    name: '@mondopower/fetch',
    outdir: 'packages/mondo-fetch',
    deps: [
    '@mondopower/result-types',
    ],
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
      'fetch'
    ]
  });
  getMondoFetchProject.eslint?.addRules(additionalRules);
  addMocha(getMondoFetchProject);
}
