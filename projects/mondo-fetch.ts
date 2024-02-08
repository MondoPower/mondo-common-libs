import {LernaProject} from 'lerna-projen'
import {additionalRules, commonOptions} from './common'
import {MondoTsProject} from '@mondo/projen-projects'
import { NodePackageManager } from 'projen/lib/javascript';

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

  mondoFetchProject.eslint?.addRules(additionalRules);
}
