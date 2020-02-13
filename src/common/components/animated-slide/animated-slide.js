import * as React from "react";
import {emptyFunction} from "../../utilities";
import "./style.scss";
import {SlideStates} from "../../enums";

export class AnimatedSlide extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onStartForwardSlide: props.onStartForwardSlide || emptyFunction,
            onStartBackwardSlide: props.onStartBackwardSlide || emptyFunction,
            onEndForwardSlide: props.onEndForwardSlide || emptyFunction,
            onEndBackwardSlide: props.onEndBackwardSlide || emptyFunction,
            isForwardDirection: true,
            animationClass: '',
            lastSlideState: props.slideState
        };
    }

    render() {
        if (this.state.lastSlideState !== this.props.slideState) {
            switch (this.props.slideState) {
                case SlideStates.startIdle:

                    break;
                case SlideStates.forwardSlide:
                    this.handleStart();
                    break;
                case SlideStates.endIdle:

                    break;
                case SlideStates.backwardSlide:
                    this.handleReset();
                    break;
                default:
                    break;
            }
            this.setState({lastSlideState: this.props.slideState});
        }

        return (
            <div className={`overlap-container ${this.state.animationClass}`}
                 onAnimationEnd={() => this.handleEndAnimation()}>
                <div>{this.props.value[0]}</div>

                <div className="offset-offscreen-left">{this.props.value[1]}</div>
            </div>
        );
    }

    handleStart() {
        this.setState({
            isForwardDirection: true,
            animationClass: 'translate-forward'
        });
        this.state.onStartForwardSlide();
    }

    handleReset() {
        this.setState({
            isForwardDirection: false,
            animationClass: 'translate-back'
        });

        this.state.onStartBackwardSlide();
    }

    handleEndAnimation() {
        if (this.state.isForwardDirection) {
            this.state.onEndForwardSlide();
        } else {
            this.state.onEndBackwardSlide();
        }
    }
}
