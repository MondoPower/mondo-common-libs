import {LernaProject} from 'lerna-projen'
import {typescript} from 'projen'
import {additionalRules, addMocha, commonOptions} from './common'
import {MondoTsProject} from '@mondo/projen-projects'

export function getMondoFetchProject(parentProject: LernaProject): void {
  const mondoFetchProject = new MondoTsProject({
    ...commonOptions,
    description: 'Library to use to wrap node fetch',
    parent: parentProject,
    name: '@mondopower/fetch',
    outdir: 'packages/mondo-fetch',
    deps: [
    '@mondopower/result-types',
    ],
    devDeps: [
      'chai',
      'chai-as-promised',
      'sinon-chai',
      'sinon',
      '@types/mocha'
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
  })

  mondoFetchProject.eslint?.addRules(additionalRules);
  addMocha(mondoFetchProject);

}
