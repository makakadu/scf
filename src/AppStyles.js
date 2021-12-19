import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {

  let leftNavWidthWithText = 160
  let leftNavWidthWithoutText = theme.spacing(6)

  return {
    appContainer: {
      minWidth: 200,
      //border: "1px solid green",
    },
    appBody: {
      //border: "1px solid red",
      marginTop: 64,
      //padding: '0 10px 0 0',
      // [theme.breakpoints.down("xs")]: {
      //   paddingLeft: 10
      // },
      display: 'flex',
      justifyContent: 'center',
    },
    content: {
      //border: "1px solid yellow",
      //minWidth: 320,
      maxWidth: 900,
      paddingRight: 8,
      paddingLeft: 8,
      flexGrow: 1,
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 2,
        paddingRight: 2,
      },
      '@media (max-width: 860px)': {
        maxWidth: 600
      },
    },
    rightNavContainer: {
      // [theme.breakpoints.down("xs")]: {
      //   //display: 'none'
      // },
    }, 
    photoViewer: {
      display: 'flex'
    },
    photoViewerContainer: {
      position: "absolute",
      border: "2px solid #444",
      padding: 16,
    },
    arrowContainer: {
      width: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    arrow: {
      color: '#fff'
    }
  }
});
