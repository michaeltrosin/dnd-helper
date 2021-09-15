import React, {Component} from 'react';
import './background.scss';

type Props = {
    image: string;
};

class Background extends Component<Props, any> {
    render(): JSX.Element {
        return (
            <div className='background'>
                <img className='background__img' src={this.props.image} alt=''/>
            </div>
        );
    }
}

export {Background};
