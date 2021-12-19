import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  panel: {
    // '@media (max-width: 860px)': {
    //   display: 'none'
    // },
    minWidth: 300,
    maxWidth: 300,
    position: "sticky",
    top: props => props.top,
  },

}))
