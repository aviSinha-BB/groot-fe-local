import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './ComponentStyle/ChooseTemplateStyle';
import { apitimeout } from './api_timeout';
import { slugify } from './slugifystring';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Temp1 from '../assets/images/Temp1.svg';
import Temp2 from '../assets/images/Temp2.svg';
import { Tooltip, Card, Button } from "@material-ui/core";
import Loader from './Loading';
import {
    MuiThemeProvider,
    createMuiTheme
} from '@material-ui/core/styles';
import ErrorToast from './ErrorToast';
import WarningToast from './WarningToast';

const tileData = [
    {
        img: Temp1,
        titl: 'Temp 1',
    },
    {
        img: Temp2,
        titl: 'Temp 2',
    }
];

const longText = `
The name must be unique and should not contain any capital letters! 
`;

const theme = createMuiTheme({
    overrides: {
        MuiCard: {
            root: {
                width: '100%'
            }
        }
    }
});

const themeDialog = createMuiTheme({
    overrides: {
        MuiDialog: {
            paperWidthSm: {
                width: 600
            }
        }
    }
});

class ChooseTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            name: '',
            loading: false,
            errorCloneSnackTwo: false,
            warningCloneSnack: false,
            warningCloneSnackTwo: false,
            warningCloneSnackThree: false
        }
    }

    countUpperCaseChars = (str) => {
        var count = 0, len = str.length;
        for (var i = 0; i < len; i++) {
            if (/[A-Z]/.test(str.charAt(i))) count++;
        }
        return count;
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleCreate = () => {
        let valid = "";
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        if (this.state.name == '') {
            this.setState({ warningCloneSnack: true });
            setTimeout(() => {
                this.setState({
                    warningCloneSnack: false
                })
            }, timeout);
        }

        else if (this.countUpperCaseChars(this.state.name) == 0) {
            this.setState({ loading: true, errorCloneSnackTwo: false, warningCloneSnack: false, warningCloneSnackThree: false, warningCloneSnackTwo: false });
            apitimeout(pendingTimeout, fetch(templateAPI + "/" + slugify(this.state.name) + "-" + dd + "-" + mm + "-" + yyyy + "/is-unique", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                }
            })).then(response => {
                this.setState({ loading: false });
                if (response.status == 200) {
                    valid = true;
                }
                else if (response.status == 409) {
                    valid = false;
                }
                else {
                    throw Error(response.status);
                }

                if (valid == true) {
                    this.props.history.push(preUrl + '/apluscontent/tempview?' + slugify(this.state.name) + "-" + dd + "-" + mm + "-" + yyyy + "&");
                }
                else if (valid == false) {
                    this.setState({ warningCloneSnackTwo: true });
                    setTimeout(() => {
                        this.setState({
                            warningCloneSnackTwo: false
                        })
                    }, timeout);
                }
            })
                .catch((error) => {
                    this.setState({ loading: false, errorCloneSnackTwo: true });
                    setTimeout(() => {
                        this.setState({
                            errorCloneSnackTwo: false
                        })
                    }, timeout)
                    console.log('Looks like there was a problem in finding unique name \n', error);
                });
        }
        else {
            this.setState({ warningCloneSnackThree: true });
            setTimeout(() => {
                this.setState({
                    warningCloneSnackThree: false
                });
            }, timeout)
        }
    };

    handleDialogClose = () => {
        this.setState({ open: false });
    }

    handleChooseTemplate = (e) => {
        this.setState({ open: true });
        this.props.handleTemplateComponent(e.target.alt);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={this.state.loading ? classes.roottwo : classes.root}>
                <GridList cellHeight='auto' spacing={30} className={classes.gridList}>
                    <GridListTile key="Subheader" cols={2}>
                        <ListSubheader component="div" className={classes.subheader} >Choose a Template</ListSubheader>
                    </GridListTile>
                    <MuiThemeProvider theme={theme}>
                        <Card className={classes.cardStyle}>
                            {tileData.map(tile => (
                                <GridListTile className={classes.tileImgStyle} key={tile.img}>
                                    <img src={tile.img} alt={tile.titl} border={1} onClick={this.handleChooseTemplate} className={classes.imgStyle} />
                                </GridListTile>
                            ))}
                        </Card>
                    </MuiThemeProvider>
                </GridList>
                <MuiThemeProvider theme={themeDialog}>
                    <Dialog open={this.state.open} onClose={this.handleDialogClose} className={this.state.loading && classes.dialogStyle} aria-labelledby="form-dialog-title" >
                        <DialogTitle id="form-dialog-title">Name of A+ Content</DialogTitle>
                        <DialogContent>
                            <Tooltip title={longText} placement="right">
                                <TextField
                                    id="standard-name"
                                    label={<span className={classes.labelStyle}>Name</span>}
                                    className={classes.textField}
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                    autoComplete="off"
                                    InputProps={{
                                        classes: {
                                            input: classes.inputStyle
                                        }
                                    }}
                                    required
                                />
                            </Tooltip>
                            {this.state.loading && <Loader />}
                        </DialogContent>
                        <DialogActions>
                            <Button className={classes.buttonCloseStyle} onClick={this.handleDialogClose}>
                                Close
                            </Button>
                            <Button className={classes.buttonCreateStyle} onClick={this.handleCreate}>
                                Create
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
                {this.state.warningCloneSnack && <WarningToast message="The Name Cannot be Empty" />}
                {this.state.warningCloneSnackTwo && <WarningToast message="The Name Exits" />}
                {this.state.errorCloneSnackTwo && <ErrorToast message="Error in processing" />}
                {this.state.warningCloneSnackThree && <WarningToast message="The Name Contains Capital Letters!" />}
            </div>
        );
    }
}

ChooseTemplate.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseTemplate);