import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      width: '187px'
    },
    [theme.breakpoints.up('md')]: {
      width: '200px'
    },
    [theme.breakpoints.up('lg')]: {
      width: '270px'
    }
  }
});

const longText = `
Please make the height of video to 300
`;

class VideoUpload extends Component {
  constructor(props) {
    super(props);
  }

  //sending the VideoUpload value to App
  setvideostr = (e) => {
    const vidstr = e.target.value;
    this.props.updateVideo(vidstr);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title={longText} placement="right">
          <TextField
            id="vidstr-multiline"
            label="Enter Embeded Video"
            multiline
            rows="3"
            value={this.props.videoStr}
            onChange={this.setvideostr}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            required
          />
        </Tooltip>
      </React.Fragment>
    );
  }
}

//setting the prop types
VideoUpload.propTypes = {
  headingvalue: PropTypes.string
};

export default withStyles(styles)(VideoUpload);
