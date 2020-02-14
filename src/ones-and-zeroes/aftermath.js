import * as React from "react";
import {NegativeAdjectives, PositiveAdjectives} from "../common/enums";
import {getRandomFromArray} from "../common/utilities";

export class Aftermath extends React.Component {

    render() {
        let aftermathMessage;
        if (!this.props.winner) {
        } else if (this.props.winner === 'tie') {
            aftermathMessage = 'The match has ended in a tie'
        } else {
            const badAdjective = getRandomFromArray(NegativeAdjectives);
            const goodAdjective = getRandomFromArray(PositiveAdjectives);
            aftermathMessage =
                `The ${badAdjective} ${this.props.loser.name} has been defeated by the ${goodAdjective} ${this.props.winner.name}`
        }

        return (
            <div className="status-text">
                <div className="aftermath-message">{aftermathMessage}</div>
                <button onClick={() => this.props.onClick()}>
                    Reset
                </button>
            </div>
        );
    }

}
