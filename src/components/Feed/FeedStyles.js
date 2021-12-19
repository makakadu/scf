import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {

  return {
    feed: {
      display: 'flex',
    },
    posts: {
      flexGrow: 1,
      //maxWidth: 500,
      marginRight: theme.spacing(2),
      '& > div': {
        marginBottom: theme.spacing(2),
      },
    },
    panel: {
      '@media (max-width: 860px)': {
        display: 'none',
      },
    }
  }
});
