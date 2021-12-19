import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export const useStyles = makeStyles(theme => ({
  profile: {
    width: '100%',
    position: "relative"
  },
  noPosts: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  coverContainer: {
    display: 'flex'
  },
  profileHeader: {
    flexGrow: 1,
    marginBottom: 16,
    overflow: 'hidden'
  },
  buttonsSection: {
    flexGrow: 1, alignSelf: 'end', display: 'flex', alignItems: 'end',  flexDirection: 'column', marginLeft: 'auto',
    '& > div': {
      marginTop: 8
    },
    '& div:first-child': {
      marginTop: 0
    }
  },
  buttonsSectionMobile: {
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    '& > div': {
      marginRight: 8
    },
    '& div:last-child': {
      marginRight: 0
    }
  },
  buttonSkeleton: {
    borderRadius: 3
  },
  profileInfoMobile: {
    '@media (min-width: 860px)': {
      //display: 'none'
    },
    //padding: theme.spacing(2),
    //display: 'flex',
    //justifyContent: 'space-between',
    //alignItems: 'end',
    marginBottom: theme.spacing(2)
  },
  noPostsStub: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  avatarSection: {
    position: 'relative',
    //border: '1px solid black',
    marginLeft: 0,
    marginRight: 16,
    width: 150,
    '@media (min-width: 860px)': {
      marginLeft: 16,
      marginRight: 32,
      width: 210,
    },
    flexShrink: 0
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
    '@media (min-width: 860px)': {
      top: -56,
    },
  },
  avatarAndName: {
    textAlign: 'center',
    padding: theme.spacing(2),
    // position: absolute
  },
  avatarFrame: {
    position: 'absolute',
    width: 212,
    height: 212,
    background: theme.palette.type === 'dark' ? '#424242' : 'white',
    borderRadius: '10em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  skeletonBackground: {
    borderRadius: '10em',
    background: theme.palette.type === 'dark' ? '#424242' : 'white',
  },
  name: {
    //textAlign: 'center'
  },
  cover: {
    position: 'relative',
    flexGrow: 1,
    //width: '100%',
    backgroundSize: "cover",
    backgroundRepeat: 'no-repeat',
    paddingBottom: '33%',
    overflow: 'visible',
    //marginBottom: 16
  },
  post: {
    //border: "0px solid blue"
  },
  profileNavigation: {
    //position: 'fixed',
    //overflowY: "scroll",
    width: 310,
    // [theme.breakpoints.down("sm")]: {
    //   width: leftNavWidthWithoutText
    // },
    //paddingRight: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: "sticky",
    
    //right:0,
    //bottom: 0,
    //overflowY: "scroll",
    //border: "1px solid green"
  },
  profileBody: {
		width: '100%',
    padding: '0',
    [theme.breakpoints.up("md")]: {
      //padding: '0 10px'
    },
    
    '@media (min-width: 860px)': {
      display: 'flex',
    },
    [theme.breakpoints.down("sm")]: {
      
      // minWidth: 320,
      // maxWidth: 600,
      // flexDirection: 'column',
      // alignItems: 'center'
    },
    alignItems: 'flex-start', // Это свойство нужно, чтобы элементу с position sticky было куда перемещаться, если этого свойства не будет, то он растянется во всю длину и не будет места для того, чтобы он перемещался по родительскому элементу
    //border: "1px solid black",
    //marginTop: 10
  },
  root: {
  },
  media: {
    height: '256px'
  },
  wall: {
    flexGrow: 1,
    paddingBottom: 16,
    marginRight: 0,
    '@media (min-width: 860px)': {
      marginRight: 16,
    },
    width: '100%',
    display: 'grid',
    gridGap: '16px',
  },
  postForm: {
    //width: '100%'
  },
  newPostActions: {
    margin: '0 8px'
  },
  gridList: {
    //width: 500,
    //height: 450,
  },
  addMedia: {
    '& > *': {
      margin: theme.spacing(1) / 3,
    }
  },
  input: {
    display: 'none'
  },
  photosMobile: {
    '& > div': {
      marginRight: 8
    },
    '& div:last-child': {
      marginRight: 0
    },
  },
  resize: theme.typography.body2
}))