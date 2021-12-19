import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => {

  return {
    leftNav: {
      position: 'fixed',
      paddingLeft: 16,
      display: 'grid',
      gridGap: 8,
      //top: 64,
      //left: -200,
      // '@media (max-width: 1270px)': {
      //   position: 'relative',
      //   top: 0
      // },
    },
    leftNavIcon: {

    },
    leftNavContainer: {
      //border: '1px solid white',
      width: 150,
      '@media (max-width: 950px)': {
        width: theme.spacing(8)
      },
      [theme.breakpoints.down("xs")]: {
        display: 'none'
      },
    },
    leftNavItem: {
      [theme.breakpoints.up("md")]: {
        //paddingLeft: 0
      },
      display: 'flex',
      alignItems: 'center',
    },
    leftNavItemText: {
      width: 100,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginLeft: theme.spacing(1)
    },
    '@media (max-width: 950px)': {
      leftNavItemText: {
        display: 'none',
      },
    },
    '@media (max-width: 1300px)': {

      leftNav: {
        //left: 0,
        //left: -70,
       // position: 'relative'
      }
    },
  }
});
