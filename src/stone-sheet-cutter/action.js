import * as React from "react";

export class Action extends React.Component {

    render() {
        return (
            <button className="action"
                    onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }

}
