import {AbstractIpcChannel} from '@/shared/ipc';
import {Channels} from '@/shared/channels';
import {IMessage, IMessageMessageType} from '@/shared/message_queue';

type TArgs = {
    method: 'get';
} | {
    method: 'post';
    data: IMessage;
    length: number;
};
type TReturn = IMessage[];

export class MessageQueueChannel extends AbstractIpcChannel<TArgs, TReturn> {
    messages: Map<number, {
        message: IMessage;
        length: number;
        sent_at: number;
    }> = new Map<number, { message: IMessage; length: number; sent_at: number }>();

    current_index: number = 0;

    get name(): string {
        return Channels.MessageQueue;
    }

    push_raw(message: IMessage, length: number = 2000) {
        this.messages.set(this.current_index++, {
            message: message,
            length: length,
            sent_at: Date.now()
        });
    }

    push(title: string, message: string, type: IMessageMessageType = 'info', length: number = 2000) {
        this.push_raw({
            type: type,
            title: title,
            content: message
        });
    }

    handle(win: Electron.BrowserWindow, event: Electron.IpcMainEvent, args: TArgs): void {
        // Recalculate
        const now = Date.now();
        const to_delete: number[] = [];

        this.messages.forEach((message, index) => {
            if (now - message.sent_at > message.length) {
                to_delete.push(index);
            }
        });

        to_delete.forEach((index) => {
            this.messages.delete(index);
        });

        if (args.method === 'get') {
            const result: IMessage[] = [];
            this.messages.forEach((message, index) => {
                message.message.index = index;
                result.push(message.message);
            });
            this.resolve(event, result);
        } else if (args.method === 'post') {

            this.push_raw(args.data, args.length);
            this.resolve(event, []);
        }
    }
}
