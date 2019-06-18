import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Loader from './Loading';
import Button from '@material-ui/core/Button';
import ErrorToast from './ErrorToast';
import WarningToast from './WarningToast';

const modalRoot = document.getElementById('modal-root');

const styles = theme => ({
  root: {
    marginTop: 10
  },
  rootTwo: {
    opacity: '0.5',
    backgroundColor: '#EFEFEF',
    pointerEvents: 'none',
    marginTop: 10
  },
  labelStyle: {
    fontFamily: 'ProximaNova-Regular',
    paddingLeft: 10
  },
  UploadStyle: {
    paddingLeft: 10
  },
  imgStyle: {
    cursor: 'grab',
    paddingLeft: 10
  },
  buttonUploadStyle: {
    height: '40px',
    border: '1px solid #ffa726',
    borderRadius: '3px',
    color: '#ffa726',
    textTransform: 'none',
    fontFamily: 'ProximaNova-SemiBold',
    margin: theme.spacing.unit,
  }
});

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempFile: null,
      imgSrc: false,      //file source value
      loading: false,
      errorSnack: false,
      errorSnackTwo: false,
      warningSnack: false
    };
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
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

  uploadImage = (imgData) => {
    this.setState({ loading: true });
    this.timeout(pendingTimeout, fetch(templateAPI + "/image/upload", {
      method: "POST",
      headers: {
        [AuthKey]: localStorage.getItem('token')
      },
      body: imgData
    })).
      then(res => {
        if (res.status == 200)
          return res.json();
        else {
          throw Error(response.statusText);
        }
      }).
      then(result => {
        this.setState({ loading: false });
        if (result.location) {
          this.setState({
            imgSrc: imageHost + result.location
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
        this.setState({ errorSnack: true, loading: false });
        setTimeout(() => {
          this.setState({
            errorSnack: false
          })
        }, timeout);
        console.log('Looks like there was a problem in uploading image \n', error);
      });
  }

  uploadAction = () => {
    var imgfile = this.state.tempFile;
    var fileName = imgfile.name;
    var fileExtension, fileSize;
    var imgData = new FormData();
    imgData.append('file', imgfile);
    fileSize = (imgfile.size) / (imageSize); //filesize will be less than and equal to 1 MB
    fileExtension = fileName.replace(/^.*\./, '');
    imgData.append("metaData", JSON.stringify({
      "templateName": this.props.aplusname,
      "templateTag": this.props.tempComponent,
      "action": "draft"
    }));

    if ((fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg') && fileSize <= 1) {
      this.uploadImage(imgData);
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

  //read the uploaded file and display
  readURL = (e) => {
    e.preventDefault();

    this.setState({ tempFile: e.target.files[0] });
  }

  //Drag image
  drag = (e) => {
    e.dataTransfer.setData("text", e.target.id);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={this.state.loading ? classes.rootTwo : classes.root}>
        <span className={classes.labelStyle} >Upload Banner:</span><br />
        {this.state.loading && ReactDOM.createPortal(<Loader />, this.el)}
        <input type="file" id="uploadBanner" className={classes.UploadStyle} accept="image/*" onChange={this.readURL} /><br />
        {this.state.imgSrc && <img id="yourImg" className={classes.imgStyle} src={this.state.imgSrc} height="150" width="300" draggable="true" onDragStart={this.drag} />}
        <Button className={classes.buttonUploadStyle} onClick={this.uploadAction}>Upload</Button>

        {this.state.errorSnack && ReactDOM.createPortal(<ErrorToast message="Error in Processing" />, this.el)}
        {this.state.errorSnackTwo && ReactDOM.createPortal(<ErrorToast message="Invalid Image Upload" />, this.el)}
        {this.state.warningSnack && ReactDOM.createPortal(<WarningToast message="Uploaded Image must be jpg,png and less than 1 MB" />, this.el)}
      </div>
    );
  }
}

export default withStyles(styles)(Banner);
