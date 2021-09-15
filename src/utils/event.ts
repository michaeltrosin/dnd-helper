interface ILiteEvent<T> {
    on(handler: (data?: T) => void): void;

    off(handler: (data?: T) => void): void;
}

class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: ((data?: T) => void)[] = [];

    public on(handler: (data?: T) => void): void {
        this.handlers.push(handler);
    }

    public off(handler: (data?: T) => void): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public invoke(data?: T): void {
        this.handlers.slice(0).forEach(h => h(data));
    }

    public expose(): ILiteEvent<T> {
        return this;
    }
}

export {ILiteEvent, LiteEvent};
