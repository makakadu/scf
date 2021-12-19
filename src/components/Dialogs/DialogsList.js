import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withRouter} from 'react-router-dom'
import {withRedirectToLogin} from '../../hoc/withRedirectToLogin'
import {Route} from 'react-router-dom'
import {NavLink, Link} from 'react-router-dom'
import Dialogue from './Dialogue/Dialogue.js'
import {
  getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection,
  onWebsocketMessage, getInterlocutorStatusAndSet
} from'../../redux/dialogs_reducer'
import {withStyles, makeStyles} from "@material-ui/core/styles";
import {useStyles} from './DialogsListStyles'
import {
  withWidth, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import FlickeringDotBadge from '../Common/FlickeringDotBadge.js'
import {baseUrl} from '../../api/api'
import moment from 'moment'
import Divider from '@material-ui/core/Divider';

const DialogsList = React.memo(({
  dialoguesLoaded, openedDialogue, currentUserId, getDialogues, width, dialoguesList, location
}) => {
  const classes = useStyles({dialogueIsOpen: Boolean(openedDialogue)})
  const [kek, setKek] = useState('lalka')

  console.log('render dialogs list')

  useEffect(() => {
    if(!dialoguesLoaded) {                                                      // Если не делать эту проверку, то при изменении языка диалоги будут заново загружены, что абсолютно не нужно
      getDialogues(currentUserId);
    }
  }, [dialoguesLoaded])

  const dialoguesListLength = dialoguesLoaded ? dialoguesList.length : 3
  
  const sortedDialoguesList = dialoguesList.sort((a, b) => parseInt(b.lastMessageTimestamp) - parseInt(a.lastMessageTimestamp))

  let isMobile = width === 'xs' || width === 'sm'
  let dialogueIsOpened = location.pathname.split('/')[2]

  return (
    <div className={classes.dialoguesList} >
      <Card>
        <List dense >
          {(dialoguesLoaded ? 
              sortedDialoguesList : [{id: 1}, {id: 2}, {id: 3}]).map((dialogue, index) => {
            let lastMessage = null
            if(dialogue.lastMessage) {
              lastMessage = dialogue.lastMessage.length > 25 ? `${dialogue.lastMessage.substring(0, 25)}...` : dialogue.lastMessage
            }

            console.log(dialogue)
            return (
              <><ListItem
                key={dialogue.id}
                button={dialoguesLoaded}
                selected={dialogue.interlocutorId === parseInt(openedDialogue)}
                component={dialoguesLoaded ? NavLink : null}
                exact to={dialoguesLoaded ? `/dialogs/${dialogue.id}` : ''}
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
                    lastMessage && 
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant='caption' children={lastMessage} />
                        {dialoguesLoaded &&
                          <Typography variant='caption' >
                            {moment(dialogue.lastMessageTimestamp).format("DD.MM.YYYY")}
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
      </Card>
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
    dialoguesList: state.dialogsPage.dialoguesList,
    dialoguesLoaded: state.dialogsPage.dialoguesLoaded,
    currentUserId: state.auth.id
  }
}

export default compose(
  connect(mapStateToProps, {
    onWebsocketMessage, getInterlocutorStatusAndSet,
    getDialogue, getDialogues, openWebsocketConnection, closeWebsocketConnection
  }),
  withWidth(),
  withRouter
  // withRedirectToLogin
)(DialogsList);
