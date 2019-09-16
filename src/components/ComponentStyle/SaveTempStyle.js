export const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        opacity: '0.5',
        backgroundColor: '#EFEFEF',
        pointerEvents: 'none'
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
    buttonSaveStyle: {
        height: '40px',
        border: '1px solid #009c50',
        borderRadius: '3px',
        color: '#009c50',
        textTransform: 'none',
        fontFamily: 'ProximaNova-SemiBold',
        margin: theme.spacing.unit,
    },
    buttonRevStyle: {
        height: '40px',
        border: '1px solid #ffa726',
        borderRadius: '3px',
        color: '#ffa726',
        textTransform: 'none',
        fontFamily: 'ProximaNova-SemiBold',
        margin: theme.spacing.unit,
    },
    buttonPublishStyle: {
        height: '40px',
        border: '1px solid #458ef5',
        borderRadius: '3px',
        color: '#458ef5',
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
    snackIconStyle: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    formControl: {
        margin: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            width: '217px'
        },
        [theme.breakpoints.up('md')]: {
            width: '230px'
        },
        [theme.breakpoints.up('lg')]: {
            width: '300px'
        }
    },
    uploadInputStyle: {
        display: 'none'
    },
    dialogStyle: {
        opacity: '0.5',
        backgroundColor: '#EFEFEF',
        pointerEvents: 'none'
    },
    actionStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    labelStyle: {
        fontFamily: 'ProximaNova-Regular',
    },
    inputStyle: {
        fontFamily: 'ProximaNova-Regular'
    },
    inputContainer: {
        border: 1
    }
});