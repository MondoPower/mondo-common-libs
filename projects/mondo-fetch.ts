import {LernaProject} from 'lerna-projen'
import {commonOptions} from './common'
import {MondoTsProject} from '@mondo/projen-projects'

export function getMondoFetchProject(parentProject: LernaProject): void {
  const mondoFetchProject = new MondoTsProject({
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
      '@types/jest'
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
      'fetch'
    ]
  })
}
