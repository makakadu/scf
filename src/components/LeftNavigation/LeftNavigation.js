import React from 'react'
import { NavLink} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import {useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next';
import { useStyles } from './LeftNavigationStyles.js'
import { Box, IconButton, Paper, useMediaQuery } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import PeopleIcon from '@material-ui/icons/People';
import { getCurrentUserUsername } from '../../redux/auth_selectors';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';

const LeftNavigation = React.memo( props => {
  let classes = useStyles()
  const currentUserUsername = useSelector(getCurrentUserUsername)
  const username = useSelector((state) => state.auth.username)
  const isAuthenticated = useSelector((state) => state.auth.isAuth)
  const { t } = useTranslation()
  const largeIcons = useMediaQuery('(max-width: 950px)')

  // if(!isAuthenticated) {
  //   return 
  // }

  let navLinks = [
    { to: '', name: t('Feed'), icon: ViewStreamIcon },
    { to: `i/${currentUserUsername}`, name: t('My profile'), icon: HomeIcon },
    { to: `i/${currentUserUsername}/contacts`, name: t('Contacts'), icon: PeopleIcon },
    { to: `i/${currentUserUsername}/subscriptions`, name: t('Subscriptions'), icon: SubscriptionsIcon },
    // { to: 'dialogs', name: t('Dialogs'), icon: QuestionAnswerIcon },
    // { to: 'settings', name: t('Settings'), icon: SettingsIcon },
    // { to: 'bookmarks', name: t('Bookmarks'), icon: BookmarksIcon }
  ]

  let renderNavLinks = navLinks.map(link => {
    let path = link.to === 'profile' ? `/${username}` : `/${link.to}`

    return (
      <Box className={classes.leftNavItem} key={ link.name } >
        <Paper
          style={{ borderRadius: '30px' }}
          
        >
          <IconButton
            elevation={5}
            size={ largeIcons ? 'medium' : 'small'}
            className={classes.leftNavIcon}
            component={NavLink} to={path} 
          >
            <link.icon  />
          </IconButton>
        </Paper>

        <div className={classes.leftNavItemText} >
          <Typography 
            component={NavLink} to={path}
            variant='body2'
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {t(link.name)}
          </Typography>
        </div>

      </Box>
    )
  })

  return <section className={classes.leftNavContainer}>
    <div className={classes.leftNav} >
      { isAuthenticated && renderNavLinks }
    </div>
  </section>

})

export default LeftNavigation
