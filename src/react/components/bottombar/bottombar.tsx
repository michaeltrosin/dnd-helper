import { hash } from '@/utils';
import { Component } from 'react';

import './bottombar.scss';

enum BottombarComponentType {
    Button,
    Input,
}

interface BottombarComponent {
    type: BottombarComponentType;
}

type BottombarState = any;
type BottombarProps = {
    /**
     * @see Bottombar.button
     * @see Bottombar.input
     */
    elements: BottombarComponent[];

    onClick?: (title: string) => void;
    onChanged?: (title: string, content: string) => void;
    onKeyPressed?: (title: string, key: string) => void;
};

class Bottombar extends Component<BottombarProps, BottombarState> {
    /// Bottombar Types
    static button = (text: string, onClick?: () => void) => {
        return new BottombarButton(text, onClick);
    };

    static input = (text: string, content = '', onChanged?: (content: string) => void, onKeyPressed?: (key: string) => void) => {
        return new BottombarInput(text, content, onChanged, onKeyPressed);
    };

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
                                        if (c.onClick) {
                                            c.onClick();

                                            if (this.props.onClick) {
                                                this.props.onClick(c.text.toLowerCase());
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
                                        if (c.onChanged) {
                                            c.onChanged(event.target.value);

                                            if (this.props.onChanged) {
                                                this.props.onChanged(c.text.toLowerCase(), event.target.value);
                                            }
                                        }
                                    }}
                                    onKeyPress={event => {
                                        if (c.onKeyPressed) {
                                            c.onKeyPressed(event.key);

                                            if (this.props.onKeyPressed) {
                                                this.props.onKeyPressed(c.text.toLowerCase(), event.key);
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
class BottombarButton implements BottombarComponent {
    constructor(public text: string,
        public onClick?: () => void) {
    }

    type = BottombarComponentType.Button;
}

class BottombarInput implements BottombarComponent {
    constructor(public text: string,
        public content: string = '',
        public onChanged?: (content: string) => void,
        public onKeyPressed?: (key: string) => void) {
    }

    type = BottombarComponentType.Input;
}

export { Bottombar, BottombarComponent };
