import { websocketsAPI } from '../api/api'
import { dialoguesAPI } from '../api/dialogues_api'
import { profileAPI } from '../api/profile_api'
import { reset } from 'redux-form';
import { setCommonError } from './app_reducer'
import { PhotoType, UserType } from '../types/types';
import { AppStateType, InferActionsTypes } from './redux_store';
import { ThunkAction } from 'redux-thunk';

const SEND_MESSAGE = 'dialogues/SEND-MESSAGE'
const DELETE_MESSAGE = 'dialogues/DELETE-MESSAGE'
const SET_DIALOGUE = 'dialogues/SET-DIALOGUE'
const SET_DIALOGUES = 'dialogues/SET-DIALOGUES'
const SET_EMPTY_DIALOGUE = 'dialogues/SET-EMPTY-DIALOGUE'
const ADD_NEW_DIALOGUE = 'dialogues/ADD-NEW-DIALOGUE'
const ON_WEBSOCKET_CONNECTION_ERROR = 'dialogues/ON-WEBSOCKET-CONNECTION-ERROR'
//const SET_MESSAGE = 'dialogues/SET-MESSAGE'
const SET_MESSAGES = 'dialogues/SET-MESSAGES'
const ADD_SENDING_MESSAGE = 'dialogues/ADD-SENDING-MESSAGE'
const REMOVE_SENDING_MESSAGE = 'dialogues/REMOVE-SENDING-MESSAGE'
const REMOVE_UNSENT_MESSAGE = 'dialogues/REMOVE-UNSENT-MESSAGE'
const ADD_UNSENT_MESSAGES = 'dialogues/ADD-UNSENT-MESSAGES'
const ADD_UNSENT_MESSAGE = 'dialogues/ADD-UNSENT-MESSAGE'
const ON_WEBSOCKET_MESSAGE = 'dialogues/ON-WEBSOCKET-MESSAGE'
const SET_EXTRACTING_MESSAGES = 'dialogues/SET-EXTRACTING-MESSAGES'
const ADD_DIALOGUE_STUB = 'ADD-DIALOGUE-STUB'
const SET_INTERLOCUTOR_ID = 'SET-INTERLOCUTOR-ID'
const SET_STATUS = 'SET-STATUS'
const UPDATE_AVATAR_IN_LIST = 'UPDATE-AVATAR-IN-LIST'
const ADD_DIALOGUE_TO_LIST = 'ADD-DIALOGUE-TO-LIST'
const UPDATE_DIALOGUE_IN_LIST = 'UPDATE-DIALOGUE-IN-LIST'
const SET_MESSAGE_ID = 'SET-MESSAGE-ID'
const RESTORE_MESSAGE = 'RESTORE-MESSAGE'

type MessageType = {
  id: string
  text: string
  creatorId: string
  guiTimestamp: number | null
  timestamp: number | null
  isSent: boolean
  isDeletedForAll: boolean
  isDeleted: boolean
}

type SendingMessageType = {
  id: string | null
  text: string
  creatorId: string
  guiTimestamp: number
  dialogueId: string
}

type DialogueType = {
  id: string,
  isExisting: boolean
  messages: Array<MessageType>
  participants: Array<UserType>
  sendingMessages: Array<MessageType>
  interlocutorId: string | null
  interlocutorName: string | null
  unsentMessages: Array<MessageType>
  isLoaded: boolean,
  messagesLoaded: boolean,
  totalMessagesCount: number
  notLoadedMessagesCount: number
  interlocutorAcceptsMessages: boolean
  interlocutorIsExisting: boolean
  interlocutorIsOnline: boolean
  historyId: string | null
  avatar: PhotoType | null
  lastMessage: string | null
  lastMessageTimestamp: number | null
}

type DialoguePreviewType = {
  id: string
  interlocutorId: string
  interlocutorName: string
  interlocutorIsOnline: boolean
  avatar: PhotoType | null
  lastMessage: string | null
  lastMessageTimestamp: number | null
}

