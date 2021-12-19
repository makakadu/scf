import { makeStyles } from "@material-ui/core";
export const useStyles = makeStyles((theme) => ({
  commentsSection: {
    //marginBottom: 16,
    position: 'relative',
    paddingBottom: 8
  },
  stickyNewCommentFieldContainer: {
    //position: 'sticky',
    //bottom: 0,
    padding: `0px 16px`,
    marginTop: 8
  },
  commentsSorting: {
    padding: `0 ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(1),
    ...theme.styles.flexRowAlignCenter,
  },
  toggleCommentsButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCommentsButton: {
    //padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    //cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 4,
  },
  toggleCommentsVisibilityButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  sortingMenu: {
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.common.paper,
    border: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(1)}px 0`
  }
}));