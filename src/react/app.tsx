import React, {Component} from 'react';

import './app.scss';
import {SpellComponent} from '@/react/components/spell/spell_component';
import {MessageCenter} from '@/react/components/message_center';

type State = {};

class App extends Component<any, State> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div id="app">
                <MessageCenter/>
                <div id="wrapper">
                    <SpellComponent/>
                </div>
            </div>
        );
    }
}

export default App;
