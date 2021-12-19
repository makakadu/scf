import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withRouter} from 'react-router-dom'
import {Route} from 'react-router-dom'
import {NavLink, Link} from 'react-router-dom'
import Dialogue from './Dialogue/Dialogue.js'
import {
  getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection,
  onWebsocketMessage, getInterlocutorStatusAndSet
} from'./../../redux/dialogs_reducer'
import {withStyles, makeStyles} from "@material-ui/core/styles";
import {
  withWidth, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DialogsList from './DialogsList.js'
import {useStyles} from './DialogsStyles'
// import {
//   onWindowResizeCallbacks, onWindowScrollCallbacks
// } from '../../windowChangesListeners/windowChangesListeners.js'

const Dialogs = React.memo(({
  currentUserId, dialoguesLoaded, getDialogues, openWebsocketConnection, 
  onWebsocketConnectionError, onWebsocketMessage, closeWebsocketConnection,
  setDialogueInfo, dialoguesList, location
}) => {
  const [openedDialogue, setOpenedDialogue] = useState(null) 
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const classes = useStyles({dialogueIsOpen: Boolean(openedDialogue), innerHeight: window.innerHeight})
  const dialoguesDiv = useRef(null);
  
  useEffect(() => {
    openWebsocketConnection()
    return () => closeWebsocketConnection()                                     // эта функция будет вызвана после размонитрования компонента
  }, [])

  // useEffect(() => {
  //   let timestamp = Date.now()
  //   onWindowResizeCallbacks[timestamp] = () => {
  //     setWindowHeight(window.innerHeight) // windowHeight меняется, компонент перерисовывается и в useStyles передаётся новая высота окна
  //   }
  //   return () => delete onWindowResizeCallbacks[timestamp]
  // }, [])

  return (
    <div 
      className={classes.container} 
      ref={dialoguesDiv} 
    >
      { !Boolean(openedDialogue) && 
        <DialogsList openedDialogue={openedDialogue}/>
      }
      <Route
        exact path='/dialogs/:id'
        render={() => (
          <Dialogue
            setDialogueInfo={setDialogueInfo}
            setOpenedDialogue={setOpenedDialogue}
          />
        )}
      />
    </div>
  )
})

const StyledIconButton = withStyles(theme => ({
  root: {
    padding: 0
  }
}))(IconButton);

let mapStateToProps = (state) => {
  return {
    //dialoguesList: state.dialogsPage.dialoguesList,
    //dialoguesLoaded: state.dialogsPage.dialoguesLoaded,
    currentUserId: state.auth.id
  }
}

export default compose(
  connect(mapStateToProps, {
    onWebsocketMessage, getInterlocutorStatusAndSet,
    getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection
  }),
  //withWidth(),
  //withRouter
  // withRedirectToLogin
)(Dialogs);