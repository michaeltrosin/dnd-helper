import { Background } from '@/react/components/background/background';
import { ListView } from '@/react/components/listview/list_view';
import { ListModel } from '@/react/components/listview/model/listview_model';
import { Model } from '@/react/components/model';
import { Sidebar } from '@/react/components/sidebar/sidebar';
import { SettingsModel } from '@/react/components/tabs/settings/settings_model';
import { SpellModel } from '@/react/components/tabs/spell/spell_model';
import { CustomStyles } from '@/react/custom_styles';
import { ThemeColors } from '@/shared/colors';

import logo from 'asset/resource/icons/dnd.png';
import React, { Component } from 'react';

import './app.scss';
import { ipc_request } from '@/shared/ipc';
import { Channels } from '@/shared/channels';
import path from 'path';

type State = {
    style_color: string;
    model: Model<any>;
};

type Props = {};

class App extends Component<Props, State> {

    spellModel = new SpellModel();
    settingsModel = new SettingsModel();

    listview = React.createRef<ListView>();

    constructor(props: Props) {
        super(props);

        this.state = {
            style_color: ThemeColors.turquoise,
            model: this.spellModel,
        };

        this.settingsModel.refresh();
        this.settingsModel.request_change.on(() => {
            this.forceUpdate();
            console.info('Updating');
        });
    }

    render(): JSX.Element {
        const style: CustomStyles = {
            '--background-color': `${ThemeColors[this.settingsModel.SelectedProfile?.theme ?? 'wet_asphalt']}`,
        };
        return (
            <>
                <Background image={logo}/>
                <div id='app' style={style}>
                    <Sidebar change_page_cb={page => {
                        this.listview.current?.request_switch().then(() => {
                            if (page === 'spells') {
                                this.setState({
                                    model: this.spellModel,
                                });
                            } else if (page === 'settings') {
                                this.setState({
                                    model: this.settingsModel,
                                });
                            }
                        });
                    }} buttons={['spells', 'settings']}/>
                    {
                        (this.state.model instanceof ListModel) &&
                        <ListView ref={this.listview} model={this.state.model}/>
                    }
                </div>
            </>
        )
            ;
    }
}

export { App };