let initialState = {
  dialoguesList: [] as Array<DialoguePreviewType>,
  dialogues: [] as Array<DialogueType>,
  dialoguesLoaded: false,
  statusesLoaded: false,
  extractingMessages: false,
  connectionError: false
}

const createEmptyDialogue = (
  id: string, isExisting: boolean, interlocutorId: string, interlocutorName: string | null, isLoaded: boolean, 
  messagesLoaded: boolean, interlocutorIsExisting: boolean, interlocutorAcceptsMessages: boolean
): DialogueType => ({
  id: id,
  participants: [],
  isExisting: isExisting,
  interlocutorId: interlocutorId,
  interlocutorName: interlocutorName,
  messages: [],
  sendingMessages: [],
  unsentMessages: [],
  isLoaded: isLoaded,
  messagesLoaded: messagesLoaded,
  totalMessagesCount: 0,
  notLoadedMessagesCount: 0,
  interlocutorAcceptsMessages: interlocutorAcceptsMessages,
  interlocutorIsExisting: interlocutorIsExisting,
  interlocutorIsOnline: false,
  historyId: null,
  avatar: null,
  lastMessage: null,
  lastMessageTimestamp: null
})

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsType>

const dialoguesReducer = (state = initialState, action: ActionsType): InitialStateType => {
  let dialogue = null
  switch (action.type) {
    case DELETE_MESSAGE: {
      // let dialogue = state.dialogues.filter(d => d.id === action.dialogueId)[0]
      // let message = dialogue.messages.filter(m => m.id === action.messageId)[0]
      // message.isDeletedForAll = action.forAll
      // message.isDeleted = true
      // dialogue.messages = [...dialogue.messages]
      // //dialogue.messages = dialogue.messages.filter(m => m.id !== action.messageId)
      return {...state, dialogues: [...state.dialogues]}
    }
    case RESTORE_MESSAGE: {
      let dialogue = state.dialogues.filter(d => d.id === action.dialogueId)[0]
      let message = dialogue.messages.filter(m => m.id === action.messageId)[0]
      message.isDeletedForAll = false
      message.isDeleted = false
      dialogue.messages = [...dialogue.messages]
      //dialogue.messages = dialogue.messages.filter(m => m.id !== action.messageId)
      return {...state, dialogues: [...state.dialogues]}
    }
    case SET_MESSAGE_ID:
      dialogue = state.dialogues.filter(d => d.id === action.dialogueId)[0]
      let message = dialogue.sendingMessages.filter(m => m.guiTimestamp === action.timestamp)[0]
      message.id = action.id
      message.isSent = true
      //dialogue.sendingMessages = [...dialogue.sendingMessages]
      return {...state, dialogues: [...state.dialogues]}
    case ADD_DIALOGUE_STUB:
      let dialogueId = createDialogueId(action.currentUserId, action.interlocutorId)
      let fromDialoguesList = state.dialoguesList.filter(d => d.id === dialogueId)[0]
      let dialogueStub = createEmptyDialogue(
        dialogueId, 
        Boolean(fromDialoguesList), // isExisting === true, если диалог уже есть в списке диалогов. Хотя 
        action.interlocutorId,
        null, false, false,
        Boolean(fromDialoguesList), // interlocutorIsExisting === true, если диалог уже есть в списке диалогов. Хотя 
        false
      )
      return {...state, dialogues: [...state.dialogues, dialogueStub]}
    case SET_DIALOGUE:
      dialogue = state.dialogues.filter(d => d.id === action.dialogueId)[0]
      dialogue.isExisting = action.isExisting
      dialogue.interlocutorAcceptsMessages = action.interlocutorAcceptsMessages
      dialogue.interlocutorIsExisting = action.interlocutorIsExisting
      dialogue.isLoaded = true
      dialogue.historyId = action.historyId
      dialogue.avatar = action.avatar
      dialogue.messagesLoaded = action.messagesLoaded                           // Если диалог не существует, то делаем messagesLoaded true
      dialogue.interlocutorName = action.interlocutorName
      return {...state, dialogues: [...state.dialogues]}
    case ADD_DIALOGUE_TO_LIST: { // После создания нового диалога добавиляем его в dialoguesList
      //console.log('add dialogue to list')
      let inDialogues = state.dialogues.filter(d => d.id === action.dialogueId)[0]
      // let lastMessage = inDialogues.messages[inDialogues.messages.length -1] || null
      // let lastMessageText = lastMessage ? lastMessage.еуч
      let dialogue: DialoguePreviewType = {
        id: action.dialogueId,
        interlocutorId: inDialogues.interlocutorId ? inDialogues.interlocutorId : '',
        interlocutorName: inDialogues.interlocutorName ? inDialogues.interlocutorName : '',
        interlocutorIsOnline: inDialogues.interlocutorIsOnline,
        avatar: inDialogues.avatar,
        lastMessage: action.text,
        lastMessageTimestamp: action.timestamp
      }
      return {...state, dialoguesList: [...state.dialoguesList, dialogue]}
    }
    case UPDATE_DIALOGUE_IN_LIST:
      let inDialoguesList = state.dialoguesList.filter(d => d.id === action.dialogueId)[0]
      inDialoguesList.lastMessage = action.text
      inDialoguesList.lastMessageTimestamp = action.timestamp
      return {...state, dialoguesList: [...state.dialoguesList]}
    // case SEND_MESSAGE:
    //   let date = new Date();
    //   let formattedDate = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear()

    //   let newMessage = {
    //     date: formattedDate, messageId: 228,
    //     messageAuthorId: action.senderId, messageText: action.newMessageText
    //   }
    //   return {...state, dialogue: {...state.dialogue, messages: [...state.dialogue.messages, newMessage]}}
    case SET_EXTRACTING_MESSAGES:
      return { ...state, extractingMessages: action.flag }
    case SET_STATUS:
      let dialoguesListCopy = [...state.dialoguesList]
      let dialoguesCopy = [...state.dialogues]
      let dialogueItem = dialoguesListCopy.filter(dialogue => dialogue.id === action.dialogueId)[0]
      dialogue = state.dialogues.filter(dialogue => dialogue.id === action.dialogueId)[0]
      if(dialogueItem) {
        dialogueItem.interlocutorIsOnline = action.interlocutorIsOnline
      }
      if(dialogue) {
        dialogue.interlocutorIsOnline = action.interlocutorIsOnline
      }
      return { ...state, dialoguesList: dialoguesListCopy, dialogues: dialoguesCopy, statusesLoaded: true }
    case SET_DIALOGUES:
      let dialoguesList = action.dialogues.map(dialogue => {
        //let user = dialogue.participants.filter(p => p.id === action.currentUserId)[0]
        let interlocutorId = dialogue.participants.filter(p => p.id !== action.currentUserId)[0].id
        let interlocutor: any = action.users.filter(user => user.id === interlocutorId)[0]
        const dialoguePreview: DialoguePreviewType = {
          id: dialogue.id,
          interlocutorId: interlocutor.id,
          interlocutorName: interlocutor.name,
          interlocutorIsOnline: interlocutor.isOnline,
          avatar: interlocutor.avatar,
          lastMessage: dialogue.lastMessage,
          lastMessageTimestamp: dialogue.lastMessageTimestamp
        }

        return dialoguePreview
      })
      return { ...state, dialoguesLoaded: true, dialoguesList: dialoguesList }
    case UPDATE_AVATAR_IN_LIST:
      let dialogueInList = state.dialoguesList.filter(d => d.id === action.dialogueId)[0]
      if(dialogueInList) {
        dialogueInList.avatar = action.avatar
      }
      return { ...state, dialoguesList: state.dialoguesList }
    case ON_WEBSOCKET_MESSAGE: {
      // let websocketMessage: any = action.message
      // let eventType = websocketMessage.eventType
      // if(eventType === 'remove_message') {
      //   let dialogueId = createDialogueId(websocketMessage.creatorId, websocketMessage.interlocutorId)
      //   let dialogue = state.dialogues.find(d => d.id === dialogueId)
      //   if(dialogue) {
      //     dialogue.messages = dialogue.messages.filter(message => message.id !== websocketMessage.id)
      //   }
      //   return {...state, dialogues: [...state.dialogues]}
      // } else if(eventType === 'send_message') {
      //   if(websocketMessage.creatorId === action.currentUserId) {
      //     let dialogueId = createDialogueId(websocketMessage.creatorId, websocketMessage.interlocutorId)
      //     dialogue = state.dialogues.find(d => d.id === dialogueId)
      //     return state
      //   }
      // }

      // let dialogueId = createDialogueId(websocketMessage.creatorId, websocketMessage.interlocutorId)
      // const dialogue: any = state.dialogues.find(d => d.id === dialogueId)
      // let message = dialogue.sendingMessages.filter(m => {
      //   return m.id === websocketMessage.id
      // })[0]
      // if(!message) {
      //   message = {...websocketMessage, isRead: false }
      // } else {
      //   dialogue.sendingMessages = dialogue.sendingMessages.filter(
      //        m => m.guiTimestamp !== websocketMessage.guiTimestamp
      //   )
      //   message.id = websocketMessage.id
      //   message.creationTime = websocketMessage.creationTime
      // }
      // message.isSent = true
      // dialogue.messages.push(message)
      // dialogue.totalMessagesCount = dialogue.messages.length
      // let dialoguesList = [...state.dialoguesList]
      // let ololo = dialoguesList.filter(d => d.id === dialogueId)[0]
      // if(ololo) {
      //   ololo.lastMessage = action.message.message
      // }
      // return {...state, dialogues: [...state.dialogues], dialoguesList: dialoguesList}
      return state
    }
    case SET_MESSAGES:
      let d: any = state.dialogues.find((d) => d.id === action.dialogueId)
      d.messages = d.messages.concat(action.messages)
      d.messagesLoaded = true;
      d.messages.sort((a: any, b: any) => a.timestamp - b.timestamp)
      d.totalMessagesCount = action.allMessagesCount
      d.notLoadedMessagesCount = action.allMessagesCount - d.messages.length
      createUnsentMessagesInLocalStorageIfNotExist()
      let unsentMessages = JSON.parse(localStorage.pendingMessages)
      let filteredUnsentMessages = unsentMessages.filter(
          (m: any) => m.receiverId === action.interlocutorId
      )
      d.unsentMessages = filteredUnsentMessages
      return {...state, dialogues: [...state.dialogues], extractingMessages: false}
    case ADD_SENDING_MESSAGE: {
      const dialogue: any = state.dialogues.find(d => d.id === action.dialogueId)
      dialogue.sendingMessages.push(action.message)
      return { ...state, dialogues: [...state.dialogues] }
    }
    case ADD_UNSENT_MESSAGE:
      // let unsentMessage = action.message
      // unsentMessage.error = true
      // dialogue = state.dialogues.find(d => d.id === action.dialogueId)
      // dialogue.unsentMessages.push(action.text)
      return { ...state, dialogues: [...state.dialogues] }
    case REMOVE_SENDING_MESSAGE: {
      const dialogue: any = state.dialogues.find(d => d.id === action.dialogueId)
      dialogue.sendingMessages = dialogue.sendingMessages.filter(
        (d: any) => d.guiTimestamp !== action.timestamp
      )
      return { ...state, dialogues: [...state.dialogues]}
    }
    case REMOVE_UNSENT_MESSAGE:
      createUnsentMessagesInLocalStorageIfNotExist()
      let pendingMessages = JSON.parse(localStorage.pendingMessages)
      localStorage.pendingMessages = JSON.stringify(
          pendingMessages.filter((m: any) => m.guiTimestamp !== action.timestamp)
      )
      return state
    case ON_WEBSOCKET_CONNECTION_ERROR:
      return { ...state, connectionError: true }
    default:
      return state
  }
}

