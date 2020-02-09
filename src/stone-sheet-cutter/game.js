import * as React from 'react';
import {Action} from './action';
import './style.css'
import {getRandomFromArray} from '../common/utilities';
import {Aftermath} from './aftermath';
import {actions, flipStates} from './enums';
import {AnimatedFlip} from '../common/components/animated-flip';

export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: actions,
            flipState: flipStates.startIdle,
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
            flipState: flipStates.forwardFlip
        });
    }

    handleResetClick() {
        this.setState({flipState: flipStates.backwardFlip,});
    }

    handleContinueBackwardFlip() {
        this.setState({
            playerAction: undefined,
            opponentAction: undefined
        });
    }

    render() {
        return (
            <div className="screen-container">
                <AnimatedFlip onContinueBackwardFlip={() => this.handleContinueBackwardFlip()}
                              flipState={this.state.flipState}
                              value={[
                                  <div className="game-container">
                                      <div className="status-text">Pick your tool</div>
                                      <div className="actions-container">
                                          {this.renderAction(this.state.actions.stone)}
                                          {this.renderAction(this.state.actions.sheet)}
                                          {this.renderAction(this.state.actions.cutter)}
                                      </div>
                                  </div>,

                                  <div className="game-container">
                                      <Aftermath value={[this.state.playerAction, this.state.opponentAction]}
                                                 onClick={() => this.handleResetClick()}/>
                                  </div>
                              ]}>
                </AnimatedFlip>
            </div>
        );
    }

}
