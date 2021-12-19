import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withRouter} from 'react-router-dom'
import {withRedirectToLogin} from '../../hoc/withRedirectToLogin'
import {Route} from 'react-router-dom'
import {NavLink, Link} from 'react-router-dom'
import Dialog from './Dialog/Dialog.js'
import {
  getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection,
  onWebsocketMessage, onWebsocketConnectionError, getInterlocutorStatusAndSet
} from'./../../redux/dialogs_reducer'
import {withStyles, makeStyles} from "@material-ui/core/styles";
import {useStyles} from './DialogsStyles'
import {
  withWidth, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import HorizontalGrow from '../Common/HorizontalGrow.jsx'
import FlexCenter from '../Common/FlexCenter';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import FlickeringDotBadge from '../Common/FlickeringDotBadge.js'
import {baseUrl} from '../../api/api'
import moment from 'moment'
import Divider from '@material-ui/core/Divider';

const Dialogs = ({
  currentUserId, dialoguesLoaded, getDialogues, openWebsocketConnection, 
  onWebsocketConnectionError, onWebsocketMessage, closeWebsocketConnection, width,
  setDialogueInfo, dialoguesList, location
}) => {
  console.log('render dialogueSSS')

  const [kek, setKek] = useState('lalka')

  useEffect(() => {
    openWebsocketConnection(currentUserId, onWebsocketMessage, onWebsocketConnectionError)
    if(!dialoguesLoaded) {                                                      // Если не делать эту проверку, то при изменении языка диалоги будут заново загружены, что абсолютно не нужно
      getDialogues(currentUserId);
    }

    setTimeout(() => {
      setKek('keka')
    }, 4000)
    return () => closeWebsocketConnection()                                     // эта функция будет вызвана после размонитрования компонента
  }, [])

  const [openedDialogue, setOpenedDialogue] = useState(null)                    // открытый диалог, устанавливается в Dialog.js

  const classes = useStyles({dialogueIsOpen: Boolean(openedDialogue)})

  const dialoguesDiv = useRef(null);

  const dialoguesListLength = dialoguesLoaded ? dialoguesList.length : 3

  let renderDialoguesList = (
    <List dense >
      {(dialoguesLoaded ? 
          dialoguesList : [{id: 1}, {id: 2}, {id: 3}]).map((dialogue, index) => {
        let lastMessage = null
        if(dialogue.lastMessage) {
          lastMessage = dialogue.lastMessage.length > 25 ? `${dialogue.lastMessage.substring(0, 25)}...` : dialogue.lastMessage
        }

	      return (
          <><ListItem
            key={dialogue.id}
            button={dialoguesLoaded}
            selected={dialogue.interlocutorId === parseInt(openedDialogue)}
            component={dialoguesLoaded ? NavLink : null}
            exact to={dialoguesLoaded ? `/dialogs/${dialogue.interlocutorId}` : ''}
          >

            <ListItemAvatar>
              <FlickeringDotBadge
                invisible={!dialogue.status || dialogue.status === 'offline'}
                overlap="circle" variant="dot"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
              {dialoguesLoaded ? 
                <Avatar
                  className={classes.avatar} 
                  src={dialogue.avatar && `${baseUrl}${dialogue.avatar}`} 
                />
                : <Skeleton variant="circle" width={40} height={40} />
              }
              </FlickeringDotBadge>
            </ListItemAvatar>

            <ListItemText
              primary={dialoguesLoaded ? 
                dialogue.interlocutorName : <Skeleton height={20} />
              }
              secondary={
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <Typography variant='caption' children={lastMessage} />
                  {dialoguesLoaded &&
                    <Typography variant='caption' >
                      {moment(parseInt(dialogue.lastMessageTimestamp)).format("DD.MM")}
                    </Typography>
                   }
                </div>
              }
            />

           </ListItem>
           {(dialoguesListLength - 1)
              !== index && dialoguesLoaded
              && <Divider variant="inset"/>
           }
           </>
        )})}
    </List>
  )

  let isMobile = width === 'xs' || width === 'sm'
  let dialogueIsOpened = location.pathname.split('/')[2]

  return (
    <div className={classes.container} ref={dialoguesDiv} >
      <Route
        exact={true}
        path={`/dialogs/`}
        render={() => (
          <>
            <div className={classes.dialoguesList} >
              <Card>{renderDialoguesList}</Card>
            </div>
            {/*!isMobile && !dialogueIsOpened &&
              <Paper className={classes.dialogueStub}>
                <div className={classes.dialogueStubContent}>
                  <Typography variant="h6"
                    children={dialoguesList.length
                      ? 'Выберите собеседника слева'
                      : (dialoguesLoaded && 'Собеседников нет, ищите')
                    }
                  />
                  </div>
              </Paper>*/}
          </>
        )}
      />
      { dialoguesLoaded &&
      <Route
        exact path='/dialogs/:interlocutorId(\w+)'
        render={() => (
          <Dialog
            setDialogueInfo={setDialogueInfo}
            currentUserId={currentUserId}
            setOpenedDialogue={setOpenedDialogue}
            
          />)}
      />}

    </div>
  )
}

const StyledIconButton = withStyles(theme => ({
  root: {
    padding: 0
  }
}))(IconButton);

let mapStateToProps = (state) => {
  return {
    dialoguesList: state.dialogsPage.dialoguesList,
    dialoguesLoaded: state.dialogsPage.dialoguesLoaded,
    currentUserId: state.auth.id
  }
}

export default compose(
  connect(mapStateToProps, {
    onWebsocketMessage, onWebsocketConnectionError, getInterlocutorStatusAndSet,
    getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection
  }),
  withWidth(),
  withRouter
  // withRedirectToLogin
)(Dialogs);
