import React, { Component } from "react";
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import InfoIcon from '@material-ui/icons/Info';
import yellow from '@material-ui/core/colors/yellow';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        top: "50%",
        zIndex: 9999
    },
    spanStyle: {
        display: 'flex',
        fontFamily: "ProximaNova-SemiBold",
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

class WarningToast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snackOpen: true,
        }
    }

    handleSnackClose = (event, reason) => {
        if (reason == 'clickaway')
            return;

        this.state.snackOpen = false;
    }

    render() {
        const { classes } = this.props;

        return (
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
                    style={{ backgroundColor: yellow[800] }}
                    aria-describedby='message-id'
                    message={
                        <span id="message-id" className={classes.spanStyle}>
                            <InfoIcon className={classes.snackIconStyle} />
                            {this.props.message}
                        </span>
                    }
                    onClose={this.handleSnackClose}
                />
            </Snackbar>
        );
    }
}

WarningToast.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WarningToast);