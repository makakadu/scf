import { alpha, makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {

  return {
    root: {
      display: 'flex',
    },
    panel: {
      '@media (max-width: 860px)': {
        display: 'none',
      },
    },
    search: {
      flexGrow: 1,
      //maxWidth: 500,
      marginRight: theme.spacing(2),
      '@media (max-width: 860px)': {
        marginRight: 0,
      },
      '& > div': {
        marginBottom: theme.spacing(2),
      },
    },
    result: {
      padding: theme.spacing(2),
      display: 'flex'
    },
    // emptyList: {
    //   padding: theme.spacing(2),
    //   flexDirection: 'column',
    //   display: 'flex',
    //   alignItems: 'center'
    // },
    // buttonProgress: {
    //   position: 'absolute',
    //   top: '50%',
    //   left: '50%',
    //   marginTop: -12,
    //   marginLeft: -12,
    // },
    // buttonWrapper: {
    //   position: 'relative',
    // },
    avatar: {
      width: 80,
      height: 80,
      marginRight: 16
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      // [theme.breakpoints.up('sm')]: {
      //   width: theme.spacing(18),
      //   '&:focus': {
      //     width: theme.spacing(22),
      //   },
      // },
    },
    searchInput: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    moreButtonContainer: {
      position: 'relative'
    },
    moreButtonLoading: {
      position: 'absolute', top: 0, right:0, left:0, bottom: 0, display: 'flex', justifyContent: 'center'
    }
  }
});
