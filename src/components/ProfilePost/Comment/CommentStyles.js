import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  container: {
    //padding: '0 16px'
  },
  comment: {
    display: 'flex',
    padding: props => props.isReply ? 0 : '0px 16px',
    marginTop: 12,
  },
  creatorAvatar: {
    width: 40, //props => props.isReply ? 32 : 48,
    height: 40 //props => props.isReply ? 32 : 48,
  },
  commentBody: {
    //background: theme.palette.grey['600'], //'rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    borderTopLeftRadius: 0,
    padding: '0px 16px',
    position: 'relative'
  },
  creatorNameLink: {
    color: theme.palette.text.primary,
    textDecoration: 'none'
  },
  headerAndContent: {
    padding: '4px 8px',
  },
  header: {

  },
  creatorName: {
    color: theme.palette.text.primary,
  },
  date: {
    color: theme.palette.text.secondary,
  },
  content: {
    wordBreak: "break-word",
    padding: `4px 0`,
    
    borderTopLeftRadius: 0,
    //border: `1px solid ${theme.palette.grey['600']}`,
    overflow: 'hidden',
  },
  replyButton: {
    cursor: 'default'
    //color: theme.palette.text.secondary
  },
  replyButtonActive: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  addReaction: {
    //marginLeft: 'auto'
    //marginRight: 16
  },
  underComment: {
    ...theme.styles.flexRowAlignCenter,
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    //background: theme.palette.common.paper,
    //background: theme.palette.grey[700]
    color: theme.palette.text.secondary,
    fontSize: '0.840rem',
    fontWeight: 500,
    wordBreak: "keep-all",
    height: 24
  },
  underCommentDivider: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  createCommentButton: {
    marginLeft: theme.spacing(1),
    width: 40,
    height: 40,
  },
  reactionsInfo: {
    display: 'flex',
    alignItems: 'center',
    //marginLeft: 'auto'
  },
  mostPopularReactionsItem: {
    display: 'block',
    marginRight: 2,
    height: 16,
    width: 16,
    backgroundSize: '100%'
  },
  repliesContainer: {
    marginLeft: 72,
    marginRight: 16,
    //border: '1px solid black',
    marginBottom: 8
  },
  metadateContainer: {
    border: `1px solid ${theme.palette.common.paper}`,
    background: theme.palette.grey['600'],
    right: 10,
    alignItems: 'center'
  },
  loadMoreRepliesButton: {
    cursor: 'pointer',
    ...theme.styles.flexRowAlignCenter,
    margin: `${theme.spacing(1)}px ${theme.spacing(1.5)}px ${theme.spacing(2)}px 0`,

  },
  toggleRepliesVisibilityButton: {
    marginTop: 8,
    //color: theme.palette.secondary.main
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  newReplyFieldContainer: {
    marginTop: 8
    //marginLeft: theme.spacing(2)
  }

}));