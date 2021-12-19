import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {getMessagesAndSet, sendMessage, createDialogue, 
    openWebsocketConnection, closeWebsocketConnection,
    addSendingMessageThunk, addDialogueStubAndLoad, getInterlocutorStatusAndSet, deleteMessageThunk, restoreMessageThunk
} from '../../../redux/dialogs_reducer'
import Message from './Message/Message.jsx'
import NewMessage  from './NewMessage/NewMessage'
import {withRouter, useParams} from 'react-router-dom'
import $ from 'jquery'
import Avatar from '@material-ui/core/Avatar';
import {useTranslation} from 'react-i18next';
import { useStyles } from './DialogStyles';
import { withWidth, ListItemAvatar, DialogTitle, DialogContent, Button, DialogActions, FormControlLabel, Checkbox } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog'
import {NavLink, Link} from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import {withStyles, makeStyles} from "@material-ui/core/styles";
import moment from 'moment'
import {baseUrl} from '../../../api/api'
import DialogTitleWithCloseButton from '../../Common/DialogTitleWithCloseButton.jsx';

const Dialogue = React.memo(({  // Мне кажется, что возможно стоит убрать AndSet из названий методов, хватит get, ведь это само собой, что после того как данные были получены, они будут устанавливаться в state
  currentUserId, match, dialogues, getMessagesAndSet, sendMessage,
  createDialogue, addSendingMessageThunk, setDialogueInfo, setOpenedDialogue,
  addDialogueStubAndLoad, getInterlocutorStatusAndSet, deleteMessageThunk, restoreMessageThunk, width, ...props
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const params = useParams();
  const dialogueBody = useRef(null);
  const prevSendingMessagesLength = useRef();
  const [extractingMessages, changeExtractingMessages] = useState(false)
  const messagesAreFetching = useRef(false);
  const prevScroll = useRef(0);
  const allPositions = useRef([])

  let inDialoguesList = null
  let splittedId = match.params.id.split('-')
  let interlocutorId = splittedId[0] === currentUserId ? splittedId[1] : splittedId[0]
  const scrollTo = (value) => {
    $(dialogueBody.current).scrollTop(value)
  }
	
  let dialogueId = params.id//createDialogueId(currentUserId, interlocutorId)
  let dialogue = dialogues.find(dialogue => dialogue.id === dialogueId)
  let dialogueInArray = dialogue ? true : false

  console.log(dialogue)
  if(!dialogueInArray) {
    dialogue = createDialogueStub(dialogueId, interlocutorId)
  }

  useEffect(() => {
    if(!dialogueInArray) addDialogueStubAndLoad(currentUserId, interlocutorId, dialogue.id)  // Если диалог не загружен, то делаем заглушку, чтобы можно было принимать сообщения из сокета и загружаем диалог
    let position = allPositions.current.find(position => position.id === dialogueId) // После ухода из диалога нужно чтобы он ползунок был на той же позиции, эта позиция хранится в allPositions
    if(position) dialogueBody.current.scrollTop = position.value
  }, [interlocutorId, addDialogueStubAndLoad])

  useEffect(() => {
    if(width === 'sm' || width === 'xs') {
      setOpenedDialogue(dialogue.interlocutorId)
      setDialogueInfo({isOpen: true, component: dialogueHeaderInfo})
    } else {
      setDialogueInfo({isOpen: false, component: null})
      setOpenedDialogue(dialogue.interlocutorId)
    }

    return () => {
      setDialogueInfo({isOpen: false, component: null})
      setOpenedDialogue(null)
    }
  }, [width, interlocutorId, dialogue.isLoaded])

  useEffect(() => {
    if(dialogue.isLoaded && !dialogue.messagesLoaded && dialogue.isExisting) {
      getInterlocutorStatusAndSet(dialogue.id, interlocutorId)
      console.log(dialogue.historyId)
      getMessagesAndSet(dialogue.historyId, currentUserId, interlocutorId)
    }
  }, [dialogue.isLoaded])

  useEffect(() => {
    if(dialogue.messagesLoaded) scrollTo(999999)
  }, [dialogue.messagesLoaded])

  useEffect(() => { // Здесь находятся действия, которые должны выполниться только один раз 
    setOpenedDialogue(dialogue.interlocutorId)
    setDialogueInfo({isOpen: true, component: dialogueHeaderInfo})
    let sendingMessagesLength = dialogue.sendingMessages.length
    if(sendingMessagesLength > prevSendingMessagesLength.current) {
      scrollTo(999999)
    }
    prevSendingMessagesLength.current = sendingMessagesLength
  }, [])

  useEffect(() => { // После отсылки сообщения происходит промотка вниз
    if(dialogue.sendingMessages.length) {
      scrollTo(999999)
    }
  }, [dialogue.sendingMessages.length])

  let sortedUnsentMessagesCopy = dialogue.unsentMessages.map(m => {
    return {...m, creationTime: m.guiTimestamp, error: true}
  }).sort((a, b) => a.guiTimestamp - b.guiTimestamp)
    .filter(m => m.guiTimestamp > dialogue.messages[0].creationTime)            // показываем только те, которые созданы позже чем самое ранне сообщение загруженное из сервера

  let messagesCopy = [...dialogue.messages].map(m => ({...m, error: false}))    // прибавляется свойство error, это стоит сделать где-то при создании сообщения, а не здесь
  let messagesAndUnsentMessages = messagesCopy.concat(sortedUnsentMessagesCopy)
  let sortedMessages = messagesAndUnsentMessages.sort((a, b) => a.creationTime - b.creationTime)
  
  let sortedSendingMessages = [...dialogue.sendingMessages].sort(
    (a, b) => a.guiTimestamp - b.guiTimestamp
  )
  sortedSendingMessages.forEach(message => message.error = false) // прибавляется свойство error, это стоит сделать где-то при создании сообщения, а не здесь

  let allMessages = sortedMessages.concat(sortedSendingMessages)
  let daysCount = 0
  let days = []  
  

  allMessages.forEach((message) => {
    let timestamp = message.creationTime || message.guiTimestamp
    let date = new Date(timestamp);
    let dayDate = `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`
    
    let dialogueDay = days.find(day => day.date === dayDate)

    if(!dialogueDay) {
      daysCount++
      dialogueDay = {id: daysCount, date: dayDate, messages: [],groups: [], timestamp: timestamp}
      days.push(dialogueDay)
    }
    dialogueDay.messages.push(message)
  });

  let onSendMessage = (messageData) => {
    let timestamp = Date.now()  // УБРАТЬ addSendingMessageThunk И ДИСПАТЧИТЬ ЕГО ИЗ sendMessage И createDialogue, ТАКЖЕ ПРОВЕРИТЬ ПОСЛЕДОВАТЕЛЬНОСТЬ ВЫПОЛНЕНИЯ, ТО ЕСТЬ БУДЕТ ЛИ ОТПРАВЛЕНО СООБЩЕНИЕ ДО ТОГО КАК ЗАКОНЧИТСЯ ВЫПОЛНЕНИЕ addSendingMessageThunk 
    let message = messageData.message
    if(dialogue.isExisting && message) {
      console.log('send message')
      sendMessage(message, timestamp, currentUserId, interlocutorId)
    } else { // Возможно стоит добавить проверку на то можно ли начать диалог с собеседником, но это не обязательно, ведь кнопки отправки не будет если нельзя, нужно более внимательно подойти к этому вопросу 
      createDialogue(message, currentUserId, interlocutorId, dialogue.interlocutorName, dialogue.avatar, timestamp)
    }
  }

  let handleScroll = e => { // функция отрабатывает после скролла
    let currentPosition = dialogueBody.current.scrollTop  // Узнаём текущую позицию ползунка в диалоге
    updateScrollPositionForCurrentDialogue(currentPosition, dialogueId, allPositions)

    const currentPositionLessThan20 = currentPosition <= 20
    const currentPositionLessThanPrevious = currentPosition <= prevScroll.current
    if(currentPositionLessThan20 && currentPositionLessThanPrevious && !messagesAreFetching.current) { // Если новая позиция(currentScrollPosition) меньше 20 и меньше предыдущей позиции, а также, если сообщения из БД НЕ подгружаются, то выполняется блок
      if(dialogue.messagesLoaded && dialogue.notLoadedMessagesCount) { // Если первая "порция" сообщений из БД была загружена(та что загружается сразу после открытия диалога) и остались ещё не загруженные, то загружаем следующую порцию.  
        messagesAreFetching.current = true // Наверное нужно, чтобы messagesAreFetching был создан через useState или брался из state
        let prevScrollHeight = $(dialogueBody.current)[0].scrollHeight
        //changeExtractingMessages(true)
        // getMessagesAndSet(currentUserId, interlocutorId, dialogue.messages[0].id) // подгрузка старых сообщений, расскомментить позже
        //   .then(r => { 
        //     //changeExtractingMessages(false)
        //     let newScrollPosition = $(dialogueBody.current)[0].scrollHeight - prevScrollHeight
        //     scrollTo(newScrollPosition)
        //     messagesAreFetching.current = false
        // })
      }
    }
    prevScroll.current = currentPosition
  }

  let messagesLoaded = dialogue.messagesLoaded
//  const dialogueFromList = dialoguesList.filter(d => d.id === dialogue.id)[0]
//  const avatarSrc = dialogue.messagesLoaded
//    ? `${baseUrl}${dialogueFromList && dialogueFromList.avatar}` : ''
  //let inDialoguesList = dialoguesList.filter(d => d.id === dialogueId)[0] // Ищем текущий диалог в dialoguesList, чтобы взять из него имя, статус и аватар, пока загружаются данные диалога. То есть, если есть данные, то лучше показать их
  // вместо скелета

  let interlocutorName = dialogue.interlocutorName || (inDialoguesList && inDialoguesList.interlocutorName)
  let interlocutorStatus = dialogue.status || (inDialoguesList && inDialoguesList.status)
  let interlocutorAvatar = dialogue.avatar || (inDialoguesList && inDialoguesList.avatar)

  let dialogueHeaderInfo = dialogue.isLoaded || inDialoguesList ?
    dialogue.interlocutorIsExisting ? 
      <div>
        <HeaderInfoListItem
          disableRipple dense={true} button target="_blank"
          component={Link}
          to={messagesLoaded ? `/profile/${interlocutorId}` : 'kek'}
        >
          <ListItemAvatar>
            <Avatar
              className={classes.avatar}
              src={`${baseUrl}${interlocutorAvatar}`}
            />
          </ListItemAvatar>
          <ListItemText
            primary={interlocutorName ?
              <Typography variant='body2'>{interlocutorName}</Typography> : <Skeleton width={140} height={20} />}
            secondary={<Typography variant='caption' >{interlocutorStatus ? t('online') : t('offline')}</Typography>}
          />
        </HeaderInfoListItem>
      </div> : <div style={{height: 57, width: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>DELETED</div>
      :
      <HeaderInfoListItem
        style={{width: 200}}
        disableRipple dense={true}
      >
        <ListItemAvatar>
          <Skeleton variant="circle" width={48} height={48} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton width={100} height={24} />}
          secondary={<Skeleton height={21} width={40} />}
        />
      </HeaderInfoListItem>


  const [showDeleteMessageDialog, setShowDeleteMessageDialog] = useState(false)
  const [deleteForAll, setDeleteForAll] = useState(false)
  const deletingMessageId = useRef(null)
  
  const handleCloseDeleteMessageDialog = () => {
    setShowDeleteMessageDialog(false)
    setDeleteForAll(false)
  }

  return (
    <>
    <Card dense="true" className={classes.container} >
      <header className={classes.header} >
        <IconButton
          style={{marginLeft: 8}}
          component={NavLink} to={`/dialogs`}
        >
          <ArrowBackIcon />
        </IconButton>
        {dialogueHeaderInfo}
      </header>
      <div className={classes.dialogueBody} >
        <List 
          className={classes.root} 
          ref={dialogueBody} 
          subheader={<li />} 
          onScroll={handleScroll}
        >
          {days.map(day => {
            let prevMessage = null
            let messageNumberInDay = 0 // порядковый номер сообщения из конкретного дня, первое сообщение дня имеет номер 0
            let dayTimestamp = day.timestamp
            const currentYear = new Date().getFullYear()
            const messageYear = new Date(dayTimestamp).getFullYear()
            
            let creationDateFormat = currentYear === messageYear ? "DD MMMM" : "DD MMMM YYYY"

            return (
              <li className={classes.listSection} key={day.id}>
                <ul className={classes.ul} >

                  <ListSubheader className={classes.dayContainer} >
                    <div className={classes.line}></div>
                      <Paper className={classes.day} >
                        {moment(dayTimestamp).format(creationDateFormat)}
                      </Paper>
                    <div className={classes.line}></div>
                  </ListSubheader>
                  
                  {day.messages.map(message => {
                    let type = getMessageContainerFormType(message, prevMessage, day.messages[messageNumberInDay + 1])
                    prevMessage = message
                    messageNumberInDay++

                    return (
                      <Message 
                        key={message.id} message={message} type={type}
                        side={message.creatorId === currentUserId ? 'right' : 'left'} 
                        error={Boolean(message.error)}
                        time={message.guiTimestamp || message.creationTime}
                        width={width}
                        onDelete={(id) => {
                          deletingMessageId.current = id
                          setShowDeleteMessageDialog(true)
                        }}
                        onRestore={() => {
                          restoreMessageThunk(message.id, dialogue.historyId, dialogueId, message.isDeletedForAll)
                        }}
                      />
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </List>
      </div>
      <NewMessage 
        onSubmit={ onSendMessage } 
        isLoaded={messagesLoaded} 
        isAcceptsMessages={dialogue.interlocutorAcceptsMessages}
      />
      <Dialog
        onClose={handleCloseDeleteMessageDialog}
        open={showDeleteMessageDialog}
      >
        <DialogTitleWithCloseButton
          onClose={handleCloseDeleteMessageDialog}
          children={t('Delete message')}
        />
        <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={deleteForAll}
              onChange={() => setDeleteForAll(prev => !prev)}
            />
          }
          label={t('Delete for all?')}
        />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseDeleteMessageDialog()
              deleteMessageThunk(deletingMessageId.current, dialogue.historyId, dialogueId, deleteForAll)
            }}
          >
            {t('Yes')}
          </Button>
          <Button>
            {t('No')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
    </>
  );
})

const getMessageContainerFormType = (message, prevMessage, nextMessage) => { // Функция на основе данных возвращает строку, благодаря этому будет формироваться форма контейнера сообщения
  let type = null
  let prevMessageAuthorId = prevMessage ? prevMessage.authorId : null
  let nextMessageAuthorId = nextMessage ? nextMessage.authorId : null

  if(prevMessage === null) type = 'top' 
  if(prevMessageAuthorId === message.authorId) type = 'medium'
  if(!nextMessage || nextMessageAuthorId !== message.authorId) type = 'bottom'
  if((!nextMessage || nextMessageAuthorId !== message.authorId) && (!prevMessage || prevMessageAuthorId !== message.authorId)) {
    type = 'single'
  }
  return type
} 

const updateScrollPositionForCurrentDialogue = (newScrollPosition, dialogueId, savedAllDialogsPositions) => {
  let position = savedAllDialogsPositions.current.find(p => p.id === dialogueId) // Была ли уже сохранена позиция ползунка для текущего диалога
  if(position) { // Если да, то обновляем
    position.value = newScrollPosition
  } else { // Если нет, то впервые сохраняем позицию ползунка для текущего диалога
    savedAllDialogsPositions.current.push({id: dialogueId, value: newScrollPosition})
  }
  return savedAllDialogsPositions
}

let createDialogueId = (currentUserId, interlocutorId) => {
  return currentUserId < interlocutorId
    ? `${currentUserId}-${interlocutorId}` : `${interlocutorId}-${currentUserId}`
}

const createDialogueStub = (dialogueId, interlocutorId) => {
  return {
    id: dialogueId, 
    isExistingDialogue: false, 
    dialogueLoaded: false,
    messages:[], 
    sendingMessages: [], 
    unsentMessages:[],
    interlocutorId: interlocutorId, 
    interlocutorName: null, 
    messagesLoaded: false,
    isLoaded: false
  }
}

let mapStateToProps = state => ({
  dialogues: state.dialogsPage.dialogues,
  //dialoguesList: state.dialogsPage.dialoguesList,
  extractingMessages: state.dialogsPage.extractingMessages,
  currentUserId: state.auth.id
})

const HeaderInfoListItem = withStyles(theme => ({
  root: {
    padding: theme.spacing(0, 1)
  }
}))(ListItem);

export default compose(
  connect(mapStateToProps, {
    addDialogueStubAndLoad,
    getMessagesAndSet, 
    sendMessage, 
    createDialogue, 
    openWebsocketConnection, 
    closeWebsocketConnection, 
    addSendingMessageThunk, 
    getInterlocutorStatusAndSet,
    deleteMessageThunk,
    restoreMessageThunk
  }),
  withRouter,
  withWidth()
)(Dialogue)
