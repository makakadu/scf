import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 320,
    ...theme.styles.flexColumn,
    flexGrow: 1,
    //minHeight: 300,
    width: '100%',
    height: '100%',
    //left: 10,
    //position: 'absolute',
    top: 60,
    bottom: 10,
    [theme.breakpoints.down("sm")]: {
      left: 0,
      right: 0,
      bottom: 0,
      position: 'fixed',
      height: 'auto',
      width: '100%',
    },
    //border: '10px solid white'
  },
  dialogue: {

  },
  root: {
    width: '100%',
    backgroundColor: 'inherit',
    position: 'relative',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.default,
      border: `1px solid ${theme.palette.background.paper}`
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.background.paper
    },
    
    //border: '1px solid white'
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  dayContainer: {
    //maxWidth: 150,
    //minWidth: 50,
    padding: 0,
    cursor: 'default',
    //left: 'auto',
    //right: 'auto',
    //borderTop: '1px solid red',
    //borderBottom: '1px solid red',
    //background: 'transparent',
    lineHeight: '2em',
    display: 'flex',
    //alignItems: 'center',
    justifyContent: 'center',
    //zIndex: -1,
  },
  day: {
    margin: 5,
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(0, 2)
  },
  header: {
    backgroundColor: theme.palette.background.paper,
    //height: theme.spacing(6),
    flexGrow: 0,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down("sm")]: {
      display: 'none'
    },
  },
  headerAvatar: {
    margin: theme.spacing(1)
  },
  dialogueBody: {
    display: 'flex',
    height: 0,
    flexGrow: 1,
    flexDirection: 'column-reverse',
    background: theme.palette.background.default,
  },
  line: {
    
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  }
}));
