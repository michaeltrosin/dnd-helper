import {DialogChannel} from '@/electron/channels/dialog_channel';
import {Bottombar} from '@/react/components/bottombar/bottombar';
import {ListHeader} from '@/react/components/listview/header/list_header';
import {ListItem} from '@/react/components/listview/item/list_item';
import {Edit, EditType, Label} from '@/react/components/listview/model/edit_model';
import {ItemId, ListModel} from '@/react/components/listview/model/listview_model';
import {Channels} from '@/shared/channels';
import {ipc_request} from '@/shared/ipc';
import {hash} from '@/utils';
import '@/utils/extensions';
import {Component} from 'react';
import SplitPane from 'react-split-pane';

import './list_view.scss';

type Props = {
    model: ListModel<any>;
};

type State = {
    selected_item: ItemId;
    filter_open: boolean;
    edit_mode: boolean;
    new_object: boolean;
    edit_object: any;
    refresh_filter: boolean;
};

class ListView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selected_item: -1,
            filter_open: false,
            edit_mode: false,
            new_object: false,
            edit_object: {},
            refresh_filter: false,
        };

        this.add_events();
    }

    private add_events(): void {
        this.props.model.request_change.clear().on(() => {
            this.setState({
                selected_item: -1,
            });

            this.forceUpdate();
            console.info('Updating');
        });
        this.props.model.item_clicked.clear().on((item: ItemId | undefined) => {
            console.log(item);
            if (item !== undefined) {
                if (!this.state.edit_mode) {
                    this.setState({
                        selected_item: item,
                    });
                }
            }
        });
        this.props.model.trigger_filter.clear().on(() => {
            this.setState({
                filter_open: !this.state.filter_open,
            });
            console.log('filter', this.state.filter_open);
        });
        this.props.model.summary_model.request_edit.clear().on(() => {
            if (this.state.selected_item !== -1) {
                const data = this.props.model.edit_model?.new(this.props.model.get_item(this.state.selected_item)?.data) ?? {};
                console.log(data);

                this.setState({
                    edit_mode: true,
                    edit_object: data,
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
        this.props.model.summary_model.request_new.clear().on(() => {
            console.log('New');
            this.setState({
                edit_mode: true,
                new_object: true,
                selected_item: -1,
                edit_object: this.props.model.edit_model?.new() ?? {},
            });
        });

        this.props.model.edit_model?.request_cancel.clear().on(() => {
            this.setState({
                edit_mode: false,
                new_object: false,
            });
        });
        this.props.model.edit_model?.request_save.clear().on(() => {
            console.log(this.props.model.get_item(this.state.selected_item));
            this.props.model.edit_model?.validate_and_save(this.state.edit_object, this.state.new_object ? undefined : this.props.model.get_item(this.state.selected_item)?.data)
                .then(() => {
                    this.setState({
                        edit_mode: false,
                        new_object: false,
                    });
                }).catch(err => console.error(err));
        });
    }

    public request_switch(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.state.edit_mode) {
                ipc_request<DialogChannel>(Channels.Dialog, {
                    type: 'question',
                    buttons: ['Ok'],
                    title: 'Info',
                    message: 'Bitte zuerst speichern!',
                }).then();
                reject();
                return;
            }
            this.setState({
                selected_item: -1,
                filter_open: false,
                edit_mode: false,
                new_object: false,
                edit_object: {},
            }, () => {
                resolve();
            });
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.model !== this.props.model) {
            this.add_events();
        }
        if (this.state.refresh_filter) {
            this.setState({
                refresh_filter: false,
                filter_open: true,
            });
        }
    }

    reset(): void {
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
                            {
                                this.state.filter_open &&
                                <div className={'filter__wrapper'}>
                                  <div className='filter__background'>
                                    <table>
                                      <thead>
                                      </thead>
                                      <tbody>
                                      {
                                          this.construct_filter()
                                      }
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                            }
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
                                            this.props.model.edit_model?.keys().map(k => {
                                                const item = this.props.model.get_item(this.state.selected_item);
                                                let random = Math.random().toString();

                                                const get_data = (edt: EditType) => {
                                                    switch (edt) {
                                                        case EditType.Label: {
                                                            const key = k as Label<any>;
                                                            return <span>{key.data as string}</span>;
                                                        }
                                                        case EditType.Numberfield: {
                                                            const key = k as Edit<any>;
                                                            random = key.binding.toString();

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
                                                            const key = k as Edit<any>;
                                                            random = key.binding.toString();

                                                            if (!key.data) {
                                                                return null;
                                                            }
                                                            const value = key.data as any[];
                                                            const selected = item?.data[key.binding] as string;
                                                            return (
                                                                <select defaultValue={selected}
                                                                        onChange={(e) => {
                                                                            this.set(key.binding.toString(), e.target.value);
                                                                        }}
                                                                >
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
                                                            const key = k as Edit<any>;
                                                            random = key.binding.toString();

                                                            if (key.data) {
                                                                const value = key.data as any[];
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
                                                            const key = k as Edit<any>;
                                                            random = key.binding.toString();

                                                            const value = item?.data[key.binding] as string;
                                                            return <textarea defaultValue={value} cols={40} rows={20}
                                                                             onChange={(e) => {
                                                                                 this.set(key.binding.toString(), e.target.value);
                                                                             }}/>;
                                                        }
                                                        case EditType.Textfield: {
                                                            const key = k as Edit<any>;
                                                            random = key.binding.toString();

                                                            const value = item?.data[key.binding] as string;
                                                            return <input type='text' defaultValue={value}
                                                                          onChange={(e) => {
                                                                              this.set(key.binding.toString(), e.target.value);
                                                                          }}/>;
                                                        }
                                                        case EditType.Checkbox: {
                                                            const key = k as Edit<any>;
                                                            random = key.binding.toString();

                                                            const value = item?.data[key.binding] as boolean;
                                                            return <input defaultChecked={value} type='checkbox'
                                                                          onChange={(e) => {
                                                                              this.set(key.binding.toString(), e.target.checked);
                                                                          }}/>;
                                                        }
                                                        case EditType.Space: {
                                                            return <br/>;
                                                        }
                                                    }
                                                };
                                                // if (random === undefined) {
                                                //     const key = k as Edit<any>;
                                                //     random = key.binding.toString();
                                                // }
                                                const d = get_data(k.type);
                                                return (
                                                    <tr key={random}>
                                                        {
                                                            (k.type !== EditType.Label && k.type !== EditType.Space) &&
                                                            <td className={'edit__table-keys'}>{this.props.model.summary_model.text_from_key((k as Edit<any>).binding)}</td>
                                                        }
                                                        <td>{d}</td>
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

    private construct_filter(): JSX.Element[] {
        const filter = this.props.model.filter_data;
        if (filter === undefined) {
            return [];
        }
        const keys = Array.from(filter.keys());
        const max_length = (): number => {
            let len = 0;
            for (const key of keys) {
                const item = filter.get(key);
                if (!item) {
                    continue;
                }
                len = Math.max(len, item.bounds.length);
            }
            return len;
        };

        const result: JSX.Element[] = [];

        for (let i = 0; i < max_length() + 2; i++) {
            result.push(
                <tr key={i}>
                    {
                        keys.map(key => {
                            const item = filter.get(key);
                            if (item === undefined) {
                                return undefined;
                            }
                            const bound = item.bounds[i];
                            if (bound === undefined) {
                                if (item.bounds.length === i) {
                                    return <td key={hash('alle')}>
                                        <button className={'filter__button'} onClick={() => {
                                            item.data = Array.from(item.bounds);
                                            this.refresh_filter();
                                        }}>Alle
                                        </button>
                                    </td>;
                                } else if (item.bounds.length === i - 1) {
                                    return <td key={hash('keine')}>
                                        <button className={'filter__button'} onClick={() => {
                                            item.data = [];
                                            this.refresh_filter();
                                        }}>Keine
                                        </button>
                                    </td>;
                                }
                                return undefined;
                            }
                            const text = item.binding === undefined ? bound : item.binding[bound];

                            return <td key={hash(bound)}>
                                <input type='checkbox'
                                       defaultChecked={item.data.includes(bound)}
                                       onChange={event => {
                                           const checked = event.target.checked;

                                           const index = item.data.indexOf(bound, 0);
                                           if (!checked && index > -1) {
                                               item.data.splice(index, 1);
                                           } else if (checked) {
                                               item.data.push(bound);
                                           }
                                           this.refresh_filter();
                                       }}/><span>{text}</span></td>;
                        })
                    }
                </tr>,
            );
        }

        return result;
    }

    private refresh_filter(): void {
        this.setState({
            filter_open: false,
            refresh_filter: true,
        });
    }
}

export {ListView};
