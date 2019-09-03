import { green } from "@material-ui/core/colors";

export const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: '61px'
    },

    paper: {
        maxWidth: '1200px',
        margin: '0 auto'
    },

    gridStyle: {
        overflowX: "scroll",
        overflowY: "hidden"
    },

    switchBase: {
        color: green[300],
        '&$checked': {
          color: green[500],
        },
        '&$checked + $track': {
          backgroundColor: green[500],
        },
        '&$checked + $bar': {
            backgroundColor: green[500],
        },
    },

    checked: {},

    track: {},

    bar: {},

    toolspaper: {
        height: "calc(100vh - 75px)",
        position: 'fixed',
        overflow: 'auto',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '217px'
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '230px'
        },
        [theme.breakpoints.up('lg')]: {
            maxWidth: '300px'
        }
    }
});