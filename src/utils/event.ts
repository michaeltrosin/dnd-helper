interface ILiteEvent<T> {
    on(handler: (data?: T) => void): ILiteEvent<T>;
    clear(): ILiteEvent<T>;
    off(handler: (data?: T) => void): ILiteEvent<T>;
}

class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: ((data?: T) => void)[] = [];

    public on(handler: (data?: T) => void): ILiteEvent<T> {
        this.handlers.push(handler);
        return this;
    }

    public clear(): ILiteEvent<T> {
        this.handlers = [];
        return this;
    }

    public off(handler: (data?: T) => void): ILiteEvent<T> {
        this.handlers = this.handlers.filter(h => h !== handler);
        return this;
    }

    public invoke(data?: T): void {
        this.handlers.slice(0).forEach(h => h(data));
    }

    public expose(): ILiteEvent<T> {
        return this;
    }
}

export { ILiteEvent, LiteEvent };
