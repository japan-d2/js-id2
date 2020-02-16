import ID2 from '../src/index'

test('negative number', () => {
  const id2 = new ID2.Converter({
    format: [{
      characters: '0123456789',
      repeats: 4
    }]
  })

  expect(() => id2.stringify(-1234)).toThrow(/negative number/)
  expect(() => id2.stringify(BigInt(-1234))).toThrow(/negative number/)
})

describe('human readable sample', () => {
  const id2 = new ID2.Converter({
    format: ID2.Converter.format('XXXX-00000', {
      X: 'ACFHJKPRSTUVWXYZ',
      0: '234567'
    })
  })

  test('specs', () => {
    expect(id2.lengthOfID).toBe(10)
    expect(id2.numberOfAvailableIDs.toString()).toBe('509607936')
  })

  test('number to id', () => {
    expect(id2.stringify(0)).toBe('AAAA-22222')
    expect(id2.stringify(1)).toBe('AAAA-22223')
    expect(id2.stringify(1234567)).toBe('AATY-65553')
    expect(id2.stringify(id2.numberOfAvailableIDs - BigInt(1))).toBe('ZZZZ-77777')
    expect(() => id2.stringify(id2.numberOfAvailableIDs)).toThrow(/exceeded/)
  })

  test('id to number', () => {
    expect(id2.parse('AATY-65553').toString()).toBe('1234567')
    expect(() => id2.parse('9ATY-65553')).toThrow(/not acceptable/)
    expect(() => id2.parse('AATY-6555')).toThrow(/invalid id length/)
  })
})

describe('uuid v4 sample', () => {
  const id2 = new ID2.Converter({
    format: ID2.Converter.format('RRRRRRRR-RRRR-4RRR-rRRR-RRRRRRRRRRRR', {
      R: '0123456789abcdef',
      r: '89ab'
    })
  })

  test('specs', () => {
    expect(id2.lengthOfID).toBe(36)
    expect(id2.numberOfAvailableIDs.toString())
      .toBe('5316911983139663491615228241121378304')
  })

  test('number to id', () => {
    expect(id2.stringify(0))
      .toBe('00000000-0000-4000-8000-000000000000')

    expect(id2.stringify(1))
      .toBe('00000000-0000-4000-8000-000000000001')

    expect(id2.stringify(BigInt('3881947731413173145134900932847109277')))
      .toBe('bae8b334-a84b-4d25-ba49-3b943cfc849d')

    expect(id2.stringify(id2.numberOfAvailableIDs - BigInt(1)))
      .toBe('ffffffff-ffff-4fff-bfff-ffffffffffff')

    expect(() => id2.stringify(id2.numberOfAvailableIDs))
      .toThrow(/exceeded/)
  })

  test('id to number', () => {
    expect(id2.parse('bae8b334-a84b-4d25-ba49-3b943cfc849d').toString())
      .toBe('3881947731413173145134900932847109277')

    expect(() => id2.parse('00000000-0000-0000-0000-000000000000'))
      .toThrow(/not acceptable/)

    expect(() => id2.parse('00000000-0000-4000-8000-00000000000'))
      .toThrow(/invalid id length/)
  })
})
