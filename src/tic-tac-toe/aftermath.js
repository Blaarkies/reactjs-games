import * as React from "react";

export class Aftermath extends React.Component {

    render() {
        let aftermathMessage;
        if (!this.props.winner) {
        } else if (this.props.winner === 'tie') {
            aftermathMessage = 'The match has ended in a tie'
        } else {
            aftermathMessage =
                `Player ${this.props.loser.name} has been defeated by the victorious player ${this.props.winner.name}`
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