const actions = {
  setDialogues: (currentUserId: string, dialogues: Array<DialogueType>, users: Array<UserType>) => ({
    type: SET_DIALOGUES,
    dialogues: dialogues, 
    users: users,
    currentUserId: currentUserId
  } as const),
  setStatus: (dialogueId: string, interlocutorIsOnline: boolean) => ({ type: SET_STATUS, interlocutorIsOnline: interlocutorIsOnline, dialogueId: dialogueId } as const),
  setInterlocutorStatus: (dialogueId: string) => ({ type: SET_INTERLOCUTOR_ID, dialogueId: dialogueId } as const),
  setMessages: (
    messages: Array<MessageType>, allMessagesCount: number, notLoadedMessagesCount: number, dialogueId: string, interlocutorId: string
  ) => ({
    type: SET_MESSAGES, messages: messages, dialogueId: dialogueId,
    interlocutorId: interlocutorId, allMessagesCount: allMessagesCount,
    notLoadedMessagesCount: notLoadedMessagesCount
  } as const),
  addDialogueStub: (currentUserId: string, interlocutorId: string) => ({
    type: ADD_DIALOGUE_STUB, currentUserId: currentUserId, interlocutorId: interlocutorId
  } as const),
  addNewDialogue: (currentUserId: string, interlocutorId: string) => ({
    type: ADD_NEW_DIALOGUE, currentUserId: currentUserId, interlocutorId: interlocutorId
  } as const),
  setDialogue: (
    dialogueId: string, interlocutorName: string, avatar: PhotoType | null, historyId: string | null, interlocutorAcceptsMessages: boolean,
    isExisting: boolean, interlocutorIsExisting: boolean, messagesLoaded: boolean
  ) => ({
    type: SET_DIALOGUE, 
    dialogueId: dialogueId, 
    interlocutorName: interlocutorName,
    avatar: avatar,
    historyId: historyId,
    isExisting: isExisting, 
    interlocutorAcceptsMessages: interlocutorAcceptsMessages,
    interlocutorIsExisting: interlocutorIsExisting,
    messagesLoaded: messagesLoaded
  } as const),
  updateAvatarInList: (avatar: PhotoType, dialogueId: string) => ({
    type: UPDATE_AVATAR_IN_LIST,
    dialogueId: dialogueId,
    avatar: avatar
  } as const),
  setExtractingMessages: (flag: boolean) => ({ type: SET_EXTRACTING_MESSAGES, flag: flag } as const),
  onWebsocketMessage: (message: MessageType, currentUserId: string) => ({
    type: ON_WEBSOCKET_MESSAGE, message: message, currentUserId: currentUserId
  } as const),
  onWebsocketConnectionError: () => ({ type: ON_WEBSOCKET_CONNECTION_ERROR } as const),
  addSendingMessage: (message: SendingMessageType, dialogueId: string) => ({ type: ADD_SENDING_MESSAGE, message: message, dialogueId: dialogueId } as const),
  addUnsentMessages: (messages: Array<MessageType>) => ({ type: ADD_UNSENT_MESSAGES, messages: messages } as const),
  addUnsentMessage: (text: string, dialogueId: string) => ({ type: ADD_UNSENT_MESSAGE, text: text, dialogueId: dialogueId } as const),
  removeSendingMessage: (timestamp: number, dialogueId: string) => ({ type: REMOVE_SENDING_MESSAGE, timestamp: timestamp, dialogueId: dialogueId } as const),
  removeUnsentMessage: (timestamp: number) => ({ type: REMOVE_UNSENT_MESSAGE, timestamp: timestamp } as const),
  setMessageId: (id: string, dialogueId: string, timestamp: number) => ({
    type: SET_MESSAGE_ID,
    dialogueId: dialogueId,
    id: id,
    timestamp: timestamp
  } as const),
  deleteMessage: (dialogueId: string, messageId: string, forAll: boolean) => ({
    type: DELETE_MESSAGE,
    dialogueId: dialogueId,
    messageId: messageId,
    forAll: forAll
  } as const),
  restoreMessage: (dialogueId: string, messageId: string) => ({
    type: RESTORE_MESSAGE,
    dialogueId: dialogueId,
    messageId: messageId,
  } as const),
  addDialogueToList: (dialogueId: string, text: string, timestamp: number) => ({
    type: ADD_DIALOGUE_TO_LIST,
    dialogueId: dialogueId,
    text: text,
    timestamp: timestamp
  } as const),
  updateDialogueInList: (dialogueId: string, text: string, timestamp: number) => ({
    type: UPDATE_DIALOGUE_IN_LIST,
    dialogueId: dialogueId,
    text: text,
    timestamp: timestamp
  } as const),
  setEmptyDialogue: (
    currentUserId: string, interlocutorId: string, interlocutorName: string, interlocutorAvatar: string, interlocutorNonexisting: boolean
  ) => ({
    type: SET_EMPTY_DIALOGUE, currentUserId: currentUserId,
    interlocutorId: interlocutorId, interlocutorName: interlocutorName,
    interlocutorAvatar: interlocutorAvatar,
    interlocutorNonexisting: interlocutorNonexisting
  } as const)
}

