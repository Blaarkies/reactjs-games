import * as React from 'react';
import {Action} from './action';
import './style.css'

export class Game extends React.Component {

    renderSquare(i) {
        return <Action value={i} />;
    }

    render() {
        const status = 'Pick your tool';

        return (
            <div className="game-container">
                <div className="status">{status}</div>
                <div className="actions-container">
                    {this.renderSquare('🧱')}
                    {this.renderSquare('📜')}
                    {this.renderSquare('✂')}
                </div>
            </div>
        );
    }
}
