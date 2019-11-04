export const styles = theme => ({
    root: {
      marginTop: 10
    },
    wrapper: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    rootTwo: {
      opacity: '0.5',
      backgroundColor: '#EFEFEF',
      pointerEvents: 'none',
      marginTop: 10
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
    inputStyle: {
      fontFamily: 'ProximaNova-Regular'
    },
    inputContainer: {
        border: 1
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
    IconStyle: {
      fontSize: 20,
      opacity: 0.9,
      marginRight: 15
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