import { alpha, makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
    //border: '1px solid black',
  },
  drawer: {
    '@media (min-width: 860px)': {
      display: 'none'
    },
  },
  searchPopover: {
    padding: '20px',
    width: '1000px',
    height: '80%',
    //border: '1px solid orange',
    [theme.breakpoints.up("md")]: {
      width: 'auto'
    }
  },
  notifications: {
    //maxHeight: '100%'
    //marginBottom: '35%'
  },
  menuItem: {
    //border: '1px solid black',
    height: '70px',
    width: '300px',
    [theme.breakpoints.down("xs")]: {
      width: '1000px'
    }
  },
  root: {
    background: theme.palette.action.selected,
    "&:hover": {
      background: theme.palette.action.disabled
    },
    borderRadius: '5em',
    border: 'none',
    margin: '4px',
    color: 'green',
    '&$selected': {
        color: 'blue'
    }
  },
  toolbar: {
    //minHeight: 30
    // minHeight: 48,
    // maxHeight: 48
  },
  headerIcons: {
    fontSize: '24px'
  },
  selected: {
  },
  headerTabs: {
    //border: '1px solid red',
    flexGrow: 0,
    //height: '60px',
    alignSelf: 'flex-end',
    [theme.breakpoints.down("xs")]: {
      display: 'none'
    }
  },
  headerTab: {
    //border: '1px solid black',
  },
  menuButton: {
    [theme.breakpoints.up("md")]: {
      //display: "none"
    }
  },
  rightMenuButton: {
    '@media (max-width: 860px)': {
      display: 'none'
    },
  },
  showNotificationsButton: {
    marginRight: theme.spacing(1)
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "none"
    },
    border: '1px solid black'
  },
  selectNotLoggedUserLanguage: {
    marginLeft: 'auto'
  }
}));






