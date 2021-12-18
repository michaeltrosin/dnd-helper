import { ItemId, ListModel } from '@/react/components/listview/model/listview_model';
import { hash } from '@/utils';
import { Component } from 'react';

type Props = {
    model: ListModel<any>;
    item: ItemId;
};
type State = any;

class ListItem extends Component<Props, State> {
    render(): JSX.Element {
        return (
            <tr className={'listview__table-body-row'}
                onClick={() => {
                    this.props.model.bodyItemClicked(this.props.item);
                }}>
                {
                    this.props.model.listPreview.map(item => {
                        return (
                            <td key={hash(item.binding.toString())} className={`listview__table-body-data listview-data__${item.binding.toString()}-body`}>
                                {this.props.model.textFromBingind(this.props.item, item.binding)}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }
}

export { ListItem };
