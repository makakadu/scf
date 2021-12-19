import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react';
import Drawer from './Drawer/Drawer.js'
import RightMenu from './RightMenu/RightMenu.js'
import { useTranslation } from 'react-i18next';
import {NavLink, useHistory} from 'react-router-dom'
import { useStyles } from './HeaderStyles.js'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withRouter} from 'react-router-dom'
import CustomToggleButton from '../CustomToggleButton.js'
// import {onWindowScrollCallbacks} from '../../windowChangesListeners/windowChangesListeners.js'
import {changeLanguage, changeAppearance} from '../../redux/app_reducer'
import {logOut} from './../../redux/auth_reducer'
import { Divider } from '@material-ui/core';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Badge from "@material-ui/core/Badge";
import Grid from "@material-ui/core/Grid";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import HomeIcon from '@material-ui/icons/Home';
// import { useTheme } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import withWidth from '@material-ui/core/withWidth';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popover from '@material-ui/core/Popover';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles} from "@material-ui/core/styles";
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Brightness4Icon from '@material-ui/icons/Brightness4';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import HorizontalGrow from '../Common/HorizontalGrow.jsx';
import YesCancelDialog from '../Common/YesCancelDialog.js';
import { Avatar, FormControl, InputBase, Select } from '@material-ui/core';
import { appAPI, imagesStorage } from '../../api/api';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Preloader from '../Common/Preloader/Preloader.jsx';
import Search from './Search.js';

