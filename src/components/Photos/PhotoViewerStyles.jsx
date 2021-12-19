import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {
  return {
    photoViewer: {
      display: 'flex'
    },
    photoViewerContainer: {
      position: "absolute",
      //border: "2px solid #444",
      //padding: 16,
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
