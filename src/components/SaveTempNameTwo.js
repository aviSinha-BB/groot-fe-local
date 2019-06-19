import React, { Component } from "react";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Tooltip } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Loader from './Loading';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';
import WarningToast from './WarningToast';

const modalRoot = document.getElementById('modal-root');

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        opacity: '0.5',
        backgroundColor: '#EFEFEF',
        pointerEvents: 'none'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            width: '197px'
        },
        [theme.breakpoints.up('md')]: {
            width: '210px'
        },
        [theme.breakpoints.up('lg')]: {
            width: '280px'
        }
    },
    buttonSaveStyle: {
        height: '40px',
        border: '1px solid #009c50',
        borderRadius: '3px',
        color: '#009c50',
        textTransform: 'none',
        fontFamily: 'ProximaNova-SemiBold',
        margin: theme.spacing.unit,
    },
    buttonRevStyle: {
        height: '40px',
        border: '1px solid #ffa726',
        borderRadius: '3px',
        color: '#ffa726',
        textTransform: 'none',
        fontFamily: 'ProximaNova-SemiBold',
        margin: theme.spacing.unit,
    },
    buttonPublishStyle: {
        height: '40px',
        border: '1px solid #458ef5',
        borderRadius: '3px',
        color: '#458ef5',
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
    snackIconStyle: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    formControl: {
        margin: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            width: '217px'
        },
        [theme.breakpoints.up('md')]: {
            width: '230px'
        },
        [theme.breakpoints.up('lg')]: {
            width: '300px'
        }
    },
    dialogStyle: {
        opacity: '0.5',
        backgroundColor: '#EFEFEF',
        pointerEvents: 'none'
    },
    actionStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    labelStyle: {
        fontFamily: 'ProximaNova-Regular',
    },
    inputStyle: {
        fontFamily: 'ProximaNova-Regular'
    },
    inputContainer: {
        border: 1
    }
});

const longText = `
All the product id's must be comma separated
`;

const longTextName = `
The name must be unique and should not contain any capital letters! 
`;

class SaveTempNameTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.aplusname,
            maunfactName: '',
            pids: '',
            commentVal: '',
            productAction: 'override',
            tempId: '',
            statusPermission: '',
            togglePid: true,
            open: false,
            loading: false,
            toggleReview: true,
            togglePending: true,
            toggleRevision: true,
            errorSnack: false,
            errorDataSnack: false,
            warningPidSnack: false,
            warningPidLenSnack: false,
            warningNameSnack: false,
            warningNameSnackTwo: false,
            errorTempData: false,
            successReviewSnack: false,
            errorReviewSnack: false,
            successRevisionSnack: false,
            errorRevisionSnack: false,
            successDraftSnack: false,
            errorDraftSnack: false,
            successPublishSnack: false,
            errorPublishSnack: false,
            errorNameSnack: false
        };
        this.el = document.createElement('div');
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

    componentDidMount = () => {
        var url = window.location.href;
        var url_get = url.split("tempview?")[1];
        var url_tid = url_get.split("&")[1];
        var url_sid = url_get.split("&")[2];

        modalRoot.appendChild(this.el);

        if (url_tid) {
            var url_sname = url_get.split("&")[3];
            var get_sname = url_sname.split("=")[1];
            var getTid = url_tid.split("=")[1];
            var getSid = url_sid.split("=")[1];

            this.setState({ tempId: getTid, statusPermission: get_sname });
            this.setState({ loading: true, errorTempData: false });
            this.timeout(pendingTimeout, fetch(templateAPI + '/' + getTid + '/' + getSid, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                }
            })).then(res => {
                if (res.status == 200)
                    return res.json();
                else {
                    this.setState({ loading: false });
                    throw Error(response.statusText);
                }
            })
                .then(result => {
                    this.setState({ loading: false });
                    if (result) {
                        this.setState({
                            maunfactName: result.metaData.manufacturer,
                            pids: result.association.products,
                            commentVal: result.comment,
                            productAction: result.association.action
                        });
                    }
                    else {
                        this.setState({ errorSnack: true });
                        setTimeout(() => {
                            this.setState({
                                errorSnack: false
                            });
                        }, timeout);
                    }
                })
                .catch((error) => {
                    this.setState({ errorTempData: true, loading: false });
                    setTimeout(() => {
                        this.setState({
                            errorTempData: false
                        })
                    }, timeout);
                    console.log('Problem in fetching template data in SaveTempOne \n', error);
                });

            if (get_sname == statusDraft || get_sname == statusReview) {
                this.setState({ toggleRevision: false, togglePending: false });
            }
            else if (get_sname == statusRevision || get_sname == statusSentForPublish) {
                this.setState({ toggleReview: false });
            }
            else if (get_sname == statusPending) {
                this.setState({ toggleReview: false, togglePending: false });
            }
        }
        else {
            this.setState({ toggleRevision: false, togglePending: false });
        }
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    countUpperCaseChars = (str) => {
        var count = 0, len = str.length;
        for (var i = 0; i < len; i++) {
            if (/[A-Z]/.test(str.charAt(i))) count++;
        }
        return count;
    }

    handleMaxProductIds = (prodIdStr) => {
        var prodIdArr = prodIdStr.split(",");
        var prodIdLength = prodIdArr.length;

        if (prodIdLength <= 20)
            return true;
        else
            return false;
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleDialogOpen = () => {
        this.setState({ open: true });
    }

    handleDialogClose = () => {
        this.setState({ open: false });
    }

    handleReview = () => {
        if (this.handleMaxProductIds(this.state.pids)) {
            this.setState({ loading: true, successReviewSnack: false, errorReviewSnack: false });
            this.timeout(pendingTimeout, fetch(templateAPI + "/change/state/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "data": {
                        "hvT": {
                            "tag": "header-video",
                            "heading": this.props.headingvalue,
                            "videoSrc": this.props.videoStr
                        },
                        "hihspM": {
                            "tag": "header-image-anotherHeader-subheader-para",
                            "heading": this.props.headingTwovalue,
                            "imageSrc": this.props.imgsrcTwovalue,
                            "anotherHeading": this.props.anotherHeadingvalue,
                            "subHeading": this.props.subheadingvalue,
                            "paragraph": this.props.paravalue
                        },
                        "hspihB": {
                            "tag": "anotherHeader-subheader-para-image-header",
                            "anotherHeading": this.props.anotherHeadingTwovalue,
                            "subHeading": this.props.subheadingTwovalue,
                            "paragraph": this.props.paraTwovalue,
                            "imageSrc": this.props.imgsrcThreevalue,
                            "heading": this.props.headingThreevalue
                        },
                        "ispLT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcFourvalue,
                            "subHeading": this.props.subheadingThreevalue,
                            "paragraph": this.props.paraThreevalue
                        },
                        "ispMT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcFivevalue,
                            "subHeading": this.props.subheadingFourvalue,
                            "paragraph": this.props.paraFourvalue
                        },
                        "ispRT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcSixvalue,
                            "subHeading": this.props.subheadingFivevalue,
                            "paragraph": this.props.paraFivevalue
                        },
                        "ispLB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcSevenvalue,
                            "subHeading": this.props.subheadingSixvalue,
                            "paragraph": this.props.paraSixvalue
                        },
                        "ispMB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcEightvalue,
                            "subHeading": this.props.subheadingSevenvalue,
                            "paragraph": this.props.paraEightvalue
                        },
                        "ispRB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcNinevalue,
                            "subHeading": this.props.subheadingEightvalue,
                            "paragraph": this.props.paraEightvalue
                        }
                    },
                    "metaData": {
                        "templateName": this.state.name,
                        "templateTag": this.props.tempComponent,
                        "action": "createToReview",
                        "taskId": this.props.taskId,
                        "templateId": this.state.tempId,
                        "manufacturer": this.state.maunfactName
                    },
                    "association": {
                        "products": this.state.pids,
                        "action": this.state.productAction
                    },
                    "comment": this.state.commentVal
                })
            })).then(
                response => {
                    if (response.status == 200) {
                        this.setState({ loading: false, successReviewSnack: true });
                        setTimeout(() => {
                            this.setState({
                                successReviewSnack: false
                            });
                            window.location.replace(clientHost);
                        }, timeout);
                        return;
                    }
                    else {
                        this.setState({ loading: false, errorReviewSnack: true });
                        setTimeout(() => {
                            this.setState({
                                errorReviewSnack: false
                            })
                        }, timeout);
                        return;
                    }
                }
            ).catch((error) => {
                this.setState({ errorDataSnack: true, loading: false });
                setTimeout(() => {
                    this.setState({
                        errorDataSnack: false
                    })
                }, timeout);
                console.log('Looks like there was a problem in saving template \n', error);
            });
        }
        else {
            this.setState({
                warningPidLenSnack: true
            });
            setTimeout(() => {
                this.setState({
                    warningPidLenSnack: false
                })
            }, timeout);
        }
    }

    handleRevision = () => {
        if (this.handleMaxProductIds(this.state.pids)) {
            this.setState({ loading: true, successRevisionSnack: false, errorRevisionSnack: false });
            this.timeout(pendingTimeout, fetch(templateAPI + "/change/state/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "data": {
                        "hvT": {
                            "tag": "header-video",
                            "heading": this.props.headingvalue,
                            "videoSrc": this.props.videoStr
                        },
                        "hihspM": {
                            "tag": "header-image-anotherHeader-subheader-para",
                            "heading": this.props.headingTwovalue,
                            "imageSrc": this.props.imgsrcTwovalue,
                            "anotherHeading": this.props.anotherHeadingvalue,
                            "subHeading": this.props.subheadingvalue,
                            "paragraph": this.props.paravalue
                        },
                        "hspihB": {
                            "tag": "anotherHeader-subheader-para-image-header",
                            "anotherHeading": this.props.anotherHeadingTwovalue,
                            "subHeading": this.props.subheadingTwovalue,
                            "paragraph": this.props.paraTwovalue,
                            "imageSrc": this.props.imgsrcThreevalue,
                            "heading": this.props.headingThreevalue
                        },
                        "ispLT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcFourvalue,
                            "subHeading": this.props.subheadingThreevalue,
                            "paragraph": this.props.paraThreevalue
                        },
                        "ispMT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcFivevalue,
                            "subHeading": this.props.subheadingFourvalue,
                            "paragraph": this.props.paraFourvalue
                        },
                        "ispRT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcSixvalue,
                            "subHeading": this.props.subheadingFivevalue,
                            "paragraph": this.props.paraFivevalue
                        },
                        "ispLB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcSevenvalue,
                            "subHeading": this.props.subheadingSixvalue,
                            "paragraph": this.props.paraSixvalue
                        },
                        "ispMB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcEightvalue,
                            "subHeading": this.props.subheadingSevenvalue,
                            "paragraph": this.props.paraEightvalue
                        },
                        "ispRB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcNinevalue,
                            "subHeading": this.props.subheadingEightvalue,
                            "paragraph": this.props.paraEightvalue
                        }
                    },
                    "metaData": {
                        "templateName": this.state.name,
                        "templateTag": this.props.tempComponent,
                        "action": "reviewToCreate",
                        "taskId": this.props.taskId,
                        "templateId": this.state.tempId,
                        "manufacturer": this.state.maunfactName
                    },
                    "association": {
                        "products": this.state.pids,
                        "action": this.state.productAction
                    },
                    "comment": this.state.commentVal
                })
            })).then(
                response => {
                    if (response.status == 200) {
                        this.setState({ loading: false, successRevisionSnack: true });
                        setTimeout(() => {
                            this.setState({
                                successRevisionSnack: false
                            });
                            window.location.replace(clientHost);
                        }, timeout);
                        return;
                    }
                    else {
                        this.setState({ loading: false, errorRevisionSnack: true });
                        setTimeout(() => {
                            this.setState({
                                errorRevisionSnack: false
                            })
                        }, timeout);
                        return;
                    }
                }
            ).catch((error) => {
                this.setState({ errorDataSnack: true, loading: false });
                setTimeout(() => {
                    this.setState({
                        errorDataSnack: false
                    })
                }, timeout);
                console.log('Looks like there was a problem in saving template \n', error);
            });
        }
        else {
            this.setState({
                warningPidLenSnack: true
            });
            setTimeout(() => {
                this.setState({
                    warningPidLenSnack: false
                })
            }, timeout);
        }
    }

    handleDraft = () => {
        if (this.handleMaxProductIds(this.state.pids)) {
            this.setState({ loading: true, successDraftSnack: false, errorDraftSnack: false });
            this.timeout(pendingTimeout, fetch(templateAPI + "/draft/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "data": {
                        "hvT": {
                            "tag": "header-video",
                            "heading": this.props.headingvalue,
                            "videoSrc": this.props.videoStr
                        },
                        "hihspM": {
                            "tag": "header-image-anotherHeader-subheader-para",
                            "heading": this.props.headingTwovalue,
                            "imageSrc": this.props.imgsrcTwovalue,
                            "anotherHeading": this.props.anotherHeadingvalue,
                            "subHeading": this.props.subheadingvalue,
                            "paragraph": this.props.paravalue
                        },
                        "hspihB": {
                            "tag": "anotherHeader-subheader-para-image-header",
                            "anotherHeading": this.props.anotherHeadingTwovalue,
                            "subHeading": this.props.subheadingTwovalue,
                            "paragraph": this.props.paraTwovalue,
                            "imageSrc": this.props.imgsrcThreevalue,
                            "heading": this.props.headingThreevalue
                        },
                        "ispLT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcFourvalue,
                            "subHeading": this.props.subheadingThreevalue,
                            "paragraph": this.props.paraThreevalue
                        },
                        "ispMT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcFivevalue,
                            "subHeading": this.props.subheadingFourvalue,
                            "paragraph": this.props.paraFourvalue
                        },
                        "ispRT": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcSixvalue,
                            "subHeading": this.props.subheadingFivevalue,
                            "paragraph": this.props.paraFivevalue
                        },
                        "ispLB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcSevenvalue,
                            "subHeading": this.props.subheadingSixvalue,
                            "paragraph": this.props.paraSixvalue
                        },
                        "ispMB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcEightvalue,
                            "subHeading": this.props.subheadingSevenvalue,
                            "paragraph": this.props.paraEightvalue
                        },
                        "ispRB": {
                            "tag": "image-subheading-para",
                            "imageSrc": this.props.imgsrcNinevalue,
                            "subHeading": this.props.subheadingEightvalue,
                            "paragraph": this.props.paraEightvalue
                        }
                    },
                    "metaData": {
                        "templateName": this.state.name,
                        "templateTag": this.props.tempComponent,
                        "action": "draft",
                        "manufacturer": this.state.maunfactName
                    },
                    "association": {
                        "products": this.state.pids,
                        "action": this.state.productAction
                    },
                    "comment": this.state.commentVal
                })
            })).then(
                response => {
                    if (response.status == 200) {
                        this.setState({ loading: false });
                        this.setState({ successDraftSnack: true });
                        setTimeout(() => {
                            this.setState({
                                successDraftSnack: false
                            });
                            window.location.replace(clientHost);
                        }, timeout);
                        return;
                    }
                    else {
                        this.setState({ loading: false, errorDraftSnack: true });
                        setTimeout(() => {
                            this.setState({
                                errorDraftSnack: false
                            })
                        }, timeout);
                        return;
                    }
                }
            ).catch((error) => {
                this.setState({ errorDataSnack: true, loading: false });
                setTimeout(() => {
                    this.setState({
                        errorDataSnack: false
                    })
                }, timeout);
                console.log('Looks like there was a problem in saving template \n', error);
            });
        }
        else {
            this.setState({
                warningPidLenSnack: true
            });
            setTimeout(() => {
                this.setState({
                    warningPidLenSnack: false
                })
            }, timeout);
        }
    }

    handleCreate = () => {
        let valid = "";
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        if (this.state.name == '') {
            alert("The Name Cannot be Empty!");
        }

        else if (this.countUpperCaseChars(this.state.name) == 0) {
            this.setState({ loading: true, errorNameSnack: false, warningNameSnack: false, warningNameSnackTwo: false });
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
                else if (response.status == 409) {
                    this.setState({ loading: false });
                    valid = false;
                }
                else {
                    this.setState({ loading: false, errorNameSnack: true });
                    setTimeout(() => {
                        this.setState({
                            errorNameSnack: false
                        })
                    }, timeout);
                }

                if (valid == true) {
                    if (this.handleMaxProductIds(this.state.pids)) {
                        this.timeout(pendingTimeout, fetch(templateAPI + "/draft/", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "X-Requested-With": "XMLHttpRequest",
                                [AuthKey]: localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                "data": {
                                    "hvT": {
                                        "tag": "header-video",
                                        "heading": this.props.headingvalue,
                                        "videoSrc": this.props.videoStr
                                    },
                                    "hihspM": {
                                        "tag": "header-image-anotherHeader-subheader-para",
                                        "heading": this.props.headingTwovalue,
                                        "imageSrc": this.props.imgsrcTwovalue,
                                        "anotherHeading": this.props.anotherHeadingvalue,
                                        "subHeading": this.props.subheadingvalue,
                                        "paragraph": this.props.paravalue
                                    },
                                    "hspihB": {
                                        "tag": "anotherHeader-subheader-para-image-header",
                                        "anotherHeading": this.props.anotherHeadingTwovalue,
                                        "subHeading": this.props.subheadingTwovalue,
                                        "paragraph": this.props.paraTwovalue,
                                        "imageSrc": this.props.imgsrcThreevalue,
                                        "heading": this.props.headingThreevalue
                                    },
                                    "ispLT": {
                                        "tag": "image-subheading-para",
                                        "imageSrc": this.props.imgsrcFourvalue,
                                        "subHeading": this.props.subheadingThreevalue,
                                        "paragraph": this.props.paraThreevalue
                                    },
                                    "ispMT": {
                                        "tag": "image-subheading-para",
                                        "imageSrc": this.props.imgsrcFivevalue,
                                        "subHeading": this.props.subheadingFourvalue,
                                        "paragraph": this.props.paraFourvalue
                                    },
                                    "ispRT": {
                                        "tag": "image-subheading-para",
                                        "imageSrc": this.props.imgsrcSixvalue,
                                        "subHeading": this.props.subheadingFivevalue,
                                        "paragraph": this.props.paraFivevalue
                                    },
                                    "ispLB": {
                                        "tag": "image-subheading-para",
                                        "imageSrc": this.props.imgsrcSevenvalue,
                                        "subHeading": this.props.subheadingSixvalue,
                                        "paragraph": this.props.paraSixvalue
                                    },
                                    "ispMB": {
                                        "tag": "image-subheading-para",
                                        "imageSrc": this.props.imgsrcEightvalue,
                                        "subHeading": this.props.subheadingSevenvalue,
                                        "paragraph": this.props.paraEightvalue
                                    },
                                    "ispRB": {
                                        "tag": "image-subheading-para",
                                        "imageSrc": this.props.imgsrcNinevalue,
                                        "subHeading": this.props.subheadingEightvalue,
                                        "paragraph": this.props.paraEightvalue
                                    }
                                },
                                "metaData": {
                                    "templateName": this.state.name + "-" + dd + "-" + mm + "-" + yyyy,
                                    "templateTag": this.props.tempComponent,
                                    "action": "draft",
                                    "manufacturer": this.state.maunfactName
                                },
                                "association": {
                                    "products": this.state.pids,
                                    "action": this.state.productAction
                                },
                                "comment": this.state.commentVal
                            })
                        })).then(
                            response => {
                                if (response.status == 200) {
                                    this.setState({ loading: false });
                                    this.setState({ successDraftSnack: true });
                                    return;
                                }
                                else {
                                    this.setState({ loading: false, errorDraftSnack: true });
                                    return;
                                }
                            }
                        ).catch((error) => {
                            this.setState({ errorDataSnack: true, loading: false });
                            setTimeout(() => {
                                this.setState({
                                    errorDataSnack: false
                                })
                            }, timeout);
                            console.log('Looks like there was a problem in saving template \n', error);
                        });
                    }
                    else {
                        this.setState({
                            warningPidLenSnack: true
                        });
                        setTimeout(() => {
                            this.setState({
                                warningPidLenSnack: false
                            })
                        }, timeout);
                    }
                }
                else if (valid == false) {
                    this.setState({ warningNameSnack: true });
                    setTimeout(() => {
                        this.setState({
                            warningNameSnack: false
                        })
                    }, timeout);
                }
            })
                .catch((error) => {
                    this.setState({ errorDataSnack: true, loading: false });
                    setTimeout(() => {
                        this.setState({
                            errorDataSnack: false
                        })
                    }, timeout);
                    console.log('Looks like there was a problem in finding unique name \n', error);
                });
        }
        else {
            this.setState({ warningNameSnackTwo: true });
            setTimeout(() => {
                this.setState({
                    warningNameSnackTwo: false
                })
            }, timeout);
        }
    };

    handleSubmit = () => {
        if (this.state.statusPermission == statusRevision) {
            this.handleDialogOpen();
        }
        else {
            this.handleDraft();
        }
    }

    handlePublish = () => {
        var tempHTML = document.getElementById('template').innerHTML;
        var tempFile = new File([tempHTML], this.state.name + ".html", { type: "text/html" });
        var formData = new FormData();
        formData.append('file', tempFile);
        formData.append("data", JSON.stringify({
            "data": {
                "hvT": {
                    "tag": "header-video",
                    "heading": this.props.headingvalue,
                    "videoSrc": this.props.videoStr
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": this.props.headingTwovalue,
                    "imageSrc": this.props.imgsrcTwovalue,
                    "anotherHeading": this.props.anotherHeadingvalue,
                    "subHeading": this.props.subheadingvalue,
                    "paragraph": this.props.paravalue
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": this.props.anotherHeadingTwovalue,
                    "subHeading": this.props.subheadingTwovalue,
                    "paragraph": this.props.paraTwovalue,
                    "imageSrc": this.props.imgsrcThreevalue,
                    "heading": this.props.headingThreevalue
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcFourvalue,
                    "subHeading": this.props.subheadingThreevalue,
                    "paragraph": this.props.paraThreevalue
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcFivevalue,
                    "subHeading": this.props.subheadingFourvalue,
                    "paragraph": this.props.paraFourvalue
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSixvalue,
                    "subHeading": this.props.subheadingFivevalue,
                    "paragraph": this.props.paraFivevalue
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSevenvalue,
                    "subHeading": this.props.subheadingSixvalue,
                    "paragraph": this.props.paraSixvalue
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcEightvalue,
                    "subHeading": this.props.subheadingSevenvalue,
                    "paragraph": this.props.paraEightvalue
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcNinevalue,
                    "subHeading": this.props.subheadingEightvalue,
                    "paragraph": this.props.paraEightvalue
                }
            },
            "metaData": {
                "templateName": this.state.name,
                "templateTag": this.props.tempComponent,
                "action": "reviewToEnd",
                "taskId": this.props.taskId,
                "templateId": this.state.tempId,
                "manufacturer": this.state.maunfactName
            },
            "comment": this.state.commentVal,
            "association": {
                "products": this.state.pids,
                "action": this.state.productAction
            }
        }));

        if (this.handleMaxProductIds(this.state.pids)) {
            this.setState({ loading: true, successPublishSnack: false, errorPublishSnack: false });
            this.timeout(pendingTimeout, fetch(templateAPI + '/publish', {
                method: "POST",
                headers: {
                    [AuthKey]: localStorage.getItem('token')
                },
                body: formData
            })).then(
                response => {
                    if (response.status == 200) {
                        this.setState({ loading: false, successPublishSnack: true });
                        setTimeout(() => {
                            this.setState({
                                successPublishSnack: false
                            });
                            window.location.replace(clientHost);
                        }, timeout);
                        return;
                    }
                    else {
                        this.setState({ loading: false, errorPublishSnack: true });
                        setTimeout(() => {
                            this.setState({
                                errorPublishSnack: false
                            })
                        }, timeout);
                        return;
                    }
                }
            ).catch((error) => {
                this.setState({ errorDataSnack: true, loading: false });
                setTimeout(() => {
                    this.setState({
                        errorDataSnack: false
                    })
                }, timeout);
                console.log('Looks like there was a problem in sending html file \n', error);
            });
        }
        else {
            this.setState({
                warningPidLenSnack: true
            });
            setTimeout(() => {
                this.setState({
                    warningPidLenSnack: false
                })
            }, timeout);
        }
    }

    handleChangeManuName = maunfactName => event => {
        this.setState({ [maunfactName]: event.target.value });
    };

    handleChangeId = pids => e => {
        this.setState({ [pids]: e.target.value });
        if (RegExp(/^((\d+)?)(,\s*((\d+)?))*$/g).test(e.target.value)) {
            this.setState({ togglePid: true });
        }
        else {
            this.setState({
                warningPidSnack: true,
                togglePid: false
            });
            setTimeout(() => {
                this.setState({
                    warningPidSnack: false
                })
            }, timeout)
        }
    }

    handleChangeComment = commentVal => e => {
        this.setState({ [commentVal]: e.target.value });
    }

    handleProductAction = (e) => {
        this.setState({ productAction: e.target.value });
    }

    render() {
        const { classes } = this.props;
        let allfilled = true;
        allfilled = this.state.pids && this.state.productAction && this.state.maunfactName && this.state.togglePid;

        return (
            <form className={this.state.loading ? classes.root : classes.container} noValidate autoComplete="off">
                {this.state.loading && ReactDOM.createPortal(<Loader />, this.el)}
                <TextField
                    id="template-name"
                    label={<span className={classes.labelStyle}>Name</span>}
                    value={this.state.name}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                        classes: {
                            root: classes.inputContainer,
                            input: classes.inputStyle
                        }
                    }}
                    disabled
                />
                <Tooltip title={longText} placement="right">
                    <TextField
                        id="pid-multiline"
                        label={<span className={classes.labelStyle}>Enter Products Ids</span>}
                        value={this.state.pids}
                        onChange={this.handleChangeId('pids')}
                        className={classes.textField}
                        margin="normal"
                        multiline
                        rows="5"
                        variant="outlined"
                        InputProps={{
                            classes: {
                                root: classes.inputContainer,
                                input: classes.inputStyle
                            }
                        }}
                        required
                    />
                </Tooltip>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="paction-simple" className={classes.labelStyle}>Select Action for Product</InputLabel>
                    <Select
                        value={this.state.productAction}
                        onChange={this.handleProductAction}
                        required
                        InputProps={{
                            name: 'paction',
                            id: 'paction-simple',
                            classes: {
                                root: classes.inputContainer,
                                input: classes.inputStyle
                            }
                        }}
                    >
                        <MenuItem value="append">append</MenuItem>
                        <MenuItem value="override">override</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    id="manufacturer-name"
                    label={<span className={classes.labelStyle}>Manufacturer Name</span>}
                    value={this.state.maunfactName}
                    className={classes.textField}
                    onChange={this.handleChangeManuName('maunfactName')}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                        classes: {
                            root: classes.inputContainer,
                            input: classes.inputStyle
                        }
                    }}
                    required
                />
                <TextField
                    id="comments-multiline"
                    label={<span className={classes.labelStyle}>Comments</span>}
                    multiline
                    rows="3"
                    value={this.state.commentVal}
                    onChange={this.handleChangeComment('commentVal')}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                        classes: {
                            root: classes.inputContainer,
                            input: classes.inputStyle
                        }
                    }}
                    variant="outlined"
                />
                <div className={classes.actionStyle}>
                    <Button className={classes.buttonSaveStyle} disabled={!allfilled} onClick={this.handleSubmit} >
                        Draft
                    </Button>
                    {this.state.toggleReview &&
                        <Button className={classes.buttonRevStyle} disabled={!allfilled} onClick={this.handleReview}>
                            Review
                        </Button>
                    }
                    {this.state.togglePending &&
                        <Button className={classes.buttonRevStyle} disabled={!allfilled} onClick={this.handleRevision}>
                            Revision
                        </Button>
                    }
                    {this.state.toggleRevision &&
                        <Button className={classes.buttonPublishStyle} disabled={!allfilled} onClick={this.handlePublish}>
                            Publish
                        </Button>
                    }
                </div>
                <Dialog open={this.state.open} onClose={this.handleDialogClose} className={this.state.loading && classes.dialogStyle} aria-labelledby="form-dialog-title" >
                    <DialogTitle id="form-dialog-title">Name of A+ Content</DialogTitle>
                    <DialogContent>
                        <Tooltip title={longTextName}>
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
                        <Button className={classes.buttonSaveStyle} onClick={this.handleCreate}>
                            Create
                        </Button>
                        <Button className={classes.buttonCloseStyle} onClick={this.handleDialogClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {this.state.errorSnack && ReactDOM.createPortal(<ErrorToast message="Error in Processing" />, this.el)}
                {this.state.errorDataSnack && ReactDOM.createPortal(<ErrorToast message="Error in Processing" />, this.el)}
                {this.state.warningPidSnack && ReactDOM.createPortal(<WarningToast message="Product Ids can contain only integers" />, this.el)}
                {this.state.warningPidLenSnack && ReactDOM.createPortal(<WarningToast message="Product Ids cannot be more than 20" />, this.el)}
                {this.state.errorTempData && ReactDOM.createPortal(<ErrorToast message="Error in processing" />, this.el)}
                {this.state.successReviewSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Sent for Review" />, this.el)}
                {this.state.errorReviewSnack && ReactDOM.createPortal(<ErrorToast message="Error in sending for request" />, this.el)}
                {this.state.successRevisionSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Sent for Revision" />, this.el)}
                {this.state.errorRevisionSnack && ReactDOM.createPortal(<ErrorToast message="Error in sending for revison" />, this.el)}
                {this.state.successDraftSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Saved" />, this.el)}
                {this.state.errorDraftSnack && ReactDOM.createPortal(<ErrorToast message="Error in Saving" />, this.el)}
                {this.state.errorNameSnack && ReactDOM.createPortal(<ErrorToast message="Error in Processing" />, this.el)}
                {this.state.warningNameSnack && ReactDOM.createPortal(<WarningToast message="The Name Exists!" />, this.el)}
                {this.state.warningNameSnackTwo && ReactDOM.createPortal(<WarningToast message="The Name Cannot Contain Capital Letters!" />, this.el)}
                {this.state.successPublishSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Published" />, this.el)}
                {this.state.errorPublishSnack && ReactDOM.createPortal(<ErrorToast message="Error in Publishing" />, this.el)}
            </form>
        );
    }
}

SaveTempNameTwo.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SaveTempNameTwo);