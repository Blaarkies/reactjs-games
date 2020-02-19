import * as React from "react";

export class Aftermath extends React.Component {

    render() {
        return (
            <div className="status-text overlap-container">
                <div className="half-transparent-backdrop">
                    <div className="aftermath-container">
                        <div className="souls-font">YOU DIED</div>
                        <button className="souls-button" onClick={() => this.props.onClick()}>
                            START OVER
                        </button>
                        <div className="souls-text">or Press F to Pay Respects</div>
                    </div>
                </div>
            </div>
        );
    }

}