export let onWebsocketMessage = (): ThunkType => async (dispatch) => {
  
}

export let getDialogues = (ownerId: string): ThunkType => async (dispatch) => {
  let response = await dialoguesAPI.getDialogues(ownerId, 30, )
  if(response.status === 404) {
    //dispatch(actions.setDialogues([], []));
  } else if(response.status === 200) {
    let dialogues = response.data.items
    let ids: Array<string> = []
    let historiesIds: Array<string> = []
    dialogues.forEach((d: any) => {
      let interlocutor = d.participants.filter((p: any) => p.id !== ownerId)[0]
      ids.push(interlocutor.id)
      let historyId = d.histories.filter((history: any) => history.userId = ownerId)[0].id
      historiesIds.push(historyId)
    })
    response = await profileAPI.getUsersByIds(ids.join(','))
    let lastMessageResponse = await dialoguesAPI.getMessagesHistories(historiesIds.join(','))
    lastMessageResponse.data.histories.forEach((history: any) => {
      let dialogue = dialogues.filter((d: any) => d.dialogueId === history.dialogueId)[0]
      dialogue.lastMessage = history.lastMessage
      dialogue.lastMessageTimestamp = history.lastMessageTimestamp
    })
    if(response.status === 200) {
      dispatch(actions.setDialogues(ownerId, dialogues, response.data.items));
    }
  }
}

