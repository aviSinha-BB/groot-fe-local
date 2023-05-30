import MobileCover from '../../assets/images/mobile-cover.jpg';

export const styles = theme => ({
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
    uploadLabelStyle: {
        fontFamily: 'ProximaNova-Regular',
        paddingLeft: 10
    },
    uploadInputStyle: {
        paddingLeft: 10,
        paddingTop: 10
    },
    inputStyle: {
        fontFamily: 'ProximaNova-Regular',
        width: 491
    },
    inputContainer: {
        border: 1
    },
    formControl: {
        margin: theme.spacing.unit,
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