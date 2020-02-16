# id2

the ID converter that can convert between IDs with different orders and character types and unique numeric sequences.

# install

```bash
npm install @japan-d2/id2
```

or

```bash
yarn add @japan-d2/id2
```

# example

## Human Readable ID

### Instantiate

```ts
const id2 = new ID2.Converter({
  format: ID2.Converter.format('XXXX-00000', {
    X: 'ACFHJKPRSTUVWXYZ',
    0: '234567'
  })
})
```

### Convert number to string

```ts
id2.stringify(0)
// => 'AAAA-22222'
id2.stringify(1)
// => 'AAAA-22223'
id2.stringify(1234567)
// => 'AATY-65553'
id2.stringify(id2.numberOfAvailableIDs - BigInt(1))
// => 'ZZZZ-77777'
```

### Convert string to number

```ts
id2.parse('AAAA-22222')
// => 0n
id2.parse('AAAA-22223')
// => 1n
id2.parse('AATY-65553')
// => 1234567n
id2.parse('ZZZZ-77777')
// => 509607935n
```

## UUID v4

### Instantiate

```ts
import ID2 from '@japan-d2/id2'
const id2 = new ID2.Converter({
  format: ID2.Converter.format('RRRRRRRR-RRRR-4RRR-rRRR-RRRRRRRRRRRR', {
    R: '0123456789abcdef',
    r: '89ab'
  })
})
```

### Convert number to string

```ts
id2.stringify(0)
// => '00000000-0000-4000-8000-000000000000'
id2.stringify(BigInt('3881947731413173145134900932847109277'))
// => 'bae8b334-a84b-4d25-ba49-3b943cfc849d'
id2.stringify(id2.numberOfAvailableIDs - BigInt(1))
// => 'ffffffff-ffff-4fff-bfff-ffffffffffff'
```

### Convert string to number

```ts
id2.parse('00000000-0000-4000-8000-000000000000')
// => 0n
id2.parse(BigInt('3881947731413173145134900932847109277'))
// => 3881947731413173145134900932847109277n
id2.parse('ffffffff-ffff-4fff-bfff-ffffffffffff')
// => 5316911983139663491615228241121378303n
```

# classes

## class Converter

#### new Converter (options: Options)

##### `Options`

###### `format`

for ID pattern `[A-Z]{3}-[0-9]{4}`

```ts
new ID2.Converter({
  format: [
    {
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      repeats: 3
    },
    {
      characters: '-',
    },
    {
      characters: '0123456789',
      repeats: 4
    }
  ]
})
```

Or use the more manageable pattern helper.

```ts
// Same format as above.
new ID2.Converter({
  format: ID2.Converter.format('XXX-0000', {
    X: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    0: '0123456789'
  })
}
```

#### stringify (n: number | bigint): string

Converts the given number to a string.

#### parse (id: string): bigint

Converts the given id to a number.

#### lengthOfID: number

ID length specified by format.

#### numberOfAvailableIDs: number

Maximum number of IDs specified by format.

# license

MIT
