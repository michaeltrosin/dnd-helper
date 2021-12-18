import { DisplayInformationChannel } from '@/electron/channels/display_information_channel';
import { Channels } from '@/shared/channels';
import { ipcRequest } from '@/shared/ipc';
import { hash } from '@/utils';

import logo from '@asset/resource/icons/dnd.png';
import { Component } from 'react';

import './sidebar.scss';

type Props = {
    buttons: string[],
    change_page_cb: (page: string) => void;
};

/**
 * Schnellwahl
 */
class Sidebar extends Component<Props, any> {
    constructor(props: Props) {
        super(props);

        this.display_info = this.display_info.bind(this);
    }

    display_info(): void {
        ipcRequest<DisplayInformationChannel>(Channels.DisplayInformation, {}).then();
    }

    render(): JSX.Element {
        return (
            <div className='sidebar'>
                <div className='sidebar__icon sidebar__component'>
                    <span className='d l'>D</span>
                    <img src={logo} alt='' />
                    <span className='d r'>D</span>
                    <div className='helper'><span>Helper</span></div>
                </div>
                {
                    this.props.buttons.map(prop => {
                        return (
                            <div key={hash(prop)} className='sidebar__button sidebar__component'
                                onClick={() => this.props.change_page_cb(prop)}>
                                <span className='sidebar__button__title'>{`${prop[0].toUpperCase()}${prop.substr(1)}`}</span>
                            </div>
                        );
                    })
                }

                <div className='sidebar__button sidebar__component-small bottom' onClick={() => this.display_info()}>
                    <span className='title'>&#128712;</span>
                </div>
            </div>
        );
    }
}

export { Sidebar };
