declare global {
    interface String {
        empty(): boolean;

        notEmpty(): boolean;
    }
}

String.prototype.empty = function () {
    return this.trim() === '';
}

String.prototype.notEmpty = function () {
    return !this.empty();
}

export {};
