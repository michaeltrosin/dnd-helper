declare global {
    interface String {
        empty(): boolean;

        notEmpty(): boolean;

        textIfEmpty(text: string): string;

        replaceIfMismatch(text: string, replacement: string): string;
    }
}

// eslint-disable-next-line no-extend-native
String.prototype.empty = function (): boolean {
    return this.trim() === '';
};

// eslint-disable-next-line no-extend-native
String.prototype.notEmpty = function (): boolean {
    return !this.empty();
};

// eslint-disable-next-line no-extend-native
String.prototype.textIfEmpty = function (text: string): string {
    if (this.empty()) {
        return text;
    }
    return this.toString();
};

// eslint-disable-next-line no-extend-native
String.prototype.replaceIfMismatch = function (text: string, replacement: string): string {
    if (this.toString() !== text) {
        return replacement;
    }
    return this.toString();
};

export { };
