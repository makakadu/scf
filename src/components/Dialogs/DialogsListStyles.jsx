import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {
  let border = `1px solid ${theme.palette.background.default}`
  
  return {
    dialoguesListAndDialogue: {
      width: '100%',
      [theme.breakpoints.down("sm")]: {
        
        justifyContent: 'center',
      },
      //display: 'flex',
      //border: '1px solid red',
    },
    dialoguesListContainer: {

    },
    dialoguesList: {
      width: '100%',
      [theme.breakpoints.up("md")]: {
        //marginRight: theme.spacing(1),
        //display: 'none'
      },
      [theme.breakpoints.down("sm")]: {

      },
      //border: '1px solid red',
    },
    dialogueStub: {
      height: '100%',
      [theme.breakpoints.down("sm")]: {
        display: "none"
      },
      flexGrow: 1,
      //border: '1px solid black'
    },
    dialogueStubContent: {
      ...theme.styles.twoDimensionsCentering,
      height: theme.withPercents(100)
    },
    avatar: {
      width: theme.spacing(6),
      height: theme.spacing(6)
    }
  }
});
