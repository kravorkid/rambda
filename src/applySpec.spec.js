import { T, add, always, compose, dec, inc, map, path, prop } from '../rambda'
import { applySpec } from './applySpec'
import { nAry } from 'ramda'

test.skip('works with empty spec', () => {
  expect(applySpec({})()).toEqual({})
})

test('ramda 1', () => {
  const result = applySpec({
    v : inc,
    u : dec,
  })(1)
  const expected = {
    v : 2,
    u : 0,
  }
  expect(result).toEqual(expected)
})

test('ramda 2', () => {
  const result = applySpec({ sum : add })(1, 2)
  expect(result).toEqual({ sum : 3 })
})

test('ramda 3', () => {
  const result = applySpec({
    unnested : always(0),
    nested   : { sum : add },
  })(1, 2)
  const expected = {
    unnested : 0,
    nested   : { sum : 3 },
  }
  expect(result).toEqual(expected)
})

test.skip('works with arrays of functions', () => {
  const result = applySpec([ map(prop('a')), map(prop('b')) ])([
    {
      a : 'a1',
      b : 'b1',
    },
    {
      a : 'a2',
      b : 'b2',
    },
  ])
  const expected = [
    [ 'a1', 'a2' ],
    [ 'b1', 'b2' ],
  ]
  expect(result).toEqual(expected)
})

test('ramda 5', () => {
  expect(applySpec({ map : prop('a') })({ a : 1 })).toEqual({ map : 1 })
})

test.skip('retains the highest arity', () => {
  const f = applySpec({
    f1 : nAry(2, T),
    f2 : nAry(5, T),
  })
  expect(
    f.length
  ).toBe(5)
})

test('ramda 6', () => {
  expect(
    applySpec({ sum : add })(1)(2)
  ).toEqual({sum: 3})
})

test('arity', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
  }
  expect(applySpec(
    spec, 1, 2, 3
  )).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
  })
})

test('arity over 5 arguments', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
    four : (
      x1, x2, x3, x4
    ) => x1 + x2 + x3 + x4,
    five : (
      x1, x2, x3, x4, x5
    ) => x1 + x2 + x3 + x4 + x5,
  }
  expect(applySpec(
    spec, 1, 2, 3, 4, 5
  )).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
    four  : 10,
    five  : 15,
  })
})

test('curried', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
  }
  expect(applySpec(spec)(1)(2)(3)).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
  })
})

test('curried over 5 arguments', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
    four : (
      x1, x2, x3, x4
    ) => x1 + x2 + x3 + x4,
    five : (
      x1, x2, x3, x4, x5
    ) => x1 + x2 + x3 + x4 + x5,
  }
  expect(applySpec(spec)(1)(2)(3)(4)(5)).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
    four  : 10,
    five  : 15,
  })
})

test('undefined property', () => {
  const spec = { prop : path([ 'property', 'doesnt', 'exist' ]) }
  expect(applySpec(spec, {})).toEqual({ prop : undefined })
})

test('filter spec property that is not callable', () => {
  const spec = { prop : 'not callable' }
  expect(applySpec(spec, {})).toEqual({})
})

test('restructure json object', () => {
  const spec = {
    id          : path('user.id'),
    name        : path('user.firstname'),
    profile     : path('user.profile'),
    doesntExist : path('user.profile.doesntExist'),
    info        : { views : compose(inc, prop('views')) },
    type        : always('playa'),
  }

  const data = {
    user : {
      id        : 1337,
      firstname : 'john',
      lastname  : 'shaft',
      profile   : 'shaft69',
    },
    views : 42,
  }

  expect(applySpec(spec, data)).toEqual({
    id          : 1337,
    name        : 'john',
    profile     : 'shaft69',
    doesntExist : undefined,
    info        : { views : 43 },
    type        : 'playa',
  })
})
