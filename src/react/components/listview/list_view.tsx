import {DialogChannel} from '@/electron/channels/dialog_channel';
import {Bottombar} from '@/react/components/bottombar/bottombar';
import {ListHeader} from '@/react/components/listview/header/list_header';
import {ListItem} from '@/react/components/listview/item/list_item';
import {EditType} from '@/react/components/listview/model/edit_model';
import {ItemId, List} from '@/react/components/listview/model/listview_model';
import {ISpell} from '@/react/components/spell/types/spell';
import {Channels} from '@/shared/channels';
import {ipc_request} from '@/shared/ipc';
import {hash} from '@/utils';
import '@/utils/extensions';
import {Component} from 'react';
import SplitPane from 'react-split-pane';

import './list_view.scss';

type Props = {
    model: List<any>;
};
type State = {
    selected_item: ItemId;
    filter_open: boolean;
    edit_mode: boolean;
    new_object: boolean;
    edit_object: any;
};

// FIXME: Name not updating

class ListView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selected_item: -1,
            filter_open: false,
            edit_mode: false,
            new_object: false,
            edit_object: {},
        };

        this.props.model.request_change.on(() => {
            this.setState({
                selected_item: -1,
            });

            this.forceUpdate();
            console.info('Updating');
        });

        this.props.model.item_clicked.on((item) => {
            if (item !== undefined) {
                if (!this.state.edit_mode) {
                    this.setState({
                        selected_item: item,
                    });
                }
            }
        });

        this.props.model.trigger_filter.on(() => {
            this.setState({
                filter_open: !this.state.filter_open,
            });
            console.log('filter', this.state.filter_open);
        });

        this.props.model.summary_model.request_edit.on(() => {
            if (this.state.selected_item !== -1) {
                this.setState({
                    edit_mode: true,
                    edit_object: this.props.model.edit_model?.new(this.props.model.get_item(this.state.selected_item)?.data) ?? {},
                });
            } else {
                ipc_request<DialogChannel>(Channels.Dialog, {
                    type: 'question',
                    buttons: ['Ok'],
                    title: 'Info',
                    message: 'Nichts ausgewählt!',
                }).then();
            }
        });
        this.props.model.summary_model.request_new.on(() => {
            console.log('New');
            this.setState({
                edit_mode: true,
                new_object: true,
                selected_item: -1,
                edit_object: this.props.model.edit_model?.new() ?? {},
            });
        });
        this.props.model.edit_model?.request_cancel.on(() => {
            this.setState({
                edit_mode: false,
                new_object: false,
            });
        });
        this.props.model.edit_model?.request_save.on(() => {
            this.props.model.edit_model?.check_input(this.state.edit_object).then(() => {
                    const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: this.props.model.edit_model?.to_html_body(this.state.edit_object),
                    };

                    if (this.state.new_object) {
                        // TODO: make modular
                        const url = `https://dnd.ra6.io./add`;
                        ipc_request<DialogChannel>(Channels.Dialog, {
                            type: 'question',
                            buttons: ['Ja', 'Nein'],
                            message: 'Sicher, dass du Speichern willst?',
                            title: 'Speichern',
                        }).then(result => {
                            if (result.selected_index === 0) {
                                fetch(url, requestOptions)
                                    .then(res => res.json())
                                    .then(res => {
                                        this.setState({
                                            edit_mode: false,
                                            new_object: false,
                                        });
                                    })
                                    .catch(err => console.error(err));
                            }
                        });
                    } else {
                        // TODO: make modular
                        const url = `https://dnd.ra6.io/edit/${this.props.model.get_item(this.state.selected_item)?.data._id}`;
                        ipc_request<DialogChannel>(Channels.Dialog, {
                            type: 'question',
                            buttons: ['Ja', 'Nein'],
                            message: 'Sicher, dass du die Änderungen speichern willst?',
                            title: 'Änderungen Speichern',
                        }).then(result => {
                            if (result.selected_index === 0) {
                                fetch(url, requestOptions)
                                    .then(res => res.json())
                                    .then(res => {
                                        this.setState({
                                            edit_mode: false,
                                            new_object: false,
                                        });
                                    })
                                    .catch(err => console.error(err));
                            }
                        });
                    }
                },
            );
        });
    }

    private set(key: string, value: any): void {
        this.setState((prev) => ({
            edit_object: {
                ...prev.edit_object,
                [key]: value,
            },
        }));
    }

    render(): JSX.Element {
        return (
            <div className='listview'>
                <SplitPane split='vertical'
                           minSize={600}
                           maxSize={-400}
                >
                    <div className={'flex'}>
                        <div className={'flex__child flex-withbottombar'}>
                            <table className={'listview__table'}>
                                <ListHeader model={this.props.model}/>
                                <tbody className={'listview__table-body'}>
                                {
                                    this.props.model.all_items().map(item => {
                                        return (
                                            <ListItem key={item} model={this.props.model} item={item}/>
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        {
                            this.props.model.bottombar_data().length > 0 &&
                            <Bottombar elements={this.props.model.bottombar_data()}/>
                        }
                    </div>
                    {
                        !this.state.edit_mode ? (
                            <div className={'flex'}>
                                <div className={'flex__child flex-withbottombar summary'}>
                                    <table className={'summary__table'}>
                                        <tbody className={'summary__table-body'}>
                                        {
                                            this.state.selected_item === -1 ? <tr>
                                                    <td>Bitte auswählen</td>
                                                </tr> :
                                                this.props.model.summary_model.keys().map(key => {
                                                    return (
                                                        <tr key={hash(key.toString())}>
                                                            <td className={`summary__table-key summary__table-key-${key.toString()}`}>{this.props.model.summary_model.text_from_key(key)}:</td>
                                                            <td className={`summary__table-value summary__table-value-${key.toString()}`}>{this.props.model.summary_model.text_from_value(key, this.props.model.get_item(this.state.selected_item)?.data)?.text_if_empty('-')}</td>
                                                        </tr>
                                                    );
                                                })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    this.props.model.summary_model.bottombar_data().length > 0 &&
                                    <Bottombar elements={this.props.model.summary_model.bottombar_data()}/>
                                }
                            </div>
                        ) : (
                            <div className='flex'>
                                <div className='flex__child flex-withbottombar edit'>
                                    <table className={'edit__table'}>
                                        <tbody className={'edit__table-body'}>
                                        {
                                            this.props.model.edit_model?.keys().map(key => {
                                                const item = this.props.model.get_item(this.state.selected_item);

                                                const get_data = (edt: EditType) => {
                                                    switch (edt) {
                                                        case EditType.Label: {
                                                            if (!key.data) {
                                                                return null;
                                                            }
                                                            return <span>{key.data[0]}</span>;
                                                        }
                                                        case EditType.Numberfield: {
                                                            const value = item?.data[key.binding] as number;
                                                            if (key.data) {
                                                                return <input min={key.data[0]} max={key.data[1]} defaultValue={value}
                                                                              onChange={(e) => {
                                                                                  this.set(key.binding.toString(), +e.target.value);
                                                                              }}
                                                                              type='number'/>;
                                                            } else {
                                                                return <input defaultValue={value} type='number'
                                                                              onChange={(e) => {
                                                                                  this.set(key.binding.toString(), +e.target.value);
                                                                              }}/>;
                                                            }
                                                        }
                                                        case EditType.Combobox: {
                                                            if (!key.data) {
                                                                return null;
                                                            }
                                                            const value = key.data;
                                                            const selected = item?.data[key.binding] as string;
                                                            return (
                                                                <select defaultValue={selected}
                                                                        onChange={(e) => {
                                                                            this.set(key.binding.toString(), e.target.value);
                                                                        }}>
                                                                    {
                                                                        value.map(val => {
                                                                            return (
                                                                                <option key={val}
                                                                                        value={val}>{this.props.model.edit_model?.binding_key_value(key.binding, val)}</option>
                                                                            );
                                                                        })
                                                                    }
                                                                </select>
                                                            );
                                                        }
                                                        case EditType.CheckboxList: {
                                                            if (key.data) {
                                                                const value = key.data;
                                                                return (
                                                                    value.map(val => {
                                                                        return (
                                                                            <p key={val}>
                                                                                {this.props.model.edit_model?.binding_key_value(key.binding, val)}
                                                                                <input
                                                                                    defaultChecked={item?.data[key.binding].includes(val)}
                                                                                    type='checkbox'
                                                                                    onChange={(e) => {
                                                                                        const checked = e.target.checked;
                                                                                        const data = this.state.edit_object[key.binding] as string[];

                                                                                        const index = data.indexOf(val.toString(), 0);
                                                                                        if (!checked && index > -1) {
                                                                                            data.splice(index, 1);
                                                                                        } else if (checked) {
                                                                                            data.push(val.toString());
                                                                                        }
                                                                                        this.set(key.binding.toString(), data);
                                                                                    }}/>
                                                                            </p>);
                                                                    })
                                                                );
                                                            }
                                                            return null;
                                                        }
                                                        case EditType.Textarea: {
                                                            const value = item?.data[key.binding] as string;
                                                            return <textarea defaultValue={value} cols={40} rows={20}
                                                                             onChange={(e) => {
                                                                                 this.set(key.binding.toString(), e.target.value);
                                                                             }}/>;
                                                        }
                                                        case EditType.Textfield: {
                                                            const value = item?.data[key.binding] as string;
                                                            return <input type='text' defaultValue={value}
                                                                          onChange={(e) => {
                                                                              this.set(key.binding.toString(), e.target.value);
                                                                          }}/>;
                                                        }
                                                        case EditType.Checkbox: {
                                                            const value = item?.data[key.binding] as boolean;
                                                            return <input defaultChecked={value} type='checkbox'
                                                                          onChange={(e) => {
                                                                              this.set(key.binding.toString(), e.target.checked);
                                                                          }}/>;
                                                        }
                                                    }
                                                };

                                                return (
                                                    <tr key={hash(key.binding.toString())}>
                                                        {
                                                            key.type !== EditType.Label &&
                                                            <td>{this.props.model.summary_model.text_from_key(key.binding)}</td>
                                                        }
                                                        <td>{get_data(key.type)}</td>
                                                    </tr>);
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    (this.props.model.edit_model?.bottombar_data().length ?? 0) > 0 &&
                                    <Bottombar elements={this.props.model.edit_model?.bottombar_data() ?? []}/>
                                }
                            </div>
                        )
                    }
                </SplitPane>
            </div>
        );
    }
}

export {ListView};
