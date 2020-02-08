import * as React from "react";

export class Action extends React.Component {
    render() {
        return (
            <button className="action">
                {this.props.value}
            </button>
        );
    }
}
