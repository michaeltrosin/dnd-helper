import {hash} from '@/utils';
import {Component} from 'react';

import './bottombar.scss';

type BottombarState = {};
type BottombarProps = {
    /**
     * @see Bottombar.button
     * @see Bottombar.input
     */
    elements: BottombarComponent[];

    on_click?: (title: string) => void;
    on_changed?: (title: string, content: string) => void;
    on_key_pressed?: (title: string, key: string) => void;
};

enum BottombarComponentType {
    Button,
    Input,
}

class Bottombar extends Component<BottombarProps, BottombarState> {
    /// Bottombar Types
    static button = (text: string, on_click?: () => void) => {
        return new BottombarButton(text, on_click);
    }

    static input = (text: string, content: string = '', on_changed?: (content: string) => void, on_key_pressed?: (key: string) => void) => {
        return new BottombarInput(text, content, on_changed, on_key_pressed);
    }

    /// End Bottombar Types

    render(): JSX.Element {
        return (
            <div className='bottombar'>
                {
                    this.props.elements.map(component => {
                        if (component.type === BottombarComponentType.Button) {
                            const c = component as BottombarButton;
                            return (
                                <button key={hash(c.text)} className='bottombar__button'
                                        onClick={() => {
                                            if (c.on_click) {
                                                c.on_click();

                                                if (this.props.on_click) {
                                                    this.props.on_click(c.text.toLowerCase());
                                                }
                                            }
                                        }}
                                >{c.text}</button>
                            );
                        } else if (component.type === BottombarComponentType.Input) {
                            const c = component as BottombarInput;
                            return (
                                <input key={hash(c.text)} className='bottombar__input' type='text'
                                       defaultValue={c.content}
                                       onChange={event => {
                                           if (c.on_changed) {
                                               c.on_changed(event.target.value);


                                               if (this.props.on_changed) {
                                                   this.props.on_changed(c.text.toLowerCase(), event.target.value);
                                               }
                                           }
                                       }}
                                       onKeyPress={event => {
                                           if (c.on_key_pressed) {
                                               c.on_key_pressed(event.key);

                                               if (this.props.on_key_pressed) {
                                                   this.props.on_key_pressed(c.text.toLowerCase(), event.key);
                                               }
                                           }
                                       }}
                                       placeholder={c.text}
                                />
                            );
                        }
                        return null;
                    })
                }
            </div>
        );
    }
}

interface BottombarComponent {
    type: BottombarComponentType;
}

class BottombarButton implements BottombarComponent {
    constructor(public text: string,
                public on_click?: () => void) {
    }

    type = BottombarComponentType.Button;
}

class BottombarInput implements BottombarComponent {
    constructor(public text: string,
                public content: string = '',
                public on_changed?: (content: string) => void,
                public on_key_pressed?: (key: string) => void) {
    }

    type = BottombarComponentType.Input;
}

export {Bottombar, BottombarComponent};
