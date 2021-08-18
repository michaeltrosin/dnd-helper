import {Component} from 'react';

import './sidebar.scss';

import logo from 'asset/resource/icons/dnd.png';
import {Ipc} from '@/shared/ipc';
import {Channels} from '@/shared/channels';
import {DisplayInformationChannel} from '@/electron/channels/display_information_channel';
import { hash } from '@/utils';

type Props = {
    buttons: string[],
    change_page_cb: (page: string) => void;
};

export class Sidebar extends Component<Props, any> {
    constructor(props: Props) {
        super(props);

        this.display_info = this.display_info.bind(this);
    }

    display_info(): void {
        Ipc.request<DisplayInformationChannel>(Channels.DisplayInformation, {});
    }

    render(): JSX.Element {
        return (
            <div id='sidebar'>
                <div className='icon component'>
                    <span className='d l'>D</span>
                    <img src={logo} alt=''/>
                    <span className='d r'>D</span>
                    <div className='helper'><span>Helper</span></div>
                </div>
                {
                    this.props.buttons.map(prop => {
                        return (
                            <div key={hash(prop)} className='btn component' onClick={() => this.props.change_page_cb(prop)}>
                                <span className='title'>{`${prop[0].toUpperCase()}${prop.substr(1)}`}</span>
                            </div>
                        );
                    })
                }

                <div className='btn component-small bottom' onClick={() => this.display_info()}>
                    <span className='title'>&#128712;</span>
                </div>
            </div>
        );
    }
}
