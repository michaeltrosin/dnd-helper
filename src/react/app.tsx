import React, {Component} from 'react';

import './app.scss';
import {Sidebar} from '@/react/components/sidebar';

import logo from 'asset/resource/icons/dnd.png';
import {SpellView} from '@/react/components/spell/spell_view';
import {ThemeColors} from '@/shared/colors';
import {CustomStyles} from '@/react/custom_styles';

type State = {
    style_color: string;
};

class App extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            style_color: ThemeColors[0]
        };
    }

    render(): JSX.Element {
        const style: CustomStyles = {
            '--background-color': `#${this.state.style_color}`
        };
        return (
            <>
                <div className='background'>
                    <img src={logo} alt=''/>
                </div>
                <div id='app' style={style}>
                    {/*<MessageCenter/>*/}
                    <Sidebar change_page_cb={page => console.log(page)} buttons={['spells', 'settings']}/>
                    <div id='wrapper'>
                        <SpellView/>
                    </div>
                </div>
            </>
        );
    }
}

export default App;
