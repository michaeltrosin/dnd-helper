import { DialogChannel } from '@/electron/channels/dialog_channel';
import { ItemId, ListModel } from '@/react/components/listview/model/listview_model';
import { Channels } from '@/shared/channels';
import { ipcRequest } from '@/shared/ipc';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import { hash } from '@/utils';
import '@/utils/extensions';
import React, { Component } from 'react';
import './list_view.scss';
import { ListHeader } from './header/list_header';
import { ListItem } from './item/list_item';
import { Bottombar } from '../bottombar/bottombar';
import { Edit, EditType, Label } from './model/edit_model';
import { getNested, setNested } from '@/utils/generics';

type Props = {
    model: ListModel<any>;
};

type State = {
    selectedItem: ItemId;
    filter_open: boolean;
    editMode: boolean;
    newObject: boolean;
    editObject: any;
    refresh_filter: boolean;
};

class ListView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedItem: -1,
            filter_open: false,
            editMode: false,
            newObject: false,
            editObject: {},
            refresh_filter: false,
        };

        this.add_events();
    }

    private add_events(): void {
        this.props.model.requestChange.clear().on(() => {
            this.setState({
                selectedItem: -1,
            });

            this.forceUpdate();
            console.info('Updating');
        });
        this.props.model.itemClicked.clear().on((item: ItemId | undefined) => {
            // console.log(item);
            if (item !== undefined) {
                if (!this.state.editMode) {
                    this.setState({
                        selectedItem: item,
                    });
                }
            }
        });
        this.props.model.triggerFilter.clear().on(() => {
            this.setState({
                filter_open: !this.state.filter_open,
            });
            // console.log('filter', this.state.filter_open);
        });
        this.props.model.summaryModel.requestEdit.clear().on(() => {
            if (this.state.selectedItem !== -1) {
                const data = this.props.model.editModel?.new(this.props.model.getItem(this.state.selectedItem)?.data) ?? {};
                // console.log(data);

                this.setState({
                    editMode: true,
                    editObject: data,
                });
            } else {
                ipcRequest<DialogChannel>(Channels.Dialog, {
                    type: 'question',
                    buttons: ['Ok'],
                    title: 'Info',
                    message: 'Nichts ausgewählt!',
                }).then();
            }
        });
        this.props.model.summaryModel.requestNew.clear().on(() => {
            console.log('New');
            this.setState({
                editMode: true,
                newObject: true,
                selectedItem: -1,
                editObject: this.props.model.editModel?.new() ?? {},
            });
        });

        this.props.model.editModel?.request_cancel.clear().on(() => {
            this.setState({
                editMode: false,
                newObject: false,
            });
        });
        this.props.model.editModel?.request_save.clear().on(() => {
            // console.log(this.props.model.getItem(this.state.selected_item));
            this.props.model.editModel?.validate_and_save(this.state.editObject, this.state.newObject ? undefined : this.props.model.getItem(this.state.selectedItem)?.data)
                .then(() => {
                    this.setState({
                        editMode: false,
                        newObject: false,
                    });
                }).catch(err => console.error(err));
        });
    }

    public request_switch(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.state.editMode) {
                ipcRequest<DialogChannel>(Channels.Dialog, {
                    type: 'question',
                    buttons: ['Ok'],
                    title: 'Info',
                    message: 'Bitte zuerst speichern!',
                }).then();
                reject(new Error());
                return;
            }
            this.setState({
                selectedItem: -1,
                filter_open: false,
                editMode: false,
                newObject: false,
                editObject: undefined,
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
        //
    }

    private set(key: string, value: any): void {
        const object = this.state.editObject;

        setNested(object, key, value);

        this.setState((prev) => ({
            editObject: object,
        }));
    }

    // TODO: Add back
    render(): JSX.Element {
        return (
            <div className='listview'>
                <Splitter
                    minWidths={[600, 400]}
                    direction={SplitDirection.Horizontal}>

                    <div className={'flex'}>
                        <div className={'flex__child flex-withbottombar'}>
                            <table className={'listview__table'}>
                                <ListHeader model={this.props.model} />
                                <tbody className={'listview__table-body'}>
                                    {
                                        this.props.model.allItems().map(item => {
                                            return (
                                                <ListItem key={item} model={this.props.model} item={item} />
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
                            this.props.model.bottombarData().length > 0 &&
                            <Bottombar elements={this.props.model.bottombarData()} />
                        }
                    </div>
                    {
                        !(this.state.editMode && this.state.editObject !== undefined)
                            ? (
                                <div className={'flex'}>
                                    <div className={'flex__child flex-withbottombar summary'}>
                                        <table className={'summary__table'}>
                                            <tbody className={'summary__table-body'}>
                                                {
                                                    this.state.selectedItem === -1
                                                        ? <tr>
                                                            <td>Bitte auswählen</td>
                                                        </tr>
                                                        : this.props.model.summaryModel.keys().map(key => {
                                                            return (
                                                                <tr key={hash(key.toString())}>
                                                                    <td className={`summary__table-key summary__table-key-${key.toString()}`}>{this.props.model.summaryModel.textFromKey(key)}:</td>
                                                                    <td className={`summary__table-value summary__table-value-${key.toString()}`}>{this.props.model.summaryModel.textFromValue(key, this.props.model.getItem(this.state.selectedItem)?.data)?.textIfEmpty('-')}</td>
                                                                </tr>
                                                            );
                                                        })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {
                                        this.props.model.summaryModel.bottombarData().length > 0 &&
                                        <Bottombar elements={this.props.model.summaryModel.bottombarData()} />
                                    }
                                </div>
                            )
                            : (
                                <div className='flex'>
                                    <div className='flex__child flex-withbottombar edit'>
                                        <table className={'edit__table'}>
                                            <tbody className={'edit__table-body'}>
                                                {
                                                    this.props.model.editModel?.keys().map(k => {
                                                        const item = this.state.editObject; //this.props.model.getItem(this.state.selectedItem);
                                                        let random = Math.random().toString();

                                                        const getData = (edt: EditType) => {
                                                            switch (edt) {
                                                                case EditType.Label: {
                                                                    const key = k as Label<any>;
                                                                    return <span>{key.data as string}</span>;
                                                                }
                                                                case EditType.Numberfield: {
                                                                    const key = k as Edit<any>;
                                                                    random = key.binding.toString();

                                                                    const value = getNested(item, key.binding) as number;
                                                                    if (key.data) {
                                                                        return <input min={key.data[0]} max={key.data[1]} defaultValue={value}
                                                                            onChange={(e) => {
                                                                                this.set(key.binding.toString(), +e.target.value);
                                                                            }}
                                                                            type='number' />;
                                                                    } else {
                                                                        return <input defaultValue={value} type='number'
                                                                            onChange={(e) => {
                                                                                this.set(key.binding.toString(), +e.target.value);
                                                                            }} />;
                                                                    }
                                                                }
                                                                case EditType.Combobox: {
                                                                    const key = k as Edit<any>;
                                                                    random = key.binding.toString();

                                                                    if (!key.data) {
                                                                        return null;
                                                                    }
                                                                    const value = key.data as any[];
                                                                    const selected = getNested(item, key.binding) as string;
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
                                                                                            value={val}>{this.props.model.editModel?.binding_key_value(key.binding, val)}</option>
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
                                                                                        {this.props.model.editModel?.binding_key_value(key.binding, val)}
                                                                                        <input
                                                                                            defaultChecked={getNested(item, key.binding).includes(val)}
                                                                                            type='checkbox'
                                                                                            onChange={(e) => {
                                                                                                const checked = e.target.checked;
                                                                                                const data = getNested(item, key.binding) as string[];

                                                                                                const index = data.indexOf(val.toString(), 0);
                                                                                                if (!checked && index > -1) {
                                                                                                    data.splice(index, 1);
                                                                                                } else if (checked) {
                                                                                                    data.push(val.toString());
                                                                                                }
                                                                                                this.set(key.binding.toString(), data);
                                                                                            }} />
                                                                                    </p>);
                                                                            })
                                                                        );
                                                                    }
                                                                    return null;
                                                                }
                                                                case EditType.Textarea: {
                                                                    const key = k as Edit<any>;
                                                                    random = key.binding.toString();

                                                                    const value = getNested(item, key.binding) as string;
                                                                    return <textarea defaultValue={value} cols={40} rows={20}
                                                                        onChange={(e) => {
                                                                            this.set(key.binding.toString(), e.target.value);
                                                                        }} />;
                                                                }
                                                                case EditType.Textfield: {
                                                                    const key = k as Edit<any>;
                                                                    random = key.binding.toString();

                                                                    const value = getNested(item, key.binding) as string;
                                                                    return <input type='text' defaultValue={value}
                                                                        onChange={(e) => {
                                                                            this.set(key.binding.toString(), e.target.value);
                                                                        }} />;
                                                                }
                                                                case EditType.Checkbox: {
                                                                    const key = k as Edit<any>;
                                                                    random = key.binding.toString();

                                                                    const value = getNested(item, key.binding) as boolean;
                                                                    return <input defaultChecked={value} type='checkbox'
                                                                        onChange={(e) => {
                                                                            this.set(key.binding.toString(), e.target.checked);
                                                                        }} />;
                                                                }
                                                                case EditType.Space: {
                                                                    return <br />;
                                                                }
                                                            }
                                                        };
                                                        // if (random === undefined) {
                                                        //     const key = k as Edit<any>;
                                                        //     random = key.binding.toString();
                                                        // }
                                                        const d = getData(k.type);
                                                        return (
                                                            <tr key={random}>
                                                                {
                                                                    (k.type !== EditType.Label && k.type !== EditType.Space) &&
                                                                    <td className={'edit__table-keys'}>{this.props.model.summaryModel.textFromKey((k as Edit<any>).binding.toString())}</td>
                                                                }
                                                                <td>{d}</td>
                                                            </tr>);
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {
                                        (this.props.model.editModel?.bottombar_data().length ?? 0) > 0 &&
                                        <Bottombar elements={this.props.model.editModel?.bottombar_data() ?? []} />
                                    }
                                </div>
                            )
                    }
                </Splitter>
            </div >
        );
    }

    private construct_filter(): JSX.Element[] {
        const filter = this.props.model.filterData;
        if (filter === undefined) {
            return [];
        }
        const keys = Array.from(filter.keys());
        const maxLength = (): number => {
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

        for (let i = 0; i < maxLength() + 2; i++) {
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
                                    }} /><span>{text}</span></td>;
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

export { ListView };
