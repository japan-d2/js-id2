export type Pattern = {
  characters: string;
  repeats?: number;
}

export type Format = Pattern[]

export type ConverterOptions = {
  format: Format;
}

export class Converter {
  public options: ConverterOptions

  constructor (options: ConverterOptions) {
    this.options = options
  }

  public static format (template: string, definitions: { [key: string]: string }, compress = true): Format {
    const format: Format = template.split('').map((f) => {
      return {
        characters: definitions[f] || f
      }
    })

    if (!compress) {
      return format
    }

    return format.reduceRight((list, pattern) => {
      const [head, ...tail] = list
      if (list.length > 0 && head.characters === pattern.characters) {
        return [{
          ...pattern,
          repeats: (pattern.repeats || 1) + (head.repeats || 1)
        }, ...tail]
      } else {
        return [pattern, ...list]
      }
    }, [] as Format)
  }

  public get lengthOfID (): number {
    return this.sequence.length
  }

  public get numberOfAvailableIDs (): bigint {
    return this.options.format.map<bigint>((p) => {
      return BigInt(p.characters.length) ** BigInt(p.repeats || 1)
    }).reduce((a, b) => a * b, BigInt(1))
  }

  public get sequence (): string[][] {
    return this.options.format.flatMap<string[]>(({ repeats, characters }) => {
      return new Array(repeats || 1).fill(characters.split(''))
    })
  }

  public get orders (): bigint[] {
    const sequence = this.sequence
    return sequence.map((_, i) => sequence.slice(i).reduce((a, b) => a * BigInt(b.length), BigInt(1)))
  }

  public stringify (n: number | bigint): string {
    if (
      (typeof n === 'number' && n < 0) ||
      (typeof n === 'bigint' && n < BigInt(0))
    ) {
      throw new Error('negative number is not acceptable.')
    }
    if (this.numberOfAvailableIDs < BigInt(n) + BigInt(1)) {
      throw new Error(`number of ids exceeded. number of available ids = ${this.numberOfAvailableIDs}`)
    }
    const sequence = this.sequence
    const orders = this.orders
    const digits = orders.map((o, i) => Number(BigInt(n) % o / (orders[i + 1] || BigInt(1))))
    return digits.map((d, i) => sequence[i][d]).join('')
  }

  public parse (id: string): bigint {
    if (id.length !== this.lengthOfID) {
      throw new Error('invalid id length.')
    }
    const sequence = this.sequence
    const orders = this.orders
    let error: Error | undefined
    const digits = id.split('').map((c, i) => {
      const pattern = sequence[i]
      const n = pattern.indexOf(c)
      if (n < 0) {
        error = new Error(`invalid id. '${c}' (index = ${i}) is not acceptable in [${pattern.join(', ')}].`)
      }
      return BigInt(n) * (orders[i + 1] || BigInt(1))
    })
    if (error) {
      throw error
    }
    return digits.reduce((total, n) => total + n, BigInt(0))
  }
}

export default {
  Converter
}