declare global {
    interface String {
        empty(): boolean;

        not_empty(): boolean;

        text_if_empty(text: string): string;
    }
}

// eslint-disable-next-line no-extend-native
String.prototype.empty = function(): boolean {
    return this.trim() === '';
};

// eslint-disable-next-line no-extend-native
String.prototype.not_empty = function(): boolean {
    return !this.empty();
};

// eslint-disable-next-line no-extend-native
String.prototype.text_if_empty = function(text: string): string {
    if (this.empty()) {
        return text;
    }
    return this.toString();
};

export {};
