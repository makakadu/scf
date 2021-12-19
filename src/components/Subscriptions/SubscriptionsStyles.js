import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {

  return {
    panel: {
      '@media (max-width: 860px)': {
        display: 'none',
      },
    },
    subscriptions: {
      display: 'flex',
    },
    subscriptionsList: {
      flexGrow: 1,
      //maxWidth: 500,
      marginRight: theme.spacing(2),
      '& > div': {
        marginBottom: theme.spacing(2),
      },
    },
    subscription: {
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
    }
  }
});
