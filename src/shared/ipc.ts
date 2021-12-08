import { BrowserWindow, IpcMainEvent, ipcRenderer } from 'electron';

enum ResultType {
    Resolved,
    Rejected
}

abstract class AbstractIpcChannel<TArgs, TReturn = TArgs> {
    abstract get name(): string;

    static response_name(name: string): string {
        return `${name}_response`;
    }

    readonly resolve = (event: IpcMainEvent, payload: TReturn) => {
        event.sender.send(AbstractIpcChannel.response_name(this.name), {
            payload,
            result: ResultType.Resolved,
        });
    };

    readonly reject = (event: IpcMainEvent, error?: Error | string) => {
        event.sender.send(AbstractIpcChannel.response_name(this.name), {
            payload: error,
            result: ResultType.Rejected,
        });
    };

    abstract handle(win: BrowserWindow, event: IpcMainEvent, args: TArgs): void;
}

type GetParamTypes<C extends AbstractIpcChannel<any, any>> = C extends AbstractIpcChannel<infer A, infer P> ? [A, P] : unknown;

class IpcRequest {
    request<C extends AbstractIpcChannel<any, any>>(channel: string, args: GetParamTypes<C>[0]): Promise<GetParamTypes<C>[1]> {
        return new Promise<GetParamTypes<C>[1]>((resolve, reject) => {
            ipcRenderer.once(AbstractIpcChannel.response_name(channel), (event, cargs: {
                payload: GetParamTypes<C>[1] | Error,
                result: ResultType
            }) => {
                if (cargs.result === ResultType.Resolved) {
                    resolve(cargs.payload as GetParamTypes<C>[1]);
                } else {
                    reject(new Error(String(cargs.payload)));
                }
            });
            ipcRenderer.send(channel, args);
        });
    }
}

export const ipcRequest = new IpcRequest().request;
export { AbstractIpcChannel };
