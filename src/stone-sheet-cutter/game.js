import * as React from 'react';
import {Action} from './action';
import './style.css'
import {getRandomFromArray} from '../common/utilities';
import {Aftermath} from './aftermath';
import {actions} from "./enums";

export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: actions,
            gameBoardClasses: [],
            messageBoardClasses: ['display-none']
        };
    }

    renderAction(action) {
        return <Action value={action.display}
                       onClick={() => this.handleActionClick(action)}/>;
    }

    getOpponentAction() {
        const actionsList = Object.values(this.state.actions);
        return getRandomFromArray(actionsList);
    }

    handleActionClick(playerAction) {
        const opponentAction = this.getOpponentAction();

        this.setState({
            playerAction: playerAction,
            opponentAction: opponentAction,
            flipDirectionIsForward: true,
            gameBoardClasses: ['flip-game-board-forward'],
            messageBoardClasses: ['display-none']
        });
    }

    handleGameBoardEndAnimation() {
        if (this.state.flipDirectionIsForward) {
            this.setState({
                gameBoardClasses: ['display-none'],
                messageBoardClasses: ['flip-message-forward']
            })
        } else {
            this.setState({
                gameBoardClasses: [],
                messageBoardClasses: ['display-none']
            })
        }
    }

    handleResetClick() {
        this.setState({
            playerAction: undefined,
            opponentAction: undefined,
            flipDirectionIsForward: false,
            gameBoardClasses: ['display-none'],
            messageBoardClasses: ['flip-message-backward'],
        });
    }

    handleMessageEndAnimation() {
        if (this.state.flipDirectionIsForward) {
            this.setState({
                gameBoardClasses: ['display-none'],
                messageBoardClasses: []
            })
        } else {
            this.setState({
                gameBoardClasses: ['flip-game-board-backward'],
                messageBoardClasses: ['display-none']
            })
        }
    }

    render() {
        const status = 'Pick your tool';

        return (
            <div className={`screen-container`}>
                <div className={`game-container ${this.state.gameBoardClasses.join(' ')}`}
                     onAnimationEnd={() => this.handleGameBoardEndAnimation()}>
                    <div className="status-text">{status}</div>
                    <div className="actions-container">
                        {this.renderAction(this.state.actions.stone)}
                        {this.renderAction(this.state.actions.sheet)}
                        {this.renderAction(this.state.actions.cutter)}
                    </div>
                </div>

                <div className={`message-container ${this.state.messageBoardClasses.join(' ')}`}
                     onAnimationEnd={() => this.handleMessageEndAnimation()}>
                    <Aftermath value={[this.state.playerAction, this.state.opponentAction]}
                               onClick={() => this.handleResetClick()}/>
                </div>
            </div>
        );
    }


}
