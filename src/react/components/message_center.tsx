import {Component} from 'react';

import './message_center.scss';
import {Ipc} from '@/shared/ipc';
import {MessageQueueChannel} from '@/electron/channels/message_queue_channel';
import {Channels} from '@/shared/channels';
import {IMessage} from '@/shared/message_queue';

type State = {
    messages: Array<IMessage>;
};
type Props = {};

export class MessageCenter extends Component<Props, State> {
    timer_loop: NodeJS.Timeout | undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            messages: []
        };

        this.timer_loop = setInterval(() => {
            Ipc.request<MessageQueueChannel>(Channels.MessageQueue, {
                method: 'get'
            })
                .then((result: IMessage[]) => {
                    // Change adding and removing
                    result.forEach(msg => {
                        console.log(msg);
                    });
                    this.setState({
                        messages: result
                    });
                })
                .catch(error => {
                    console.log(error);
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
