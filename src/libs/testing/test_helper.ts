import chaiAsPromised from 'chai-as-promised'
import Chai from 'sinon-chai'
import _sinon from 'sinon'
import {restore} from 'sinon'
import {use, expect} from 'chai'

export const sinon = _sinon

export {expect}

use(chaiAsPromised)
use(Chai)

export const subject = beforeEach
export const subjectEach = beforeEach

afterEach(() => {
  restore()
})
