import * as React from "react";

export class Aftermath extends React.Component {

    render() {
        return (
            <div className="status-text">
                <div className="aftermath-message">aftermathMessage</div>
                <button onClick={() => this.props.onClick()}>
                    Reset
                </button>
            </div>
        );
    }

}