export let getInterlocutorStatusAndSet = (dialogueId: string, interlocutorId: string): ThunkType => {
  return async dispatch => {
    let response = await profileAPI.getProperty(interlocutorId, 'isOnline')
    if(response.status === 200) {
      dispatch(actions.setStatus(dialogueId, Boolean(response.data.value)));
    }
  }
}

export let addDialogueStubAndLoad = (currentUserId: string, interlocutorId: string, dialogueId: string): ThunkType => {
  return async dispatch => {
    dispatch(actions.addDialogueStub(currentUserId, interlocutorId))

    let response = await dialoguesAPI.getDialogue(dialogueId)

    if(response.status === 200) {
      let dialogue = response.data
      let interlocutorName = dialogue.participants.filter((p: any) => p.id !== currentUserId)[0].name
       
      let historyId = dialogue.histories.filter((history: any) => history.participantId === currentUserId)[0].id

      response = await profileAPI.getUserAvatar(interlocutorId)
      if(response.status === 200) {
        let avatar = response.data.avatar
        dispatch(actions.setDialogue(dialogueId, interlocutorName, avatar, historyId, true, true, true, false))
        dispatch(actions.updateAvatarInList(avatar, dialogueId))
      }    
    } else if(response.status === 404) {
      let response = await profileAPI.getUser(interlocutorId)

      if(response.status === 200) {
        let profile = response.data
        let fullname = `${profile.firstName} ${profile.lastName}`
        dispatch(actions.setDialogue(
          dialogueId, fullname, profile.avatar, null, profile.acceptMessages, false, true, true
        ))
      } else {
        dispatch(actions.setDialogue(
          dialogueId, 'Удалён или не создан', null, null, false, false, false, true
        ))
      }
    }
  }
}

