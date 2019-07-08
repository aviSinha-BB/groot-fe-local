import React from "react";
import { withStyles } from "@material-ui/core";
import loaderImg from "../assets/images/loader.svg";

const styles = theme => ({
  loaderSrc: {
    position: "fixed",
    top: "50%",
    left: "45%",
    zIndex: 9999
  }
});

class loadingComponent extends React.PureComponent {
  
  render() {
    const { classes } = this.props;
    return(
      <div className={classes.loaderSrc}>
        <img src={loaderImg} alt="loader" />
      </div>
    )}
}
export default withStyles(styles)(loadingComponent);