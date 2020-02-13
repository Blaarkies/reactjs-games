import * as React from "react";

export class Tile extends React.Component {

    render() {
        return (
            <div className={`overlap-container ${this.props.value ? 'overglow-bloom' : ''}`}>
                <div className={`${this.props.value ? 'tron-square-leading-dot-container' : 'display-none'}`}>
                    <div className="leading-dot"/>
                </div>
                <div className={`${this.props.value ? 'tron-square' : ''}`}/>
                <div className={`tile ${this.props.value ? 'tile-activated' : ''}`}
                     onClick={() => this.checkIfValid()}>
                    <div>{this.props.value}</div>
                </div>
            </div>
        );
    }

    checkIfValid() {
        if (!this.props.value) {
            this.props.onClick();
        }
    }

}