// export let getMessagesAndSet = (historyId, interlocutorId, offsetId = 0) => async dispatch => {
//   dispatch(setExtractingMessages(true))
//   let dialogueId = createDialogueId(currentUserId, interlocutorId)
    
//   let response = await dialoguesAPI.get(dialogueId, 30, offsetId)
//   if(response.status === 200) {
//     dispatch(setMessages(
//       response.data.messages, response.data.allMessagesCount,
//       response.data.notLoadedMessagesCount, dialogueId, interlocutorId
//     ))
//   }    
// }

export let getMessagesAndSet = (historyId: string, currentUserId: string, interlocutorId: string, offsetId: number | null = null): ThunkType => {
  return async dispatch => {
    dispatch(actions.setExtractingMessages(true))
    let dialogueId = createDialogueId(currentUserId, interlocutorId)
    let response = await dialoguesAPI.getMessagesHistoryMessages(historyId)
    if(response.status === 200) {
      dispatch(actions.setMessages(
        response.data.messages, response.data.allMessagesCount,
        response.data.notLoadedMessagesCount, dialogueId, interlocutorId
      ))
    }
  }
}

export let openWebsocketConnection = (userId: string, onMessage: Function, onError: Function): ThunkType => {
  return dispatch => {
    //websocketsAPI.connectToWebsocket(userId, onMessage, onError)
  }
}

