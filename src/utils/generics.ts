type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>;

export {RecursivePartial, PartialExcept};
