export const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: '61px'
    },

    paper: {
        width: '1286px',
    },

    gridStyle: {
        overflowX: "scroll",
        overflowY: "hidden"
    },

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