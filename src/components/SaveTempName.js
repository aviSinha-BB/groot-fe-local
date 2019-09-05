import React, { Component } from "react";
import ReactDOM from 'react-dom';
import SyncSelect from 'react-select';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './ComponentStyle/SaveTempStyle';
import { apitimeout } from './api_timeout';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Loader from './Loading';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';
import WarningToast from './WarningToast';

const modalRoot = document.getElementById('modal-root');

const selectStyle = {
    container: () => ({
        padding: 10,
        width: 287
    })
};

class SaveTempName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.aplusname,
            maunfactName: '',
            pids: null,
            xlsFile: null,
            xlsFileName: null,
            commentVal: '',
            productAction: 'override',
            tempId: '',
            clientHost: null,
            statusPermission: '',
            loading: false,
            toggleReview: true,
            togglePending: true,
            toggleRevision: true,
            toggleDraft: true,
            toggleSave: true,
            toggleXlsUpload: false,
            toggleXlsValidation: false,
            errorSnack: false,
            warningPidLenSnack: false,
            errorTempData: false,
            successReviewSnack: false,
            errorReviewSnack: false,
            successRevisionSnack: false,
            errorRevisionSnack: false,
            successDraftSnack: false,
            errorDraftSnack: false,
            successSaveSnack: false,
            errorSaveSnack: false,
            successPublishSnack: false,
            errorPublishSnack: false,
            errorDownload: false
        };
        this.el = document.createElement('div');
    }

    componentDidMount = () => {
        var url = window.location.href;
        var host = url.split('/content-svc')[0];
        this.setState({ clientHost: host });
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
            apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + '/' + getTid + '/' + getSid, {
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
                    console.log('Problem in fetching template data in SaveTempOne \n');
                });

            if (get_sname == statusReview) {
                this.setState({ toggleRevision: false, togglePending: false, toggleDraft: false, toggleXlsUpload: true, toggleXlsValidation: false });
            }
            else if (get_sname == statusDraft) {
                this.setState({ toggleRevision: false, togglePending: false, toggleSave: false, toggleXlsUpload: true, toggleXlsValidation: false });
            }
            else if (get_sname == statusRevision || get_sname == statusSentForPublish) {
                this.setState({ toggleReview: false, toggleDraft: false, toggleXlsUpload: false, toggleXlsValidation: false });
            }
            else if (get_sname == statusPending) {
                this.setState({ toggleReview: false, togglePending: false, toggleDraft: false, toggleSave: false, toggleXlsUpload: false, toggleXlsValidation: false });
            }
        }
        else {
            if (localStorage.getItem('userManufacturer') !== null) {
                this.setState({ maunfactName: localStorage.getItem('userManufacturer') });
            }
            this.setState({ toggleRevision: false, togglePending: false, toggleSave: false, toggleXlsUpload: true, toggleXlsValidation: true });
        }
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    handleMaxProductIds = (prodIdStr) => {
        var prodIdLength = prodIdStr.length;

        if (prodIdLength >= 1)
            return true;
        else
            return false;
    }

    handleDeleteButtons = () => {
        var parent = document.getElementById("template").querySelectorAll("#delete-button");
        var i;
        for (i = 0; i < parent.length; i++) {
            while (parent[i].firstChild) {
                parent[i].removeChild(parent[i].firstChild);
            }
        }
    }

    handleDelete = (section) => {
        var parent = document.getElementById(section);
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    handleDeleteSection = () => {
        if (!this.props.toggleSectionZero) {
            this.handleDelete("section-zero")
        }
        if (!this.props.toggleSectionOne) {
            this.handleDelete("section-one")
        }
        if (!this.props.toggleSectionTwo) {
            this.handleDelete("section-two")
        }
        if (!this.props.toggleSectionThree) {
            this.handleDelete("section-three")
        }
        if (!this.props.toggleSectionSix) {
            this.handleDelete("section-four")
        }
    }

    handleReview = () => {
        this.handleDeleteSection();
        this.handleDeleteButtons();
        var tempHTML = document.getElementById('template').innerHTML;
        var tempFile = new File([tempHTML], this.state.name + ".html", { type: "text/html" });
        var formData = new FormData();
        formData.append('file', tempFile);
        formData.append('xlsx', this.state.xlsFile);
        formData.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": this.props.headingvalue,
                    "imageSrc": this.props.imgsrcvalue,
                    "visible": this.props.toggleSectionZero

                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": this.props.headingTwovalue,
                    "imageSrc": this.props.imgsrcTwovalue,
                    "anotherHeading": this.props.anotherHeadingvalue,
                    "subHeading": this.props.subheadingvalue,
                    "paragraph": this.props.paravalue,
                    "visible": this.props.toggleSectionOne
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": this.props.anotherHeadingTwovalue,
                    "subHeading": this.props.subheadingTwovalue,
                    "paragraph": this.props.paraTwovalue,
                    "imageSrc": this.props.imgsrcThreevalue,
                    "visible": this.props.toggleSectionTwo
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": this.props.headingThreevalue,
                    "imageSrc": this.props.imgsrcFourvalue,
                    "subHeading": this.props.subheadingThreevalue,
                    "paragraph": this.props.paraThreevalue,
                    "visible": this.props.toggleSectionThree
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcFivevalue,
                    "subHeading": this.props.subheadingFourvalue,
                    "paragraph": this.props.paraFourvalue,
                    "visible": this.props.toggleSectionFour
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSixvalue,
                    "subHeading": this.props.subheadingFivevalue,
                    "paragraph": this.props.paraFivevalue,
                    "visible": this.props.toggleSectionFive
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSevenvalue,
                    "subHeading": this.props.subheadingSixvalue,
                    "paragraph": this.props.paraSixvalue,
                    "visible": this.props.toggleSectionSix
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcEightvalue,
                    "subHeading": this.props.subheadingSevenvalue,
                    "paragraph": this.props.paraSevenvalue,
                    "visible": this.props.toggleSectionSeven
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcNinevalue,
                    "subHeading": this.props.subheadingEightvalue,
                    "paragraph": this.props.paraEightvalue,
                    "visible": this.props.toggleSectionEight
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
        }));

        this.setState({ loading: true, successReviewSnack: false, errorReviewSnack: false });
        apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + "/change/state/create", {
            method: "POST",
            headers: {
                [AuthKey]: localStorage.getItem('token')
            },
            body: formData
        })).then(
            response => {
                if (response.status == 200) {
                    this.setState({ loading: false, successReviewSnack: true });
                    setTimeout(() => {
                        this.setState({
                            successReviewSnack: false
                        });
                        window.location.replace(this.state.clientHost+grootHost+'/');
                    }, timeout);
                    return;
                }
                else {
                    throw Error(response.status);
                }
            }
        ).catch((error) => {
            this.setState({ loading: false, errorReviewSnack: true });
            setTimeout(() => {
                this.setState({
                    errorReviewSnack: false
                })
            }, timeout);
            console.log('Looks like there was a problem in sending for review \n');
        });
    }

    handleRevision = () => {
        this.handleDeleteSection();
        this.handleDeleteButtons();
        var tempHTML = document.getElementById('template').innerHTML;
        var tempFile = new File([tempHTML], this.state.name + ".html", { type: "text/html" });
        var formData = new FormData();
        formData.append('file', tempFile);
        formData.append('xlsx', null);
        formData.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": this.props.headingvalue,
                    "imageSrc": this.props.imgsrcvalue,
                    "visible": this.props.toggleSectionZero
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": this.props.headingTwovalue,
                    "imageSrc": this.props.imgsrcTwovalue,
                    "anotherHeading": this.props.anotherHeadingvalue,
                    "subHeading": this.props.subheadingvalue,
                    "paragraph": this.props.paravalue,
                    "visible": this.props.toggleSectionOne
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": this.props.anotherHeadingTwovalue,
                    "subHeading": this.props.subheadingTwovalue,
                    "paragraph": this.props.paraTwovalue,
                    "imageSrc": this.props.imgsrcThreevalue,
                    "visible": this.props.toggleSectionTwo
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": this.props.headingThreevalue,
                    "imageSrc": this.props.imgsrcFourvalue,
                    "subHeading": this.props.subheadingThreevalue,
                    "paragraph": this.props.paraThreevalue,
                    "visible": this.props.toggleSectionThree
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcFivevalue,
                    "subHeading": this.props.subheadingFourvalue,
                    "paragraph": this.props.paraFourvalue,
                    "visible": this.props.toggleSectionFour
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSixvalue,
                    "subHeading": this.props.subheadingFivevalue,
                    "paragraph": this.props.paraFivevalue,
                    "visible": this.props.toggleSectionFive
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSevenvalue,
                    "subHeading": this.props.subheadingSixvalue,
                    "paragraph": this.props.paraSixvalue,
                    "visible": this.props.toggleSectionSix
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcEightvalue,
                    "subHeading": this.props.subheadingSevenvalue,
                    "paragraph": this.props.paraSevenvalue,
                    "visible": this.props.toggleSectionSeven
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcNinevalue,
                    "subHeading": this.props.subheadingEightvalue,
                    "paragraph": this.props.paraEightvalue,
                    "visible": this.props.toggleSectionEight
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
        }));
        if (this.handleMaxProductIds(this.state.pids)) {
            this.setState({ loading: true, successRevisionSnack: false, errorRevisionSnack: false });
            apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + "/change/state/review", {
                method: "POST",
                headers: {
                    [AuthKey]: localStorage.getItem('token')
                },
                body: formData
            })).then(
                response => {
                    if (response.status == 200) {
                        this.setState({ loading: false, successRevisionSnack: true });
                        setTimeout(() => {
                            this.setState({
                                successRevisionSnack: false
                            });
                            window.location.replace(this.state.clientHost+grootHost+'/');
                        }, timeout);
                        return;
                    }
                    else {
                        throw Error(response.status);
                    }
                }
            ).catch((error) => {
                this.setState({ loading: false, errorRevisionSnack: true });
                setTimeout(() => {
                    this.setState({
                        errorRevisionSnack: false
                    })
                }, timeout);
                console.log('Looks like there was a problem in sending for revision \n');
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
        this.handleDeleteSection();
        this.handleDeleteButtons();
        var tempHTML = document.getElementById('template').innerHTML;
        var tempFile = new File([tempHTML], this.state.name + ".html", { type: "text/html" });
        var formData = new FormData();
        formData.append('file', tempFile);
        formData.append('xlsx', this.state.xlsFile);
        formData.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": this.props.headingvalue,
                    "imageSrc": this.props.imgsrcvalue,
                    "visible": this.props.toggleSectionZero
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": this.props.headingTwovalue,
                    "imageSrc": this.props.imgsrcTwovalue,
                    "anotherHeading": this.props.anotherHeadingvalue,
                    "subHeading": this.props.subheadingvalue,
                    "paragraph": this.props.paravalue,
                    "visible": this.props.toggleSectionOne
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": this.props.anotherHeadingTwovalue,
                    "subHeading": this.props.subheadingTwovalue,
                    "paragraph": this.props.paraTwovalue,
                    "imageSrc": this.props.imgsrcThreevalue,
                    "visible": this.props.toggleSectionTwo
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": this.props.headingThreevalue,
                    "imageSrc": this.props.imgsrcFourvalue,
                    "subHeading": this.props.subheadingThreevalue,
                    "paragraph": this.props.paraThreevalue,
                    "visible": this.props.toggleSectionThree
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcFivevalue,
                    "subHeading": this.props.subheadingFourvalue,
                    "paragraph": this.props.paraFourvalue,
                    "visible": this.props.toggleSectionFour
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSixvalue,
                    "subHeading": this.props.subheadingFivevalue,
                    "paragraph": this.props.paraFivevalue,
                    "visible": this.props.toggleSectionFive
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSevenvalue,
                    "subHeading": this.props.subheadingSixvalue,
                    "paragraph": this.props.paraSixvalue,
                    "visible": this.props.toggleSectionSix
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcEightvalue,
                    "subHeading": this.props.subheadingSevenvalue,
                    "paragraph": this.props.paraSevenvalue,
                    "visible": this.props.toggleSectionSeven
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcNinevalue,
                    "subHeading": this.props.subheadingEightvalue,
                    "paragraph": this.props.paraEightvalue,
                    "visible": this.props.toggleSectionEight
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
        }));
        this.setState({ loading: true, successDraftSnack: false, errorDraftSnack: false });
        apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + "/draft/", {
            method: "PUT",
            headers: {
                [AuthKey]: localStorage.getItem('token')
            },
            body: formData
        })).then(
            response => {
                if (response.status == 200) {
                    this.setState({ loading: false, successDraftSnack: true });
                    setTimeout(() => {
                        this.setState({
                            successDraftSnack: false
                        });
                        window.location.replace(this.state.clientHost+grootHost+'/');
                    }, timeout);
                    return;
                }
                else {
                    throw Error(response.status);
                }
            }
        ).catch((error) => {
            this.setState({ loading: false, errorDraftSnack: true });
            setTimeout(() => {
                this.setState({
                    errorDraftSnack: false
                })
            }, timeout);
            console.log('Looks like there was a problem in saving template \n');
        });

    }

    handleSave = () => {
        
        this.handleDeleteSection();
        this.handleDeleteButtons();
        var tempHTML = document.getElementById('template').innerHTML;
        var tempFile = new File([tempHTML], this.state.name + ".html", { type: "text/html" });
        var formData = new FormData();
        formData.append('file', tempFile);
        formData.append('xlsx', this.state.xlsFile);
        formData.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": this.props.headingvalue,
                    "imageSrc": this.props.imgsrcvalue,
                    "visible": this.props.toggleSectionZero
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": this.props.headingTwovalue,
                    "imageSrc": this.props.imgsrcTwovalue,
                    "anotherHeading": this.props.anotherHeadingvalue,
                    "subHeading": this.props.subheadingvalue,
                    "paragraph": this.props.paravalue,
                    "visible": this.props.toggleSectionOne
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": this.props.anotherHeadingTwovalue,
                    "subHeading": this.props.subheadingTwovalue,
                    "paragraph": this.props.paraTwovalue,
                    "imageSrc": this.props.imgsrcThreevalue,
                    "visible": this.props.toggleSectionTwo
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": this.props.headingThreevalue,
                    "imageSrc": this.props.imgsrcFourvalue,
                    "subHeading": this.props.subheadingThreevalue,
                    "paragraph": this.props.paraThreevalue,
                    "visible": this.props.toggleSectionThree
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcFivevalue,
                    "subHeading": this.props.subheadingFourvalue,
                    "paragraph": this.props.paraFourvalue,
                    "visible": this.props.toggleSectionFour
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSixvalue,
                    "subHeading": this.props.subheadingFivevalue,
                    "paragraph": this.props.paraFivevalue,
                    "visible": this.props.toggleSectionFive
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSevenvalue,
                    "subHeading": this.props.subheadingSixvalue,
                    "paragraph": this.props.paraSixvalue,
                    "visible": this.props.toggleSectionSix
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcEightvalue,
                    "subHeading": this.props.subheadingSevenvalue,
                    "paragraph": this.props.paraSevenvalue,
                    "visible": this.props.toggleSectionSeven
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcNinevalue,
                    "subHeading": this.props.subheadingEightvalue,
                    "paragraph": this.props.paraEightvalue,
                    "visible": this.props.toggleSectionEight
                }
            },
            "metaData": {
                "templateName": this.state.name,
                "templateTag": this.props.tempComponent,
                "action": "save",
                "taskId": this.props.taskId,
                "templateId": this.state.tempId,
                "manufacturer": this.state.maunfactName
            },
            "association": {
                "products": this.state.pids,
                "action": this.state.productAction
            },
            "comment": this.state.commentVal
        }));

        this.setState({ loading: true, successSaveSnack: false, errorSaveSnack: false });
        apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + "/save/", {
            method: "POST",
            headers: {
                [AuthKey]: localStorage.getItem('token')
            },
            body: formData
        })).then(
            response => {
                if (response.status == 200) {
                    this.setState({ loading: false });
                    this.setState({ successSaveSnack: true });
                    setTimeout(() => {
                        this.setState({
                            successSaveSnack: false
                        });
                        window.location.replace(this.state.clientHost+grootHost+'/');
                    }, timeout);
                    return;
                }
                else {
                    throw Error(response.status);
                }
            }
        ).catch((error) => {
            this.setState({ loading: false, errorSaveSnack: true });
            setTimeout(() => {
                this.setState({
                    errorSaveSnack: false
                })
            }, timeout);
            console.log('Looks like there was a problem in saving template \n');
        });
    }

    handlePublish = () => {
        this.handleDeleteSection();
        this.handleDeleteButtons();
        var tempHTML = document.getElementById('template').innerHTML;
        var tempFile = new File([tempHTML], this.state.name + ".html", { type: "text/html" });
        var formData = new FormData();
        formData.append('file', tempFile);
        formData.append('xlsx', null);
        formData.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": this.props.headingvalue,
                    "imageSrc": this.props.imgsrcvalue,
                    "visible": this.props.toggleSectionZero
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": this.props.headingTwovalue,
                    "imageSrc": this.props.imgsrcTwovalue,
                    "anotherHeading": this.props.anotherHeadingvalue,
                    "subHeading": this.props.subheadingvalue,
                    "paragraph": this.props.paravalue,
                    "visible": this.props.toggleSectionOne
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": this.props.anotherHeadingTwovalue,
                    "subHeading": this.props.subheadingTwovalue,
                    "paragraph": this.props.paraTwovalue,
                    "imageSrc": this.props.imgsrcThreevalue,
                    "visible": this.props.toggleSectionTwo
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": this.props.headingThreevalue,
                    "imageSrc": this.props.imgsrcFourvalue,
                    "subHeading": this.props.subheadingThreevalue,
                    "paragraph": this.props.paraThreevalue,
                    "visible": this.props.toggleSectionThree
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcFivevalue,
                    "subHeading": this.props.subheadingFourvalue,
                    "paragraph": this.props.paraFourvalue,
                    "visible": this.props.toggleSectionFour
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSixvalue,
                    "subHeading": this.props.subheadingFivevalue,
                    "paragraph": this.props.paraFivevalue,
                    "visible": this.props.toggleSectionFive
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcSevenvalue,
                    "subHeading": this.props.subheadingSixvalue,
                    "paragraph": this.props.paraSixvalue,
                    "visible": this.props.toggleSectionSix
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcEightvalue,
                    "subHeading": this.props.subheadingSevenvalue,
                    "paragraph": this.props.paraSevenvalue,
                    "visible": this.props.toggleSectionSeven
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": this.props.imgsrcNinevalue,
                    "subHeading": this.props.subheadingEightvalue,
                    "paragraph": this.props.paraEightvalue,
                    "visible": this.props.toggleSectionEight
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
            apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + '/publish', {
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
                            window.location.replace(this.state.clientHost+grootHost+'/all');
                        }, timeout);
                        return;
                    }
                    else if (response.status == 206) {
                        throw "Partial Success";
                    }
                    else {
                        throw Error(response.status);
                    }
                }
            ).catch((error) => {
                if (error != "Partial Success") {
                    this.setState({ loading: false, errorPublishSnack: true });
                    setTimeout(() => {
                        this.setState({
                            errorPublishSnack: false
                        })
                    }, timeout);

                }
                else {
                    this.setState({ loading: false, errorPublishSnack: true });
                    setTimeout(() => {
                        this.setState({
                            errorPublishSnack: false
                        });
                        window.location.replace(this.state.clientHost+grootHost+'/all');
                    }, timeout);

                }
                console.log('Looks like there was a problem in sending html file \n');
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

    handleChangeId = (val) => {
        if (val) {
            this.setState({ pids: val });
        }
        else {
            this.setState({ pids: '' });
        }
    }

    readXLS = (e) => {
        e.preventDefault();

        this.setState({ xlsFile: e.target.files[0] });
        this.setState({ xlsFileName: e.target.files[0].name });
    }

    handleUploadedXLSDownload = (tempid) => {
        this.setState({ loading: true, errorDownload: false });
        apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + "/download/" + tempid, {
            method: "GET",
            headers: {
                [AuthKey]: localStorage.getItem('token')
            }
        })).
            then(res => {
                if (res.status == 200) {
                    return res.blob();
                }
                else {
                    throw Error(res.statusText);
                }
            })
            .then(result => {
                const url = window.URL.createObjectURL(new Blob([result]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `uploaded_sku.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                this.setState({ loading: false });
            })
            .catch((error) => {
                this.setState({ loading: false });
                this.setState({ errorDownload: true });
                setTimeout(() => {
                    this.setState({
                        errorDownload: false
                    })
                }, timeout);
                console.log('Looks like there was a problem in downloading excel file \n');
            });
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
        allfilled = this.state.toggleXlsValidation ? this.state.xlsFile && this.state.productAction && this.state.maunfactName : this.state.productAction && this.state.maunfactName;
        let toggleManufacturer = false;
        if (localStorage.getItem('userManufacturer') === null) {
            toggleManufacturer = false;
        }
        else {
            toggleManufacturer = true;
        }

        return (
            <form className={this.state.loading ? classes.root : classes.container} noValidate autoComplete="off">
                {this.state.loading && ReactDOM.createPortal(<Loader />, this.el)}
                <TextField
                    id="manufacturer-name"
                    label={<span className={classes.labelStyle}>Manufacturer Name</span>}
                    value={this.state.maunfactName}
                    className={classes.textField}
                    disabled={toggleManufacturer}
                    onChange={this.handleChangeManuName('maunfactName')}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                        classes: {
                            root: classes.inputContainer,
                            input: classes.inputStyle
                        }
                    }}
                    inputProps={{
                        maxLength: 50
                    }}
                    required
                />
                {this.state.toggleXlsUpload ?
                    <div>
                        <span style={{ paddingLeft: 10 }} className={classes.labelStyle}>Choose SKU XSL</span><br />
                        <input
                            type="file"
                            id="uploadXLS"
                            className={classes.uploadInputStyle}
                            accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={this.readXLS}
                        />
                        <label htmlFor="uploadXLS">
                            <Button component="span" className={classes.buttonRevStyle}>
                                Choose XLSX
                        </Button>
                        </label>
                        <span style={{ paddingLeft: 10 }} className={classes.labelStyle}>{this.state.xlsFileName}</span>
                    </div>
                    :
                    <div>
                        <span style={{ paddingLeft: 10 }} className={classes.labelStyle}>Products<br />
                            <SyncSelect
                                className="productid-multi"
                                value={this.state.pids}
                                onChange={this.handleChangeId}
                                isClearable={true}
                                menuIsOpen={false}
                                isSearchable={false}
                                isMulti
                                styles={selectStyle}
                                name="product-ids"
                            />
                        </span>
                    </div>
                }
                {!this.state.toggleXlsValidation &&
                    <span style={{ paddingLeft: 10 }} className={classes.labelStyle}>
                        <a href={'#'} onClick={() => this.handleUploadedXLSDownload(this.state.tempId)}>
                            Download
                        </a>
                    </span>
                }
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
                    inputProps={{
                        maxLength: 500
                    }}
                    variant="outlined"
                />
                <div className={classes.actionStyle}>
                    {this.state.toggleDraft &&
                        <Button className={classes.buttonSaveStyle} disabled={!allfilled} onClick={this.handleDraft} >
                            Draft
                    </Button>}
                    {this.state.toggleSave &&
                        <Button className={classes.buttonSaveStyle} disabled={!allfilled} onClick={this.handleSave} >
                            Save
                    </Button>}
                    {this.state.toggleReview &&
                        <Button className={classes.buttonRevStyle} disabled={!allfilled} onClick={this.handleReview}>
                            Send for Review
                        </Button>
                    }
                    {this.state.togglePending &&
                        <Button className={classes.buttonRevStyle} disabled={!allfilled} onClick={this.handleRevision}>
                            Send for Revision
                        </Button>
                    }
                    {this.state.toggleRevision &&
                        <Button className={classes.buttonPublishStyle} disabled={!allfilled} onClick={this.handlePublish}>
                            Publish
                        </Button>
                    }
                </div>
                {this.state.errorSnack && ReactDOM.createPortal(<ErrorToast message="Error in Processing" />, this.el)}
                {this.state.warningPidLenSnack && ReactDOM.createPortal(<WarningToast message="Product Ids cannot be empty" />, this.el)}
                {this.state.errorTempData && ReactDOM.createPortal(<ErrorToast message="Error in processing" />, this.el)}
                {this.state.successReviewSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Send for Review" />, this.el)}
                {this.state.errorReviewSnack && ReactDOM.createPortal(<ErrorToast message="Error in sending for request" />, this.el)}
                {this.state.successRevisionSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Send for Revision" />, this.el)}
                {this.state.errorRevisionSnack && ReactDOM.createPortal(<ErrorToast message="Error in sending for revison" />, this.el)}
                {this.state.successDraftSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Drafted" />, this.el)}
                {this.state.errorDraftSnack && ReactDOM.createPortal(<ErrorToast message="Error in Draft" />, this.el)}
                {this.state.successSaveSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Saved" />, this.el)}
                {this.state.errorSaveSnack && ReactDOM.createPortal(<ErrorToast message="Error in Saving" />, this.el)}
                {this.state.successPublishSnack && ReactDOM.createPortal(<SuccessToast message="Aplus Template is Published" />, this.el)}
                {this.state.errorPublishSnack && ReactDOM.createPortal(<ErrorToast message="Error in Publishing" />, this.el)}
                {this.state.errorDownload && <ErrorToast message="Error while downloading" />}
            </form>
        );
    }
}

SaveTempName.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SaveTempName);