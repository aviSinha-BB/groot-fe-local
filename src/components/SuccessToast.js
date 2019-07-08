import React, { Component } from "react";
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        top: "50%",
        zIndex: 9999
    },
    spanStyle: {
        fontFamily: "ProximaNova-SemiBold",
        display: 'flex', 
        alignItems: 'center',
    },
    snackIconStyle: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    closeIconStyle: {
        fontSize: 20
    }
});

class SuccessToast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snackOpen: true,
        }
    }

    handleSnackClose = (event, reason) => {
        if (reason == 'clickaway')
            return;
            
        this.setState({snackOpen: false});
    }

    render() {
        const { classes } = this.props;

        return(
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={this.state.snackOpen}
                className={classes.root}
                onClose={this.handleSnackClose}
            >
                <SnackbarContent
                    style={{backgroundColor: green[600]}}
                    aria-describedby='message-id'
                    message={
                                <span id="message-id" className={classes.spanStyle}>
                                <CheckCircleIcon className={classes.snackIconStyle} />
                                    {this.props.message}
                                </span>
                            }
                    onClose={this.handleSnackClose}
                        />
            </Snackbar>
        );
    }
}

SuccessToast.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SuccessToast);