import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { styles } from "./ComponentStyle/FileUploadStyle";
import { Button } from "@material-ui/core";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successUploadMessage: "",
      uploadType: "excel",
      s3Path: "",
      excelFile: null,
      error: "",
      options: [],
      clientHost:"",
      fileType:[],
      notSuccess:"",
      isOk:false,
    };
  }
  readExcel = (e) => {
    this.setState({isOk:false});
    this.setState({error:""});
    this.setState({successUploadMessage:""});
    e.preventDefault();
    this.setState({ excelFile: e.target.files[0] });
  };

  componentDidMount() {
    // TODO: change host
    var host = window.location.origin;
    this.setState({ clientHost: host });
    fetch("http://qa-svc.bigbasket.com:8082/content-svc/excel/uploadType",{
      method: "GET",
    }).then(response=>response.json())
      .then ((response)=>{
        this.setState({fileType:response})
      })
    fetch("http://localhost:8081/file-upload/config", {
      method: "GET",
      headers: {
        Accept: 'text/event-stream'
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          this.setState({ error: JSON.stringify(response) });
        } else if (response.status === 500) {
          throw new Error("Internal Server Error");
        } else {
          throw new Error("Unknown Error");
        }
      })
      .then((response) => {
        const configArr = response.config;
        let options = configArr.map((config) => {
          return { value: config.uploadType, label: config.uploadType };
        });
        this.setState({
          options,
        });
      })
      .catch((error) => {
        this.setState({ error: JSON.stringify(error) });
      });
  }

  handleExcelUpload = () => {
    if (this.state.excelFile != null) {
      let xslfile = this.state.excelFile;
      let excelData = new FormData();
      excelData.append("file", xslfile);
      excelData.append(
        "data",
        JSON.stringify({
          uploadType: this.state.uploadType,
          s3Path: this.state.s3Path,
        })
      );

      fetch("http://qa-svc.bigbasket.com:8082/content-svc/excel/file-upload", {
        method: "POST",
        body: excelData,
      })
        .then((response) => {
          if (response.status==200) {
            this.setState({isOk:true});
            // console.log(response);
            
          }
          return response.text();
        }).then((data) => {
          // Handle the server message in the response
          if (this.state.isOk){
            this.setState({successUploadMessage:data})
          }else{
            this.setState({error:data});
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ error: JSON.stringify(error) });
        });
    }
  };

  handleFileTypeChange = (event) => {
    this.setState({
      uploadType: event.target.value,
    });
  };

  handleS3PathChange = (event) => {
    this.setState({
      s3Path: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { s3Path, uploadType, excelFile, options } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.uploadInputContainerStyle}>
          <label className={classes.uploadLabelStyle}>S3 Path:</label>
          <input
            type="text"
            className={classes.uploadInputStyle}
            onChange={this.handleS3PathChange}
            placeholder="Folder/Location where you want to upload"
            value={s3Path}
            required
          />
        </div>
        <div className={classes.uploadInputContainerStyle}>
          <label className={""}>File Type:</label>
          <select
            className={classes.fileTypes}
            value={uploadType}
            onChange={this.handleFileTypeChange}
          >
            {this.state.fileType.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.uploadInputContainerStyle}>
          <label className={""}>Upload Excel File:</label>
          <input
            type="file"
            id="uploadExcel"
            className={classes.uploadInputStyle}
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={this.readExcel}
          />
        </div>
        <div>
          <Button
            className={classes.buttonCreateStyle}
            onClick={this.handleExcelUpload}
            disabled={!(s3Path && uploadType && excelFile)}
          >
            Upload
          </Button>
        </div>
        {this.state.successUploadMessage && (
          <div className={classes.successUploadMessage}>
            {this.state.successUploadMessage}
          </div>
        )}
        {this.state.error != "" && (
          <div className={classes.error}>{this.state.error}</div>
        )}
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(FileUpload));
