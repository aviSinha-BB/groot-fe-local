export const styles = (theme) => ({
  root: {
    marginTop: "80px",
    display: "grid",
    gridGap: "10px",
    justifyContent: "center",
    fontSize: "16px"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  labelStyle: {
    fontFamily: "ProximaNova-Regular",
    fontWeight: 600,
  },
  uploadInputContainerStyle: {
    display: "grid",
    gap: "8px",
  },
  uploadLabelStyle: {
    fontFamily: "ProximaNova-Regular",
  },
  uploadInputStyle: {
    padding: "4px"
  },
  inputStyle: {
    fontFamily: "ProximaNova-Regular",
    padding: "4px",
  },
  inputContainer: {
    border: 1,
  },
  fileTypes: {
    padding: "4px"
  },
  buttonCreateStyle: {
    height: "40px",
    border: "1px solid #009c50",
    borderRadius: "3px",
    color: "#009c50",
    textTransform: "none",
    fontFamily: "ProximaNova-SemiBold",
    margin: theme.spacing.unit,
    margin: "0px",
    width: "100%"
  },
  error: {
    color: "red",
    fontSize: "14px",
    wordWrap: "break-word",
    maxWidth: "260px"
  },
  successUploadMessage: {
    color: "green",
    fontSize: "14px",
    wordWrap: "break-word",
    maxWidth: "260px"
  }
});