export let closeWebsocketConnection = (): ThunkType => {
  return (dispatch) => websocketsAPI.closeWebsocketConnection()
}

export let createWebsocketConnection = (userId: string, interlocutorId: string): ThunkType => {
  return (dispatch) => {
    //websocketsAPI.connectToWebsocket(userId, interlocutorId)
  }
}

export let getDialogue = (currentUserId: string, interlocutorId: string): ThunkType => {
  return dispatch => {
    return dialoguesAPI.getDialogue(createDialogueId(currentUserId, interlocutorId)).then(response => {

      if(response.status === 404) {
        profileAPI.getUser(interlocutorId).then(response => {
          //console.log(response)
          let interlocutorName = ''
          let interlocutorAvatar = ''
          let interlocutorNonexisting = true
          //alert(interlocutorNonexisting)
          if(response.status === 200) {
            interlocutorName = response.data.firstName + ' ' + response.data.lastName
            interlocutorAvatar = 'khjkhjk'
            interlocutorNonexisting = false
          }
          dispatch(actions.setEmptyDialogue(currentUserId, interlocutorId, interlocutorName, interlocutorAvatar, interlocutorNonexisting))
        })
      } else if(response.status === 200) {
        //dispatch(actions.setDialogue({...response.data}))
      }
    })
  }
}

let createUnsentMessagesInLocalStorageIfNotExist = () => {
  if(localStorage.pendingMessages === undefined || localStorage.pendingMessages === '') {
    localStorage.setItem('pendingMessages', JSON.stringify([]));
  }
}

let removeUnsentMessageFromLocalStorage = (timestamp: number) => {
  createUnsentMessagesInLocalStorageIfNotExist()
  let pendingMessages = JSON.parse(localStorage.pendingMessages)
  localStorage.pendingMessages = JSON.stringify(pendingMessages.filter((m: any) => m.guiTimestamp !== timestamp))
}

export let addSendingMessageThunk = (text: string, authorId: string, receiverId: string, timestamp: number, callback: Function | null = null): ThunkType => {
  let dialogueId = createDialogueId(authorId, receiverId)
  let message: SendingMessageType = {
    id: null, creatorId: authorId, text: text,
    dialogueId: 'lolkek', guiTimestamp: timestamp
  }
  return dispatch => {
    if(localStorage.pendingMessages === undefined || localStorage.pendingMessages === '') {
      localStorage.setItem('pendingMessages', JSON.stringify([]));
    }
    let pendingMessages = JSON.parse(localStorage.pendingMessages);
    pendingMessages.push(message);
    localStorage.pendingMessages = JSON.stringify(pendingMessages);
    dispatch(actions.addSendingMessage(message, dialogueId))
    //console.log('addSendingMessageThunk finish')
  }
}

