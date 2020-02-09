import * as React from "react";
import {flipStates} from "../../stone-sheet-cutter/enums";
import {emptyFunction} from "../utilities";

export class AnimatedFlip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onStartForwardFlip: props.onStartForwardFlip || emptyFunction,
            onContinueForwardFlip: props.onContinueForwardFlip || emptyFunction,
            onStartBackwardFlip: props.onStartBackwardFlip || emptyFunction,
            onContinueBackwardFlip: props.onContinueBackwardFlip || emptyFunction,
            aSideClass: '',
            bSideClass: 'display-none',
            flipDirectionIsForward: true,
            lastFlipState: props.flipState
        };
    }

    render() {
        if (this.state.lastFlipState !== this.props.flipState) {
            switch (this.props.flipState) {
                case flipStates.startIdle:

                    break;
                case flipStates.forwardFlip:
                    this.handleStart();
                    break;
                case flipStates.endIdle:

                    break;
                case flipStates.backwardFlip:
                    this.handleReset();
                    break;
                default:
                    break;
            }
            this.setState({lastFlipState: this.props.flipState});
        }

        return (
            <div className="status-text">
                <div className={this.state.aSideClass}
                     onAnimationEnd={() => this.handleAEndAnimation()}>
                    {this.props.value[0]}
                </div>

                <div className={this.state.bSideClass}
                     onAnimationEnd={() => this.handleBEndAnimation()}>
                    {this.props.value[1]}
                </div>
            </div>
        );
    }

    handleStart() {
        this.setState({
            flipDirectionIsForward: true,
            aSideClass: 'flip-game-board-forward',
            bSideClass: 'display-none'
        });
        this.state.onStartForwardFlip();
    }

    handleAEndAnimation() {
        if (this.state.flipDirectionIsForward) {
            this.setState({
                aSideClass: 'display-none',
                bSideClass: 'flip-message-forward'
            });

            this.state.onContinueForwardFlip();
        } else {
            this.setState({
                aSideClass: '',
                bSideClass: 'display-none'
            });
        }
    }

    handleReset() {
        this.setState({
            flipDirectionIsForward: false,
            aSideClass: 'display-none',
            bSideClass: 'flip-message-backward',
        });

        this.state.onStartBackwardFlip();
    }

    handleBEndAnimation() {
        if (this.state.flipDirectionIsForward) {
            this.setState({
                aSideClass: 'display-none',
                bSideClass: ''
            });
        } else {
            this.setState({
                aSideClass: 'flip-game-board-backward',
                bSideClass: 'display-none'
            });

            this.state.onContinueBackwardFlip();
        }
    }
}
