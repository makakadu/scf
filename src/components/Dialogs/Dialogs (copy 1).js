import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withRouter} from 'react-router-dom'
import {withRedirectToLogin} from '../../hoc/withRedirectToLogin'
import {Route} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Dialog from './Dialog/Dialog.js'
import {
  getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection,
  onWebsocketMessage, onWebsocketConnectionError
} from'./../../redux/dialogs_reducer'
import {makeStyles} from "@material-ui/core/styles";
import {useStyles} from './DialogsStyles'
//import $ from 'jquery'
import { withWidth, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import HorizontalGrow from '../Common/HorizontalGrow.jsx'
import FlexCenter from '../Common/FlexCenter';
import Card from '@material-ui/core/Card';

const Dialogs = ({
    currentUserId, dialogues, dialoguesLoaded, getDialogues, openWebsocketConnection, 
    onWebsocketConnectionError, onWebsocketMessage, closeWebsocketConnection, width, location, setDialogueInfo
}) => {
  console.log(dialoguesLoaded)

  useEffect(() => {
    openWebsocketConnection(
      currentUserId, onWebsocketMessage, onWebsocketConnectionError
    )
    if(!dialoguesLoaded) { // Если не делать эту проверку, то при изменении языка диалоги будут заново загружены, что абсолютно не нужно
      getDialogues(currentUserId);
    }
    return () => closeWebsocketConnection() // эта функция будет вызвана после размонитрования компонента
}, [])

  const dialoguesDiv = useRef(null);

  useEffect(() => {    
    //setInterval(() => console.log($(dialoguesDiv.current).width()), 1000)
    //setInterval(() => console.log($(window).width()), 1000)
  }, [])

  let isMobile = width === 'xs' || width === 'sm'
  let dialogueIsOpen = location.pathname.split('/')[2]

  const classes = useStyles(
    {dialogueIsOpen: location.pathname.split('/')[2]}
  );

  let existingDialogues = dialogues.filter(d => d.isExistingDialogue)

  let lastMessage = 'В тебе грайма нет, бро, ты говноед'

  let dialoguesNumber = existingDialogues.length

  let renderDialoguesList = (
    <List dense>
      {existingDialogues.map(dialogue => {
        return (
          <ListItem button component={NavLink} exact to={`/dialogs/${dialogue.interlocutorId}`}>
            <ListItemAvatar>
              <Avatar></Avatar>
            </ListItemAvatar>
            <ListItemText primary={dialogue.interlocutorName} secondary={`${lastMessage.substring(0, 20)}...`} />
          </ListItem>
        )}
      )}
    </List>
  )

  //dialoguesLoaded = true // нужно временно для отображения диалога на телефоне

  return (
    <div className={classes.container} ref={dialoguesDiv} >
      <div className={classes.dialoguesListAndDialogue}>
        <Route
          exact={isMobile}
          path={`/dialogs/`}
          render={() => (
            <>
              <div className={classes.dialoguesList} >
                <Card>{renderDialoguesList}</Card>
              </div>
              {!isMobile && !dialogueIsOpen &&
                <Paper className={classes.dialogueStub}>
                  <div className={classes.dialogueStubContent}>
                    {dialoguesNumber ? 'Выберите собеседника слева' : 'Собеседников нет, ищите'}
                  </div>
                </Paper>
              }
            </>
          )}
        />
        { dialoguesLoaded &&
        <Route
          exact path='/dialogs/:interlocutorId(\d+)'
          render={() => <Dialog setDialogueInfo={setDialogueInfo} currentUserId={currentUserId} dialogues={existingDialogues}/>}
        />}
        
      </div>
    </div>
  )
}

let mapStateToProps = (state) => {
  return {
    dialogues: state.dialogsPage.dialogues,
    dialoguesLoaded: state.dialogsPage.dialoguesLoaded,
    currentUserId: state.auth.id
  }
}

export default compose(
  connect(mapStateToProps, {
    onWebsocketMessage, onWebsocketConnectionError,
    getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection
  }),
  withWidth(),
  withRouter
  // withRedirectToLogin
)(Dialogs);
