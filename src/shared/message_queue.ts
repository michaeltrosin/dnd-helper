export interface IMessage {
    content: string;
    title: string;
    type: IMessageMessageType;
    index?: number;
}

export type IMessageMessageType = 'info' | 'error';
