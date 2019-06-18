import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from "material-table";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Loader from './Loading';
import {
    MuiThemeProvider,
    createMuiTheme
} from '@material-ui/core/styles';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';
import WarningToast from './WarningToast';
import MobileCover from '../assets/images/mobile-cover.jpg';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    tableHeader: {
        fontSize: 18,
        fontFamily: "ProximaNova-SemiBold",
        textTransform: "none",
        textDecoration: "none"
    },
    labelStyle: {
        fontFamily: 'ProximaNova-Regular',
    },
    inputStyle: {
        fontFamily: 'ProximaNova-Regular',
        width: 491
    },
    buttonCreateStyle: {
        height: '40px',
        border: '1px solid #009c50',
        borderRadius: '3px',
        color: '#009c50',
        textTransform: 'none',
        fontFamily: 'ProximaNova-SemiBold',
        margin: theme.spacing.unit,
    },
    buttonCloseStyle: {
        height: '40px',
        border: '1px solid #ea3a2a',
        borderRadius: '3px',
        color: '#ea3a2a',
        textTransform: 'none',
        fontFamily: 'ProximaNova-SemiBold',
        margin: theme.spacing.unit,
    },
    rootFrame: {
        backgroundImage: `url(${MobileCover})`,
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        backgroundSize: '265px',
        marginTop: 4
    },
    frame: {
        marginTop: 33,
        marginBottom: 0,
        marginLeft: 'auto',
        paddingLeft: 142,
        width: '534px',
        height: '550px'
    },
    inner: {
        overflow: 'hidden',
        width: 248,
        height: 499
    },
    iframeStyle: {
        border: 'none'
    }
});

