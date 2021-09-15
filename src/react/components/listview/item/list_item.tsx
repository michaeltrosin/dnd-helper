import {ItemId, List} from '@/react/components/listview/model/listview_model';
import { hash } from '@/utils';
import {Component} from 'react';

type Props = {
    model: List<any>;
    item: ItemId;
};
type State = {};

class ListItem extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <tr className={'listview__table-body-row'}
                onClick={() => {
                this.props.model.body_item_clicked(this.props.item);
            }}>
                {
                    this.props.model.list_preview.map(item => {
                        return (
                            <td key={hash(item.binding.toString())} className={`listview__table-body-data listview-data__${item.binding.toString()}-body`}>
                                {this.props.model.text_from_binding(this.props.item, item.binding)}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }
}

export {ListItem};
