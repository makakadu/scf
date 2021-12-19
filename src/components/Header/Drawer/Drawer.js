import React from 'react';
import {compose} from 'redux'
import {NavLink} from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import LanguageIcon from '@material-ui/icons/Language'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  formControl: {
    //margin: theme.spacing(1),
    //minWidth: 120,
    //width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Drawer = React.memo((
  {navLinks, themeSwitcher, renderExitListItem, show, setShow, language, languages, onSetLanguage, currentUserId}
) => {
  const { t } = useTranslation();
  const classes = useStyles()
  const handleDrawerOpen = () => {
    setShow(true);
  };

  const handleDrawerClose = () => {
    setShow(false);
  };

  let linksList = navLinks.map(link => {
    let path
    if(link.to === 'profile') {
      path = `/profile/${currentUserId}`
    } else {
      path = `/${link.to}`
    }

    return (
      <React.Fragment key={link.to}>
        <ListItem
          button component={NavLink} to={path}
          onClick={handleDrawerClose}
        >
          <ListItemIcon>{<link.icon />}</ListItemIcon>
          <ListItemText primary={t(link.name)} />
        </ListItem>
        <Divider />
      </React.Fragment>
    )
  })

  let selectLanguage = (
    <ListItem key={1}>
      <ListItemIcon><LanguageIcon /></ListItemIcon>
      <FormControl className={classes.formControl}>

        <InputLabel id="demo-simple-select-label">{t('Language')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          onChange={(event) => onSetLanguage(event.target.value)}
        >
        {languages.map(item => {
          return (
            <MenuItem key={item.short} value={item.short}>{`${item.flag} ${item.name}`}</MenuItem>
        )})}
        </Select>
      </FormControl>
    </ListItem>
  )

  return (
    <SwipeableDrawer 
      anchor="left"
      open={show}
      onClose={handleDrawerClose}
      onOpen={handleDrawerOpen}
    >          
      <List dense style={{width: '200px'}}>
        {linksList}

        <div style={{height: '50px'}} />
        <Divider />
        {themeSwitcher}
        <Divider />
        {selectLanguage}
        <Divider />
        {renderExitListItem}
      </List>
    </SwipeableDrawer>
  )
})

//let mapStateToProps = state => {
//  return {
//  }
//}

export default compose(
//  connect(mapStateToProps, {}),
//  withRouter,
//  withWidth()
)(Drawer);

