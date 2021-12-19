import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {
  let smallRadiusValue = '0.2em'
  //let betweenMessagesBlocks = theme.spacing(1)
  
  return {
    container: {
      padding: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      // textAlign: props => {
      //   //console.log(props)
      //   return props.side === 'left' ? 'left' : 'right'
      // },
      flexDirection: props => props.side === 'left' ? 'row-reverse' : 'row',
    },
    message: {
      position: 'relative',
      maxWidth: 400,
      background: props => props.side === 'left' ? theme.palette.background.paper : theme.palette.secondary.main,
      padding: theme.spacing(1, 1.5),
      borderRadius: '0.7em',
      //color: '#ffffff',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      //border: '1px solid black',
      //zIndex: 1
    },
    text: {
      //wordBreak: "normal"
      //whiteSpace: "unset"
    },
    top_right: {
      borderBottomRightRadius: smallRadiusValue
    },
    top_left: {
      borderBottomLeftRadius: smallRadiusValue
    },
    medium_left: {
      borderTopLeftRadius: smallRadiusValue,
      borderBottomLeftRadius: smallRadiusValue,
    },
    medium_right: {
      borderTopRightRadius: smallRadiusValue,
      borderBottomRightRadius: smallRadiusValue,
    },
    bottom_left: {
      borderTopLeftRadius: smallRadiusValue,
    },
    bottom_right: {
      borderTopRightRadius: smallRadiusValue,
    },
    single_left: {
      //margin: theme.spacing(1, 0)
    },
    single_right: {
      //margin: theme.spacing(1, 0)
    }
  }
});
