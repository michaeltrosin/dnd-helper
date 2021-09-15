import {SettingsChannel, SettingsRequestMethod} from '@/electron/channels/settings_channel';
import {Background} from '@/react/components/background/background';
import {ListView} from '@/react/components/listview/list_view';
import {Sidebar} from '@/react/components/sidebar/sidebar';
import {SpellModel} from '@/react/components/spell/spell_model';
import {CustomStyles} from '@/react/custom_styles';
import {Channels} from '@/shared/channels';
import {ThemeColors} from '@/shared/colors';
import {ipc_request} from '@/shared/ipc';

import logo from 'asset/resource/icons/dnd.png';
import React, {Component} from 'react';

import './app.scss';

type State = {
    style_color: string;
    model: SpellModel;
};

class App extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            style_color: ThemeColors.turquoise,
            model: new SpellModel(),
        };

        ipc_request<SettingsChannel>(Channels.Settings, {
            method: SettingsRequestMethod.Get,
        }).then(payload => {
            this.setState({
                style_color: ThemeColors[payload.theme],
            });
        });
    }

    render(): JSX.Element {
        const style: CustomStyles = {
            '--background-color': `${this.state.style_color}`,
        };
        return (
            <>
                <Background image={logo}/>
                <div id='app' style={style}>
                    <Sidebar change_page_cb={page => console.log(page)} buttons={['spells', 'settings']}/>
                    <ListView model={this.state.model}/>
                </div>
            </>
        )
            ;
    }
}

export {App};
