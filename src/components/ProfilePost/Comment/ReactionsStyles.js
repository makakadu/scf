
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({

  currentReactionImage: {
    width: 16,
    height: 16,
    backgroundSize: 'cover',
    //borderRadius: '3em',
    cursor: 'pointer',
    overflow: 'visible'
  },
  currentReactionImageContainer: {
    display: 'flex', alignItems: 'center'
  }

}));