export let createDialogueId = (currentUserId: string, interlocutorId: string): string => {
  if(currentUserId < interlocutorId) {
    return `${currentUserId}-${interlocutorId}`
  } else {
    return `${interlocutorId}-${currentUserId}`
  }
}

export let sendMessage = (text: string, timestamp: number, authorId: string, receiverId: string, afterSend: Function | null = null): ThunkType => {
  return (dispatch) => {
    let dialogueId: string = createDialogueId(authorId, receiverId)

    dispatch(reset('sendMessage')); // очищает форму после нажатия на кнопку отправить или enter
    dispatch(addSendingMessageThunk(text, authorId, receiverId, timestamp))

    let response: any = dialoguesAPI.createMessage(dialogueId, text, timestamp)

    if(response.status === 201) {
      dispatch(actions.setMessageId(response.data.id, dialogueId, timestamp))
      removeUnsentMessageFromLocalStorage(timestamp) // Удаляется из localStorage, но остаётся в sendingMessages(в state), откуда будет удалено, когда придёт сообщение через веб сокет
      dispatch(actions.updateDialogueInList(dialogueId, text, timestamp))
    } else {
      // let unsentMessage = JSON.parse(localStorage.pendingMessages).find( // Извлекаем из localStorage чтобы добавить в unsentMessages
      //   m => m.guiTimestamp === timestamp
      // )
      dispatch(actions.removeSendingMessage(timestamp, dialogueId)) // Если сообщение небыло отправлено, то удаляем его из sendingMessages и добавляем в unsentMessage. В localStorage не трогаем его 
      dispatch(actions.addUnsentMessage(text, dialogueId))//, authorId, receiverId, timestamp))
    }
    
  }
}

export let deleteMessageThunk = (messageId: string, historyId: string, dialogueId: string, deleteForAll: boolean): ThunkType => {
  return async (dispatch) => {
    // if(deleteForAll) {
    //   console.log(historyId)
    //   let response = await dialoguesAPI.updateMessage(messageId, [{field: 'deletedAt', value: 'now'}])
    //   if(response.status === 200) {
    //     dispatch(actions.deleteMessage(dialogueId, messageId, true))
    //   }
    // } else {
    //   dialoguesAPI.deleteMessageFromHistory(historyId, messageId)
    // }
  }
}

export let restoreMessageThunk = (messageId: string, historyId: string, dialogueId: string, deletedForAll: boolean): ThunkType => {
  return async (dispatch) => {
    //if(deletedForAll) {
    //   let response = await dialoguesAPI.updateMessage(messageId, [{field: 'deletedAt', value: null}])
    //   if(response.status === 200) {
    //     dispatch(actions.restoreMessage(dialogueId, messageId))
    //   }
    // } else {
    //   dialoguesAPI.deleteMessageFromHistory(historyId, messageId)
    // }
  }
}

export let createDialogue = (
  firstMessageText: string, senderId: string, receiverId: string, receiverName: string, receiverAvatar: PhotoType, timestamp: number
): ThunkType => {
  return dispatch => {
    dispatch(reset('sendMessage'));
    dispatch(addSendingMessageThunk(firstMessageText, senderId, receiverId, timestamp))
    dialoguesAPI.createDialogue(firstMessageText, receiverId, timestamp).then(response => {
      let dialogueId: string = createDialogueId(senderId, receiverId)
      if(response.status === 201) {
        dispatch(actions.setDialogue(dialogueId, receiverName, receiverAvatar, null, true, true, true, true))
        dispatch(actions.addDialogueToList(dialogueId, firstMessageText, timestamp))
        removeUnsentMessageFromLocalStorage(timestamp)
      } else {
        dispatch(setCommonError('Невозможно создать диалог'))
      }
    })
  }
}

export default dialoguesReducer


