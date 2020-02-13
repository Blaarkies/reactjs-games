import * as React from 'react';
import {Action} from './action';
import './style.css'
import {getRandomFromArray} from '../common/utilities';
import {Aftermath} from './aftermath';
import {StoneSheetCutterActions, FlipStates} from '../common/enums';
import {AnimatedFlip} from '../common/components/animated-flip/animated-flip';

export class StoneSheetCutter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: StoneSheetCutterActions,
            flipState: FlipStates.startIdle,
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
            flipState: FlipStates.forwardFlip
        });
    }

    handleResetClick() {
        this.setState({flipState: FlipStates.backwardFlip});
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
