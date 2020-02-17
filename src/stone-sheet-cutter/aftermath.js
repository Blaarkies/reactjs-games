import * as React from "react";
import {StoneSheetCutterActions} from "../common/enums";

export class Aftermath extends React.Component {

    render() {
        let aftermathMessage;
        let playerAction = this.props.value[0];
        let opponentAction = this.props.value[1];

        if (playerAction !== undefined && opponentAction !== undefined) {
            let won = StoneSheetCutterActions[playerAction.enum].index === opponentAction.defeatedByIndex;
            if (!won && playerAction === opponentAction) {
                aftermathMessage = `You tie~`;
            } else {
                aftermathMessage = won ? `You win!` : `You lose...`;
            }
        }

        return (
            <div className="status-text">
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
