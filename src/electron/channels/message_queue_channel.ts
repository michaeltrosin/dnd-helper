import { Channels } from '@/shared/channels';
import { AbstractIpcChannel } from '@/shared/ipc';
import { IMessage, IMessageMessageType } from '@/shared/message_queue';

type TArgs = {
    method: 'get';
} | {
    method: 'post';
    data: IMessage;
    length: number;
};
type TReturn = IMessage[];

class MessageQueueChannel extends AbstractIpcChannel<TArgs, TReturn> {
    messages: Map<number, {
        message: IMessage;
        length: number;
        sent_at: number;
    }> = new Map<number, { message: IMessage; length: number; sent_at: number }>();

    current_index = 0;

    get name(): string {
        return Channels.MessageQueue;
    }

    push_raw(message: IMessage, length = 2000): void {
        this.messages.set(this.current_index++, {
            message,
            length,
            sent_at: Date.now(),
        });
    }

    push(title: string, message: string, type: IMessageMessageType = 'info', length = 2000): void {
        this.push_raw({
            type,
            title,
            content: message,
        });
    }

    handle(win: Electron.BrowserWindow, event: Electron.IpcMainEvent, args: TArgs): void {
        // Recalculate
        const now = Date.now();
        const toDelete: number[] = [];

        this.messages.forEach((message, index) => {
            if (now - message.sent_at > message.length) {
                toDelete.push(index);
            }
        });

        toDelete.forEach((index) => {
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

export { MessageQueueChannel };
