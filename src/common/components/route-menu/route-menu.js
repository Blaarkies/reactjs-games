import * as React from "react";
import {emptyFunction} from "../../utilities";
import "./style.scss";
import {Link} from "react-router-dom";

export class RouteMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onStartForwardFlip: props.onStartForwardFlip || emptyFunction,
            onStartBackwardFlip: props.onStartBackwardFlip || emptyFunction,
            routesClass: '',
            isOpen: false
        };
    }

    render() {
        return (
            <div className="route-container">
                <button className="route-button"
                        onClick={() => this.handleClick()}>
                    <div>≡</div>
                </button>
                <div className={`perspective-holder`}>
                    <div className={`route-options ${this.state.routesClass}`}>
                        {this.props.routes.map(r =>
                            <Link to={r.path} onClick={() => this.handleClick()} key={r.path}>{r.title}</Link>)}
                    </div>
                </div>
            </div>
        );
    }

    handleClick() {
        if (this.state.isOpen) {
            this.setState({routesClass: '', isOpen: false});
            this.state.onStartBackwardFlip();
        } else {
            this.setState({routesClass: 'flip-open', perspectiveClass: '', isOpen: true});
            this.state.onStartForwardFlip();
        }
    }

}
