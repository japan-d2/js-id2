export declare type Pattern = {
    characters: string;
    repeats?: number;
};
export declare type Format = Pattern[];
export declare type ConverterOptions = {
    format: Format;
};
export declare class Converter {
    options: ConverterOptions;
    constructor(options: ConverterOptions);
    static format(template: string, definitions: {
        [key: string]: string;
    }, compress?: boolean): Format;
    get lengthOfID(): number;
    get numberOfAvailableIDs(): bigint;
    get sequence(): string[][];
    get orders(): bigint[];
    stringify(n: number | bigint): string;
    parse(id: string): bigint;
}
declare const _default: {
    Converter: typeof Converter;
};
export default _default;
