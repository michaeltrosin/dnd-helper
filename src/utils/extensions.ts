declare global {
    interface String {
        empty(): boolean;

        notEmpty(): boolean;
    }
}

// eslint-disable-next-line no-extend-native
String.prototype.empty = function(): boolean {
    return this.trim() === '';
};

// eslint-disable-next-line no-extend-native
String.prototype.notEmpty = function(): boolean {
    return !this.empty();
};

export {};
