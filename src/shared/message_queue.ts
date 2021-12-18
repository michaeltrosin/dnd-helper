export type IMessageMessageType = 'info' | 'error';

export interface IMessage {
    content: string;
    title: string;
    type: IMessageMessageType;
    index?: number;
}
