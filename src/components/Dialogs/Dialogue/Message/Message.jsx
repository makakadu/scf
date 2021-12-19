import React from 'react';
//import styles from './Message.module.css'
import cn from 'classnames'
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import { useStyles } from './MessageStyles';
import moment from 'moment'
import { Typography } from '@material-ui/core';
import {useTranslation} from 'react-i18next';

const Message = React.memo((props) => {
  const {message, isSent, isRead, side, error, type, time, width, onDelete, onRestore} = props
  console.log(side)
  let messageProps = {
    isSent: isSent,
    isRead: isRead,
    side: side,
    isUnsent: error,
    type: type
  }

  const { t } = useTranslation();
  const classes = useStyles(messageProps)
  const isMobile = width === 'xs' || width === 'sm'
  const timeFormat = isMobile ? "HH:mm" : "HH:mm:ss"
  const creationTime = moment(time).format(timeFormat)
  const location = classes[`${type}_${side}`]
//  useEffect(() => {
//    $(`.${styles.messageContainer}`).mouseenter(function() {
//      $(this).find(`.${styles.messageTime}`).show()
//      $(this).find(`.${styles.inner_circle}`).show()
//    }).mouseleave(function() {
//      $(this).find(`.${styles.messageTime}`).hide()
//      $(this).find(`.${styles.inner_circle}`).hide()
//    });
//  }, [])

  const renderCreationTime = (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Typography 
        variant='caption'
        style={{
          paddingRight: side === 'right' ? 10 : 0,
          paddingLeft: side === 'left' ? 10 : 0
        }}
      >{creationTime}</Typography></div>
  )

  const renderMessage = (
    <Paper elevation={1} className={cn(classes.message, location)} >
      {isMobile && side === 'right' && renderCreationTime}
      {!message.isDeleted && <div className={classes.text} >{ message.text }</div> }
      {message.isDeleted && <div className={classes.text} >DELETED</div> }
      {isMobile && side === 'left' && renderCreationTime}
    </Paper>
  )

  return (
    <div className={cn(classes.container, location)} >      
      <div
        style={{margin: 5}}
        onClick={() => {
          if(!message.isDeleted) {
            onDelete(message.id)
          } else {
            onRestore()
          }
        }}
      >
        {message.isDeleted ? t('Restore') : t('Delete')}
      </div>

      {isMobile ?
        renderMessage
        :
        <Tooltip arrow title={creationTime} placement={side}>
          {renderMessage}
        </Tooltip>
      }
      

      {/*side === 'right' && 
      <div className={styles.l_circle}>
        {isUnsent && <div className={cn(styles.send_error, 'round', 'red')}>!</div>}
        {!isSent && !isUnsent && <div className={cn(styles.message_sending, 'round')}>...</div>}
        <div className={cn(styles.inner_circle, 'hidden')}>
          {isRead && <div className={cn(styles.read_message)}></div>}
          {isSent && !isRead && side === 'right'
            && <div className={cn(styles.sent_message, 'flex_container')}></div>
          }
        </div>
      </div>
      */}

    </div>
  );
})

export default Message;
