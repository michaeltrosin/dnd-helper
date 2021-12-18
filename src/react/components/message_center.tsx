import { MessageQueueChannel } from '@/electron/channels/message_queue_channel';
import { Channels } from '@/shared/channels';
import { ipcRequest } from '@/shared/ipc';
import { IMessage } from '@/shared/message_queue';
import { Component } from 'react';

import '../styles/message_center.scss';

type State = {
    messages: Array<IMessage>;
};
type Props = any;

class MessageCenter extends Component<Props, State> {
    // eslint-disable-next-line no-undef
    timer_loop: NodeJS.Timeout | undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            messages: [],
        };

        this.timer_loop = setInterval(() => {
            ipcRequest<MessageQueueChannel>(Channels.MessageQueue, {
                method: 'get',
            })
                .then((result: IMessage[]) => {
                    // Change adding and removing
                    result.forEach(msg => {
                        console.log(msg);
                    });
                    this.setState({
                        messages: result,
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }, 200);
    }

    componentWillUnmount(): void {
        if (this.timer_loop) {
            clearInterval(this.timer_loop);
        }
    }

    render(): JSX.Element {
        return (
            <div className='message_center'>
                {
                    this.state.messages.map(message => {
                        return (
                            <div key={message.index} className={'message'}>
                                <p>{message.title}</p>
                                <p>{message.content}</p>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export { MessageCenter };
