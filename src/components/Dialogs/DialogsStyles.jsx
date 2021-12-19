import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {
  let border = `1px solid ${theme.palette.background.default}`
  
  return {
    container: {
      width: '100%',
      height: props => props.dialogueIsOpen ? props.innerHeight - 65 : 'auto',
      //border: '1px solid red',
    },
  }
});
