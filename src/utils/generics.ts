
type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>;

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`

type NestedKeyOf<T> = T extends (Date | Array<any>) ? '' : (T extends object ?
    { [K in Exclude<keyof T, symbol>]: `${K}` | `${K}${DotPrefix<NestedKeyOf<T[K]>>}` }[Exclude<keyof T, symbol>]
    : '') extends infer D ? Extract<D, string> : never;

function getNested<T, K extends NestedKeyOf<T>>(obj: T, key: K, defaultValue: any = undefined): any {
    const keyStr = String(key);
    if (!keyStr.includes('.')) {
        return (obj as any)[key] !== undefined ? (obj as any)[key] : defaultValue;
    }

    let object: any = obj;

    for (const path of keyStr.split('.')) {
        if (object === undefined) {
            return defaultValue;
        }
        object = object[path];
    }

    return object !== undefined ? object : defaultValue;
}

function setNested<T, K extends NestedKeyOf<T>>(obj: T, key: K, val: any): Error | undefined {
    const keyStr = String(key);
    if (!keyStr.includes('.')) {
        if ((obj as any)[key] === undefined) {
            return new Error(`Key ${key} is not present in object ${obj}`);
        }
        (obj as any)[key] = val;
        return;
    }
    let object: any = obj;

    const keys = keyStr.split('.');

    for (let i = 0; i < keys.length - 1; i++) {
        if (object === undefined) {
            return new Error(`Key ${key} is not present in object ${obj}`);
        }
        object = object[keys[i]];
    }

    object[keys[keys.length - 1]] = val;
}

export { RecursivePartial, PartialExcept, NestedKeyOf, getNested, setNested };
