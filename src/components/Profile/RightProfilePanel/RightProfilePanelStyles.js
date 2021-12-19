import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  panel: {
    display: 'grid',
    gridGap: theme.spacing(2),
    minWidth: 300,
    maxWidth: 300,
  },

  mainInfoList: {
    //paddingTop: '0',
    //paddingBottom: '0'
  },
  paper: {
    //border: "1px solid black"
  },
  avatarAndName: {
    ...theme.styles.flexColumnCenter
  },
  avatar: {
    margin: `${theme.spacing(1)}px 0`
  },
  name: {
    margin: `${theme.spacing(1)}px 0`
  },
  profileAvatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    //marginBottom: theme.spacing(2)
  },
  groupsList: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    justifyContent: "space-around"
  },
  groupsListItem: {
    //border: "1px solid black"
  },
  collapsedList: {
    paddingTop: '0',
  },
  showAdditionalInfo: {
    height: theme.spacing(6),
    textAlign: 'center',
    color: theme.palette.text.secondary,

  },
  collapse: {
    //paddingBottom: theme.spacing(2)
  }
}))
