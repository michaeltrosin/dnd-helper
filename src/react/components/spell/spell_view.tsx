import {Component} from 'react';

import './spell_view.scss';

type State = {
    filter_visible: boolean;
};

export class SpellView extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            filter_visible: false
        };
    }

    render(): JSX.Element {
        return (
            <>
                <div id='spellview'>
                    <div className='searchview'>
                        <div className='searchview-list'>List</div>
                        <div className='searchview-bottombar'>
                            <input className='searchview-bottombar-input' type='text' placeholder='Titel'/>
                            <button className='searchview-bottombar-search'>Search</button>
                            <button className='searchview-bottombar-filter'
                                    onClick={() => this.setState({filter_visible: !this.state.filter_visible})}>Filter
                                <span>{this.state.filter_visible ? '-' : '+'}</span>
                            </button>
                        </div>
                    </div>
                    <div className='summary'>Zusammenfassung</div>
                </div>
            </>
        );
    }
}
