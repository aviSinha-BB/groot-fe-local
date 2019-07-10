export const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: '68px'
    },
    roottwo: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: '56px',
        opacity: '0.5',
        pointerEvents: 'none'
    },
    dialogStyle: {
        opacity: '0.5',
        backgroundColor: '#EFEFEF',
        pointerEvents: 'none'
    },
    gridList: {
        paddingTop: '15px',
        width: '100%'
    },
    imgStyle: {
        width: '210px',
        height: '150px',
        cursor: 'pointer',
        marginTop: '108px'
    },
    subheader: {
        fontSize: 18,
        fontFamily: "ProximaNova-SemiBold",
        textTransform: "none",
        textDecoration: "none",
        color: 'black'
    },
    cardStyle: {
        boxShadow: '0 0 100px 0 #eeeeee',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'inherit',
        flexGrow: 1,
        minHeight: 480,
        marginBottom: '40px'
    },
    tileImgStyle: {
        paddingLeft: '20px'
    },
    labelStyle: {
        fontFamily: 'ProximaNova-Regular',
    },
    inputStyle: {
        fontFamily: 'ProximaNova-Regular',
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
    }
});