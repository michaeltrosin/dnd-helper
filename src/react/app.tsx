import React, {Component} from 'react';

import './app.scss';
import {SpellEditor} from '@/react/components/spell_editor';
import {SpellComponent} from '@/react/components/spell_component';

type State = {};

class App extends Component<any, State> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div id="app">
                <div id="wrapper">
                    <SpellComponent/>
                </div>
            </div>
        );
    }
}

export default App;
