"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Converter {
    constructor(options) {
        this.options = options;
    }
    static format(template, definitions, compress = true) {
        const format = template.split('').map((f) => {
            return {
                characters: definitions[f] || f
            };
        });
        if (!compress) {
            return format;
        }
        return format.reduceRight((list, pattern) => {
            const [head, ...tail] = list;
            if (list.length > 0 && head.characters === pattern.characters) {
                return [Object.assign(Object.assign({}, pattern), { repeats: (pattern.repeats || 1) + (head.repeats || 1) }), ...tail];
            }
            else {
                return [pattern, ...list];
            }
        }, []);
    }
    get lengthOfID() {
        return this.sequence.length;
    }
    get numberOfAvailableIDs() {
        return this.options.format.map((p) => {
            return BigInt(p.characters.length) ** BigInt(p.repeats || 1);
        }).reduce((a, b) => a * b, BigInt(1));
    }
    get sequence() {
        return this.options.format.flatMap(({ repeats, characters }) => {
            return new Array(repeats || 1).fill(characters.split(''));
        });
    }
    get orders() {
        const sequence = this.sequence;
        return sequence.map((_, i) => sequence.slice(i).reduce((a, b) => a * BigInt(b.length), BigInt(1)));
    }
    stringify(n) {
        if ((typeof n === 'number' && n < 0) ||
            (typeof n === 'bigint' && n < BigInt(0))) {
            throw new Error('negative number is not acceptable.');
        }
        if (this.numberOfAvailableIDs < BigInt(n) + BigInt(1)) {
            throw new Error(`number of ids exceeded. number of available ids = ${this.numberOfAvailableIDs}`);
        }
        const sequence = this.sequence;
        const orders = this.orders;
        const digits = orders.map((o, i) => Number(BigInt(n) % o / (orders[i + 1] || BigInt(1))));
        return digits.map((d, i) => sequence[i][d]).join('');
    }
    parse(id) {
        if (id.length !== this.lengthOfID) {
            throw new Error('invalid id length.');
        }
        const sequence = this.sequence;
        const orders = this.orders;
        let error;
        const digits = id.split('').map((c, i) => {
            const pattern = sequence[i];
            const n = pattern.indexOf(c);
            if (n < 0) {
                error = new Error(`invalid id. '${c}' (index = ${i}) is not acceptable in [${pattern.join(', ')}].`);
            }
            return BigInt(n) * (orders[i + 1] || BigInt(1));
        });
        if (error) {
            throw error;
        }
        return digits.reduce((total, n) => total + n, BigInt(0));
    }
}
exports.Converter = Converter;
exports.default = {
    Converter
};
