import * as React from "react";
import {actions} from "./enums";

export class Aftermath extends React.Component {

    render() {
        let aftermathMessage;
        let playerAction = this.props.value[0];
        let opponentAction = this.props.value[1];

        if (playerAction !== undefined && opponentAction !== undefined) {
            let won = actions[playerAction.enum].index === opponentAction.defeatedByIndex;
            aftermathMessage = won ? `You won!` : `You failed to win...`;
        }

        return (
            <div className={`status-text`}>
                <div>Opponent chose {opponentAction?.display}</div>
                <div>Player chose {playerAction?.display}</div>
                <div>{aftermathMessage}</div>
                <button onClick={() => this.props.onClick()}>
                    Reset
                </button>
            </div>
        );
    }

}
