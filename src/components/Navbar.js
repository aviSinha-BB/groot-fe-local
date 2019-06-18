import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Home from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddCircle from '@material-ui/icons/AddCircle';
import LogoIcon from '../assets/images/CMS_logo.svg';

const styles = theme => ({
    root: {
        width: '100%',
    },

    grow: {
        flexGrow: 1,
    },

    buttonStyle: {
        color: "white",
        margin: theme.spacing.unit,
    },

    IconStyle: {
        marginRight: theme.spacing.unit,
    },

    appbarstyle: {
        position: "fixed",
        backgroundColor: "#009c50",
    },

    toolbarStyle: {
        display: 'flex',
        justifyContent: 'space-between'
    },

    logoStyle: {
        display: 'flex',
        justifyContent: 'flex-start'
    },

    navlinkStyle: {
        display: 'flex',
        justifyContent: 'flex-end'
    },

    link: {
        fontSize: 16,
        "font-family": "ProximaNova-Regular",
        textTransform: "none",
        textDecoration: "none"
    }
});

class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userPermission');
        window.location.replace(catalogHost);
    }

    render() {
        const { classes } = this.props;
        let toggle = true;
        const perm = localStorage.getItem('userPermission');
        if (perm != null) {
            if (perm.includes(creatorPermission))
                toggle = true;
            else
                toggle = false;
        }
        return (
            <div className={classes.root}>
                <AppBar className={classes.appbarstyle} >
                    <Toolbar className={classes.toolbarStyle}>
                        <div className={classes.logoStyle}>
                            <img src={LogoIcon} width="90px" height="40px" />
                        </div>
                        <div className={classes.navlinkStyle}>
                            <NavLink exact to={preUrl+"/apluscontent/"} className={classes.link} >
                                <Button color="primary" className={classes.buttonStyle}>
                                    <Home className={classes.IconStyle} />
                                    Home
                                </Button>
                            </NavLink>
                            {toggle && <NavLink exact to={preUrl+"/apluscontent/choosetemp"} className={classes.link}>
                                <Button color="primary" className={classes.buttonStyle} >
                                    <AddCircle className={classes.IconStyle} />
                                    Create New
                                </Button>
                            </NavLink>}
                            <Button color="primary" className={classes.buttonStyle} onClick={this.handleLogout} >
                                <AccountCircle className={classes.IconStyle} />
                                Logout
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Navbar);