const Header = React.memo(({
  isAuth, location, width, language, changeLanguage, logOut,
  dialogueInfo, currentUserId, appearance, changeAppearance
}) => {
  //console.log('render header')
  const { t } = useTranslation();
  //const theme = useTheme()
  const classes = useStyles();
  const history = useHistory()

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isNotificationsMenuOpen = Boolean(anchorEl);

  const handleNotificationsMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNSelected(false)
    setAnchorEl(null);
  };

  let selectedTab = null

  switch(location.pathname.split('/')[1]) {
    case 'profile': selectedTab = 0; break;
    case 'friends': selectedTab = 1; break;
    case 'dialogs': selectedTab = 2; break;
    case 'groups': selectedTab = 3; break;
    // default: console.log('Нужно как-то сообщить, что здесь что-то не то, default не должен сработать')
  }

  const languages = [
    {name: 'English', short: 'en', 'flag': '🇬🇧'},
    {name: 'Русский', short: 'ru', 'flag': '🇷🇺'},
    {name: 'Українська', short: 'uk', 'flag': '🇺🇦'},
    //{name: 'Deutsch', short: 'de', 'flag': '🇩🇪'},
    //{name: 'France', short: 'fr', 'flag': '🇫🇷'},
  ]
  
  const [value, setValue] = React.useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if(selectedTab !== value) setValue(selectedTab);
  })

  const [nSelected, setNSelected] = React.useState(false);
  const [showDrawer, setShowDrawer] = React.useState(false);

  const windowWidth = useRef(null)

  useEffect(() => {
    windowWidth.current = width
    if(windowWidth.current !== 'xs' && windowWidth.current !== 'sm') {
      checked.current = true
      setChecked2(true)  
    }
  }, [width])

  const prevScrollPosition = useRef(null)
  const checked = useRef(true)
  const [checked2, setChecked2] = React.useState(true)

  const menuId = "primary-search-account-menu";

  const fakeNotifications = [1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => {
    return <MenuItem key={n} className={classes.menuItem}><Typography>Notification {n}</Typography></MenuItem>
  })

  const renderNotificationsMenu = (
    <Menu
      className={classes.notifications} //marginThreshold={16}
      style={{height: '80%'}}
      anchorEl={anchorEl} getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      id={menuId} keepMounted
      open={isNotificationsMenuOpen}
      onClick={handleNotificationsMenuClose}
      onClose={handleNotificationsMenuClose}
    >
      {fakeNotifications}
    </Menu>
  )

  let navLinks = [
    {to: 'profile', name: 'Profile', icon: HomeIcon},
    {to: 'friends', name: 'Friends', icon: PeopleIcon},
    {to: 'dialogs', name: 'Dialogs', icon: QuestionAnswerIcon},
    {to: 'groups', name: 'Groups', icon: PeopleIcon}
  ]

  let headerLinksList = navLinks.map(link => {
    let path
    if(link.to === 'profile') {
      path = `/profile/${currentUserId}`
    } else {
      path = `/${link.to}`
    }
    return (
      <StyledTab
      	key={link.to}
        className={classes.headerTab}
        component={NavLink} to={path}
        icon={<link.icon/>} aria-label={link.to} title={t(link.name)}
      />
    )
  })

  const appearanceSwitcherListItem = (
    <ListItem>
      <ListItemIcon><Brightness4Icon /></ListItemIcon>
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(appearance)} 
            onClick={() => changeAppearance(currentUserId, !Boolean(appearance))}
          />
        }
      />
    </ListItem>
  )

  const [rightMenuAnchor, setRightMenuAnchor] = React.useState(null);
  const [isRightMenuOpen, changeIsRightMenuOpen] = React.useState(false);

  const closeRightMenu = () => {
    if(rightMenuAnchor) setRightMenuAnchor(null)
  }

  const toggleRightMenu = event => {
    if(rightMenuAnchor) {
      setRightMenuAnchor(null)
    } else {
      setRightMenuAnchor(event.currentTarget)
    }
  }
  
  const onSetLanguage = language => {
    closeRightMenu()
    changeLanguage(currentUserId, language)
  }
  
  const [showLogOutDialog, setShowLogOutDialog] = useState(false)
  
  const onLogOutClick1 = () => {
    openLogOutDialog()
  }
  
  const openLogOutDialog = () => {
    setShowLogOutDialog(true)
  }
  
  const closeLogOutDialog = () => {
    setShowLogOutDialog(false)
  }
  
  const onLogOutClick2 = () => {
    logOut(history)
    closeRightMenu()
    setShowDrawer(false)
    closeLogOutDialog()
  }
  
  const renderExitListItem = (
    <ListItem button onClick={onLogOutClick1}>
      <ListItemIcon><ExitToAppOutlinedIcon /></ListItemIcon>
      <ListItemText primary={t('Log out')}/>
    </ListItem>
  )

  let isMobile = width === 'xs' || width === 'sm'
  let dialogueIsOpen = location.pathname.split('/')[2] !== undefined
  
  const logo = (
    <div style={{ marginLeft: 40 }}>
      {/* <Avatar alt="Otval" src="https://memepedia.ru/wp-content/uploads/2019/11/15655259183450.jpg" /> */}
      {/* <span style={{fontSize: 30, fontWeight: 400}} >OTVAL</span> */}
    </div>
  )

  const renderUserNavigation = (
    <Fragment>

      <div className={ classes.drawer }>
        <IconButton
          edge="start"
          className={classes.menuButton}
          aria-label="open drawer"
          onClick={() => setShowDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          className={classes.drawer}
          appearanceSwitcher={appearanceSwitcherListItem} currentUserId={currentUserId}
          language={language} languages={languages} onSetLanguage={onSetLanguage}
          show={showDrawer} setShow={setShowDrawer} navLinks={navLinks}
          renderExitListItem={renderExitListItem}
        />
      </div>
      
      <NavLink
        to='/'
        style={{
          marginRight: 16,
          flexShrink: 0,
          width: 40,
          height: 40,
          borderRadius: '10em',
          backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/d/d1/ShareX_Logo.png)',
          backgroundSize: 40
        }}
      />

      {dialogueInfo.isOpen && isMobile ?
        <>             
          {dialogueInfo.component}
          <HorizontalGrow/>
          <Link
            color="inherit"
            component={NavLink} to={`/dialogs`} 
            style={{marginLeft: 8, marginRight: 8}}
          >
            {t('To dialogues')}
          </Link>
        </>
        :
        <>
          <Search />
          { logo }
          <div className={classes.grow} ></div>
          {/*!isMobile && 
            
            <StyledTabs
              value={value} variant="scrollable" aria-label="icon tabs example"
              onChange={handleChange}
              className={classes.headerTabs}
              classes={{indicator: {background: 'violet'}}}
            >
              {headerLinksList}
            </StyledTabs>
          */}
          <HorizontalGrow/>

          {/*
          <CustomToggleButton
            selected={nSelected}
            onChange={() => setNSelected(!nSelected)}
            onClick={handleNotificationsMenuOpen}
            size='small'
            className={classes.showNotificationsButton}
          >
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon  />
            </Badge>             
          </CustomToggleButton>
          */}
        </>
      }

      
      <CustomToggleButton
        selected={Boolean(rightMenuAnchor)}
        onChange={toggleRightMenu}
        size='small'
        className={classes.rightMenuButton}
      >
        <ArrowDropDownIcon fontSize="large" />
      </CustomToggleButton>
    </Fragment>
  )

  const notLoggedUserLanguage = (localStorage.language && localStorage.language.substring(0, 2)) || navigator.language.substring(0, 2)
  
  const guestNavigation = (
    <Fragment>
      <Link color="inherit" component={NavLink} to="/login">{t('Login')}</Link>
      <div style={{width: '20px'}}></div>
      <Link color="inherit" component={NavLink} to="/signup">{t('Register')}</Link>

      <div className={classes.selectNotLoggedUserLanguage} >
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={ notLoggedUserLanguage }
            onChange={(event) => {
              localStorage.setItem('language', event.target.value)
              window.location.reload()
            }}
          >
          {languages.map(item => <MenuItem key={item.short} value={item.short}>{`${item.name}`}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
    </Fragment>
  )

  return (
    <Grid item container>
     
      <Slide id='header' direction="down" timeout={{enter: 100, exit: 200}} in={checked2} >
        <AppBar position="fixed" color="inherit" >
          <Toolbar style={{minHeight: 48, maxHeight: 48}} >
            {isAuth ? renderUserNavigation : guestNavigation}
          </Toolbar>
        </AppBar>
      </Slide> 
      
      {renderNotificationsMenu}
      
      {width !== 'xs' && width !== 'sm' &&
        <RightMenu
          anchor={rightMenuAnchor}
          languages={languages} onSetLanguage={onSetLanguage}
          appearanceSwitcher={appearanceSwitcherListItem}
          toggleRightMenu={toggleRightMenu}
          renderExitListItem={renderExitListItem}
        />
      }
      <YesCancelDialog
        show={showLogOutDialog}
        setShow={setShowLogOutDialog}
        onYes={onLogOutClick2}
        title={t('Exit from app')}
        text={t('You sure you want exit from app')}
      />
    </Grid>
  );
})

const StyledTabs = withStyles((theme) => ({
  indicator: {
    background: theme.palette.secondary.main
  }
}))((props) => <Tabs {...props} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    minWidth: 90,
    maxWidth: 90,
    '&:hover': {
      background: theme.palette.action.disabledBackground,
      border: `5px solid ${theme.palette.background.paper}`,
      borderRadius: theme.shape.borderRadius * 2
    },
  }
}))((props) => <Tab disableRipple {...props} />);

let mapStateToProps = state => {
  return {
    currentUserId: state.auth.id,
    language: state.app.language,
    isAuth: state.auth.isAuth,
    appearance: state.app.appearance,
  }
}

export default compose(
  connect(mapStateToProps, {changeLanguage, changeAppearance, logOut}),
  withRouter,
  withWidth()
)(Header);
