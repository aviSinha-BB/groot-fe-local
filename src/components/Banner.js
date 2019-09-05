import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './ComponentStyle/BannerStyle';
import { apitimeout } from './api_timeout';
import Loader from './Loading';
import Button from '@material-ui/core/Button';
import ErrorToast from './ErrorToast';
import WarningToast from './WarningToast';

const modalRoot = document.getElementById('modal-root');

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempFile: null,
      imgSrc: false,
      clientHost: null,
      loading: false,
      errorSnack: false,
      errorSnackTwo: false,
      warningSnack: false,
      warningSnackTwo: false,
      warningSnackThree: false,
      warningMessage: ''
    };
    this.el = document.createElement('div');
  }

  componentDidUpdate(prevProps) {
    if (this.props.bannerType !== prevProps.bannerType)
      this.setState({ imgSrc: false });
  }

  componentDidMount() {
    var url = window.location.href;
    var host = url.split('/content-svc')[0];
    this.setState({ clientHost: host });
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  uploadImage = (imgData, imageType) => {
    this.setState({ loading: true });
    apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + "/image/upload", {
      method: "POST",
      headers: {
        [AuthKey]: localStorage.getItem('token')
      },
      body: imgData
    })).
      then(res => {
        if (res.status == 200)
          return res.json();
        else if (res.status == 406) {
          if (imageType == "bannerLg") {
            this.setState({ warningMessage: 'Image dimensions must be under 1200x300' });
          }
          else if (imageType == "bannerMd") {
            this.setState({ warningMessage: 'Image dimensions must be under 600x300' });
          }
          else if (imageType == "bannerSm") {
            this.setState({ warningMessage: 'Image dimensions must be under 350x350' });
          }
          this.setState({ warningSnackTwo: true, loading: false, imgSrc: false });
          setTimeout(() => {
            this.setState({
              warningSnackTwo: false
            })
          }, timeout);
          throw "Invalid Image Dimensions";
        }
        else {
          throw Error(res.statusText);
        }
      }).
      then(result => {
        this.setState({ loading: false });
        if (result.location) {
          this.setState({
            imgSrc: this.state.clientHost + result.location
          })
        }
        else {
          this.setState({ errorSnackTwo: true });
          setTimeout(() => {
            this.setState({
              errorSnackTwo: false
            })
          }, timeout);
        }
      })
      .catch((error) => {
        if (error != "Invalid Image Dimensions") {
          this.setState({ errorSnack: true, loading: false, imgSrc: false });
          setTimeout(() => {
            this.setState({
              errorSnack: false
            })
          }, timeout);
        }
        console.log('Looks like there was a problem in uploading image \n', error);
      });
  }

  uploadAction = () => {
    var imgfile = this.state.tempFile;
    if (imgfile) {
      var fileName = imgfile.name;
      var fileExtension, fileSize;
      var imgData = new FormData();
      var imageType = this.props.bannerType;
      imgData.append('file', imgfile);
      fileSize = (imgfile.size) / (imageSize); //filesize will be less than and equal to 1 MB
      fileExtension = fileName.replace(/^.*\./, '');
      imgData.append("metaData", JSON.stringify({
        "templateName": this.props.aplusname,
        "templateTag": this.props.tempComponent,
        "action": "draft"
      }));

      if ((fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg') && fileSize <= 1) {
        if (imageType == "bannerLg") {
          imgData.append("imageMetaData", JSON.stringify({
            "width": 1200,
            "height": 300
          }));
        }
        else if (imageType == "bannerMd") {
          imgData.append("imageMetaData", JSON.stringify({
            "width": 600,
            "height": 300
          }));
        }
        else if (imageType == "bannerSm") {
          imgData.append("imageMetaData", JSON.stringify({
            "width": 350,
            "height": 350
          }));
        }
        this.uploadImage(imgData, imageType);
      }
      else {
        this.setState({ warningSnack: true });
        setTimeout(() => {
          this.setState({
            warningSnack: false
          })
        }, timeout);
      }
    }
    else {
      this.setState({ warningSnackThree: true });
      setTimeout(() => {
        this.setState({
          warningSnackThree: false
        })
      }, timeout);
    }
  }

  readURL = (e) => {
    e.preventDefault();

    this.setState({ tempFile: e.target.files[0] });
  }

  //Drag image
  drag = (e) => {
    if (this.props.bannerType == "bannerLg") {
      e.dataTransfer.setData("blg", e.target.id);
    }
    else if (this.props.bannerType == "bannerMd") {
      e.dataTransfer.setData("bmd", e.target.id);
    }
    else if (this.props.bannerType == "bannerSm") {
      e.dataTransfer.setData("bsm", e.target.id);
    }
  }

  render() {
    const { classes } = this.props;
    let imgDmMsg = this.state.warningMessage;
    return (
      <div className={this.state.loading ? classes.rootTwo : classes.root}>
        <span className={classes.labelStyle} >Upload Banner:</span><br />
        {this.state.loading && ReactDOM.createPortal(<Loader />, this.el)}
        <input type="file" id="uploadBanner" className={classes.UploadStyle} accept="image/*" onChange={this.readURL} /><br />
        {this.state.imgSrc && <img id="yourImg" className={classes.imgStyle} src={this.state.imgSrc} height="150" width="265" draggable="true" onDragStart={this.drag} />}
        <br />
        <Button className={classes.buttonUploadStyle} onClick={this.uploadAction}>Upload</Button>

        {this.state.errorSnack && ReactDOM.createPortal(<ErrorToast message="Error in Processing" />, this.el)}
        {this.state.errorSnackTwo && ReactDOM.createPortal(<ErrorToast message="Invalid Image Upload" />, this.el)}
        {this.state.warningSnack && ReactDOM.createPortal(<WarningToast message="Uploaded Image must be jpg,png and less than 1 MB" />, this.el)}
        {this.state.warningSnackTwo && ReactDOM.createPortal(<WarningToast message={imgDmMsg} />, this.el)}
        {this.state.warningSnackThree && ReactDOM.createPortal(<WarningToast message="Please select a image" />, this.el)}
      </div>
    );
  }
}

export default withStyles(styles)(Banner);