import React, { PureComponent } from "react";
import ErrorCover from '../assets/images/error.jpg';

class ErrorBoundary extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        }
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.log(error);
    }

    render() {
        if(this.state.hasError) {
            return(
                <div style={{textAlign: "center"}}>
                    <img src={ErrorCover} width="500" height="600" alt="Error" />
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;