const longText = `
The name must be unique and should not contain any capital letters! 
`;

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            root: {
                padding: 10
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

const themeDialogMobile = createMuiTheme({
    overrides: {
        MuiDialog: {
            paperWidthSm: {
                maxWidth: 600,
                maxHeight: 600
            }
        }
    }
});

class TableGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableFlag: false,
            tableDataUrl: '',
            tableData: [],
            validComp: null,
            open: false,
            successCloneSnack: false,
            errorCloneSnack: false,
            warningCloneSnack: false,
            warningCloneSnackTwo: false,
            warningCloneSnackThree: false,
            successUnpublishSnack: false,
            errorUnpublishSnack: false,
            overallErrorOne: false,
            overallErrorTwo: false,
            overallErrorThree: false,
            overallErrorFour: false,
            overallErrorFive: false,
            openUnpublish: false,
            openMobile: false,
            htmlLocation: '',
            name: '',
            loading: false
        };

    }

    timeout = (ms, promise) => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error("promise timeout"))
            }, ms);
            promise.then(
                (res) => {
                    clearTimeout(timeoutId);
                    resolve(res);
                },
                (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                }
            );
        })
    }

    componentWillMount = () => {
        var url = window.location.href;
        var url_get = url.split("apluscontent/")[1];

        if (url_get == 'all')
            this.setState({ tableDataUrl: templateAPI + "/all?" });
        else
            this.setState({ tableDataUrl: templateAPI + "?" });

        this.setState({ loading: true, overallErrorOne: false });
        this.timeout(pendingTimeout, fetch(templateAPI + '/all', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "X-Requested-With": "XMLHttpRequest",
                [AuthKey]: localStorage.getItem('token')
            }
        })).then(response => {
            if (response.status == 200) {
                return response.json();
            }
            else {
                this.setState({ loading: false });
                throw Error(response.statusText);
            }
        })
            .then(result => {
                this.setState({ loading: false });
                if (Object.keys(result).length > 0) {
                    this.setState({
                        validComp: "table",
                        tableFlag: true
                    }, () => {
                        this.getBlockComponent(this.state.validComp)
                    });
                }
                else {
                    this.setState({
                        validComp: "empty",
                        tableFlag: false
                    }, () => {
                        this.getBlockComponent(this.state.validComp)
                    });
                }
            })
            .catch((error) => {
                this.setState({ loading: false, overallErrorOne: true });
                setTimeout(() => {
                    this.setState({
                        overallErrorOne: false
                    })
                }, timeout)
                console.log('Looks like there was a problem in fetching all table data \n', error);
            });

    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleDialogOpen = () => {
        this.setState({ openUnpublish: true });
    }

    handleMobileOpen = (relativeLoc) => {
        this.setState({ openMobile: true, htmlLocation: relativeLoc });
    }

    handleDialogClose = () => {
        this.setState({ openUnpublish: false, openMobile: false, open: false });
    }

    countUpperCaseChars = (str) => {
        var count = 0, len = str.length;
        for (var i = 0; i < len; i++) {
            if (/[A-Z]/.test(str.charAt(i))) count++;
        }
        return count;
    }

    handleUnpublish = () => {
        var url = window.location.href;
        var tempid = url.split("#")[1];
        this.setState({ loading: true, successUnpublishSnack: false, errorUnpublishSnack: false, overallErrorTwo: false, openUnpublish: false });

        this.timeout(pendingTimeout, fetch(templateAPI + '/deactivate/' + tempid, {
            method: "POST",
            headers: {
                [AuthKey]: localStorage.getItem('token')
            }
        })).then(response => {
            this.setState({ loading: false });
            if (response.status == 200) {
                this.setState({ successUnpublishSnack: true });
                setTimeout(() => {
                    this.setState({
                        successUnpublishSnack: false
                    });
                    window.location.replace(clientHost + 'all');
                }, timeout);
            }
            else {
                this.setState({ errorUnpublishSnack: true });
                setTimeout(() => {
                    this.setState({
                        errorUnpublishSnack: false
                    })
                }, timeout);
            }
        })
            .catch((error) => {
                this.setState({ loading: false, overallErrorTwo: true });
                setTimeout(() => {
                    this.setState({
                        overallErrorTwo: false
                    })
                }, timeout);
                console.log('Looks like there was a problem in Deactivating \n', error);
            });
    }

    handleClose = () => {
        this.setState({ open: false, successCloneSnack: false, errorCloneSnack: false, overallErrorThree: false, overallErrorFour: false, warningCloneSnack: false, warningCloneSnackTwo: false, warningCloneSnackThree: false });

        var url = window.location.href;
        var tempid = url.split("#")[1];
        let valid = "";
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        if (this.state.name == '') {
            this.setState({ warningCloneSnackThree: true });
            setTimeout(() => {
                this.setState({
                    warningCloneSnackThree: false
                })
            }, timeout);
        }

        else if (this.countUpperCaseChars(this.state.name) == 0) {
            this.setState({ loading: true });
            this.timeout(pendingTimeout, fetch(templateAPI + "/" + this.state.name + "-" + dd + "-" + mm + "-" + yyyy + "/is-unique", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                }
            })).then(response => {
                if (response.status == 200) {
                    valid = true;
                }
                else {
                    this.setState({ loading: false });
                    valid = false;
                }
                if (valid == true) {
                    this.timeout(pendingTimeout, fetch(templateAPI + '/clone/' + tempid + '/' + this.state.name + "-" + dd + "-" + mm + "-" + yyyy, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            "X-Requested-With": "XMLHttpRequest",
                            [AuthKey]: localStorage.getItem('token')
                        }
                    })).then(response => {
                        if (response.status == 200)
                            return response.json();
                        else {
                            this.setState({ loading: false });
                            throw Error(response.statusText);
                        }
                    })
                        .then(result => {
                            this.setState({ loading: false });
                            if (Object.keys(result).length > 0) {
                                this.setState({ successCloneSnack: true });
                                setTimeout(() => {
                                    this.setState({
                                        successCloneSnack: false
                                    });
                                    window.location.replace(clientHost);
                                }, timeout);
                            }
                            else {
                                this.setState({ errorCloneSnack: true });
                                setTimeout(() => {
                                    this.setState({
                                        errorCloneSnack: false
                                    })
                                }, timeout);
                            }
                        })
                        .catch((error) => {
                            this.setState({ loading: false, overallErrorThree: true });
                            setTimeout(() => {
                                this.setState({
                                    overallErrorThree: false
                                })
                            }, timeout)
                            console.log('Looks like there was a problem in cloning \n', error);
                        });
                }
                else if (valid == false) {
                    this.setState({ warningCloneSnack: true });
                    setTimeout(() => {
                        this.setState({
                            warningCloneSnack: false
                        })
                    }, timeout);
                }
            })
                .catch((error) => {
                    this.setState({ loading: false, overallErrorFour: true });
                    setTimeout(() => {
                        this.setState({
                            overallErrorFour: false
                        })
                    }, timeout)
                    console.log('Looks like there was a problem in finding unique name \n', error);
                });
        }
        else {
            this.setState({ warningCloneSnackTwo: true });
            setTimeout(() => {
                this.setState({
                    warningCloneSnackTwo: false
                })
            }, timeout);
        }
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    getBlockComponent = (block) => {
        switch (block) {
            case "table":
                let url = this.state.tableDataUrl;
                this.setState({ loading: true, overallErrorFive: false });
                this.timeout(pendingTimeout, fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        [AuthKey]: localStorage.getItem('token')
                    }
                }).then(response => {
                    if (response.status == 200)
                        return response.json();
                    else
                        return null;
                }))
                    .then(result => {
                        this.setState({ loading: false });
                        if (result) {
                            this.setState({ tableData: result.data });
                        }
                        else {
                            this.setState({ tableData: [] });
                        }
                    })
                    .catch((error) => {
                        this.setState({ overallErrorFive: true, loading: false });
                        setTimeout(() => {
                            this.setState({
                                overallErrorFive: false
                            })
                        }, timeout)
                        console.log('Looks like there was a problem in finding table data \n', error);
                    });
                break;

            case "empty":
                break;

            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                {this.state.loading && <Loader />}
                {this.state.tableFlag ? <MuiThemeProvider theme={theme}>
                    <MaterialTable
                        title={<span className={classes.tableHeader}>Manage A+ Content</span>}
                        columns={[
                            // { title: 'SNo.', field: 'id', type: 'numeric' },
                            {
                                title: 'Name of File', field: 'templateName',
                                render: rowData => {
                                    const val = rowData.templateName;
                                    const id = rowData.id;
                                    const statusid = rowData.status.id;
                                    const statusname = rowData.status.name;
                                    let block = null;
                                    if (this.state.tableDataUrl.includes('all')) {
                                        block = val;
                                    }
                                    else {
                                        block = <NavLink exact to={preUrl + "/apluscontent/tempview?" + val + "&tid=" + id + "&sid=" + statusid + "&sname=" + statusname}>
                                            <span>
                                                {val}
                                            </span>
                                        </NavLink>;
                                    }
                                    return (
                                        <span>
                                            {block}
                                        </span>
                                    )
                                }
                            },
                            {
                                title: 'Clone', field: 'action',
                                render: rowData => {
                                    const act = "Clone";
                                    const statusname = rowData.status.name;
                                    let block = false;
                                    if (statusname === statusDraft || statusname === statusReview) {
                                        block = ''
                                    }
                                    else {
                                        block = <a href={'#' + rowData.id} onClick={this.handleClickOpen} >{act}</a>
                                    }
                                    return (
                                        <span>
                                            {block}
                                        </span>
                                    )
                                },
                            },
                            { title: 'Status', field: 'status.displayName' },
                            { title: 'Reviewer', field: 'approvedBy' },
                            { title: 'Manufacturer', field: 'manufacturer' },
                            { title: 'Created By', field: 'createdBy' },
                            { title: 'Created On', field: 'createdOn', type: 'datetime' },
                            { title: 'Modified On', field: 'updatedOn', type: 'datetime' },
                            {
                                title: 'Action', field: 'action',
                                render: rowData => {
                                    const unp = "Unpublish";
                                    const val = rowData.templateName;
                                    const id = rowData.id;
                                    const statusid = rowData.status.id;
                                    const statusname = rowData.status.name;
                                    let block = false;
                                    if (statusname == statusActive) {
                                        block = <a href={'#' + rowData.id} onClick={this.handleDialogOpen}>{unp}</a>
                                    }
                                    else if (statusname == statusSentForPublish || statusname == statusPending) {
                                        block = <NavLink exact to={preUrl + "/apluscontent/tempview?" + val + "&tid=" + id + "&sid=" + statusid + "&sname=" + statusname}>Republish</NavLink>
                                    }
                                    else {
                                        block = ''
                                    }
                                    return (
                                        <span>
                                            {block}
                                        </span>
                                    )
                                },
                            },
                            {
                                title: 'Preview', field: 'location',
                                render: rowData => {
                                    const app = "App";
                                    const web = "Web";
                                    const statusname = rowData.status.name;
                                    const htmlloc = rowData.location;
                                    let block = false;
                                    if (statusname == statusActive && rowData.location) {
                                        block = <span><a href='#' onClick={() => this.handleMobileOpen(htmlloc)}>{app}</a>/<a href={imageHost + htmlloc} target="_blank">{web}</a></span>;
                                    }
                                    else {
                                        block = ''
                                    }
                                    return (
                                        <span>
                                            {block}
                                        </span>
                                    )
                                }
                            },
                        ]}
                        data={this.state.tableData}
                        options={{
                            pageSize: pageListSize,
                            search: false,
                            paging: false,
                            headerStyle: {
                                fontFamily: "ProximaNova-Regular"
                            },
                            rowStyle: {
                                fontFamily: "ProximaNova-Regular"
                            }
                        }}
                    />
                </MuiThemeProvider> : <div className={classes.tableHeader}>There are no records to display!</div>}
                <MuiThemeProvider theme={themeDialog}>
                    <Dialog open={this.state.open} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title" >
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
                        </DialogContent>
                        <DialogActions>
                            <Button className={classes.buttonCloseStyle} onClick={this.handleDialogClose}>
                                Close
                            </Button>
                            <Button className={classes.buttonCreateStyle} onClick={this.handleClose} >
                                Clone
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>

                <MuiThemeProvider theme={themeDialog}>
                    <Dialog open={this.state.openUnpublish} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title" >
                        <DialogTitle id="form-dialog-title">Do you want to unpublish this Aplus content?</DialogTitle>
                        <DialogActions>
                            <Button className={classes.buttonCloseStyle} onClick={this.handleDialogClose}>
                                No
                            </Button>
                            <Button className={classes.buttonCreateStyle} onClick={this.handleUnpublish}>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>

                <MuiThemeProvider theme={themeDialogMobile}>
                    <Dialog open={this.state.openMobile} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title" >
                        <DialogTitle id="form-dialog-title">Mobile Preview</DialogTitle>
                        <DialogContent>
                            <div className={classes.rootFrame}>
                                <div className={classes.frame}>
                                    <div className={classes.inner}>
                                        <iframe src={imageHost + this.state.htmlLocation} height="500" width="263" className={classes.iframeStyle}>
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button className={classes.buttonCloseStyle} onClick={this.handleDialogClose}>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
                {this.state.overallErrorOne && <ErrorToast message="Error in Processing" />}
                {this.state.overallErrorTwo && <ErrorToast message="Error in Processing" />}
                {this.state.overallErrorThree && <ErrorToast message="Error in Processing" />}
                {this.state.overallErrorFour && <ErrorToast message="Error in Processing" />}
                {this.state.overallErrorFive && <ErrorToast message="Error in Processing" />}
                {this.state.successUnpublishSnack && <SuccessToast message="Aplus Template is Sucessfully Unpublished" />}
                {this.state.errorUnpublishSnack && <WarningToast message="Unsucessfull while Unpublishing" />}
                {this.state.successCloneSnack && <SuccessToast message="Aplus Template is Sucessfully Cloned" />}
                {this.state.errorCloneSnack && <ErrorToast message="Unsucessfull while Cloning" />}
                {this.state.warningCloneSnack && <WarningToast message="The AplusTemplate Name Exists" />}
                {this.state.warningCloneSnackTwo && <WarningToast message="The Name Contains Capital Letters" />}
                {this.state.warningCloneSnackThree && <WarningToast message="The Name Cannot be Empty" />}
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(TableGrid));