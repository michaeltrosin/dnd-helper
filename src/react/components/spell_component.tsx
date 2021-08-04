import {Component} from 'react';
import {SpellEditor} from '@/react/components/spell_editor';
import {ISpell} from '@/react/components/spell_model';

type State = {
    selected_spell: ISpell & { id: number } | null
};
type Props = {};

// https://www.dnddeutsch.de//tools/json.php?o=dict&mi=true&mo=true&sp=true&it=true&misc=true&s=Hund

export class SpellComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selected_spell: null
        };
    }

    render() {
        return (
            <>
                <SpellEditor spell={this.state.selected_spell}/>
            </>
        );
    }
}
