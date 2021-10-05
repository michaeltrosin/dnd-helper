import {ListModel} from '@/react/components/listview/model/listview_model';
import { hash } from '@/utils';
import {Component} from 'react';

type Props = {
    model: ListModel<any>;
};
type State = {};

class ListHeader extends Component<Props, State> {
    render(): JSX.Element {
        return (
            <thead className={'listview__table-head'}>
            <tr className={'listview__table-head-row'}>
                {
                    this.props.model.list_preview.map(item => {
                        return (
                            <th key={hash(item.binding.toString())} onClick={() => {
                                this.props.model.header_item_clicked(item.binding);
                            }} className={`listview__table-head-content listview-data__${item.binding.toString()}-head ${item.sortable ? 'clickable' : ''}`}>
                                {item.display}
                            </th>
                        );
                    })
                }
                <th className='listview__table-head-content listview__table-head-spacing'>
                    &nbsp;
                </th>
            </tr>
            </thead>
        );
    }
}

export {ListHeader};
