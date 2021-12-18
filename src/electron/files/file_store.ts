import { Filesystem } from '@/electron/filesystem';
import fs from 'fs';
import Path from 'path';

class FileStore<TData> {
    private readonly path: string;

    constructor(private name: string,
        protected data: TData) {
        this.path = Path.join(Filesystem.StoreFolder, `${this.name}.store`);
        this.load();
    }

    get T(): Readonly<TData> {
        return this.data;
    }

    get<T extends keyof (TData)>(name: T): TData[T] {
        return this.data[name];
    }

    set<T extends keyof (TData)>(name: T, value: TData[T]): this {
        this.data[name] = value;
        return this;
    }

    save(): this {
        fs.writeFileSync(this.path, JSON.stringify(this.data, null, '\t'), {
            encoding: 'ascii',
        });

        return this;
    }

    load(): this {
        if (!fs.existsSync(this.path)) {
            this.save();
        }

        const read = fs.readFileSync(this.path, {
            encoding: 'ascii',
        });

        this.data = { ...this.data, ...JSON.parse(read) };
        return this;
    }
}

export { FileStore };
