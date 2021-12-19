import { photosAPI } from '../api/api' // почему-то если закомментить импорты, то всё работает, иначе profile не попадает в store. Скорее всего это из-за того, что в файлах api и app_reducer что-то не так
import { profileAPI } from '../api/profile_api'
import { stopSubmit } from 'redux-form'
import { setCommonError } from './app_reducer'
import { baseUrl } from '../api/api'
import { ProfileType, PostCommentType, PostType, PhotoType, ReactionType, ReactionsCountItem, ConnectionType, ProfilePictureType, SubscriptionType } from '../types/types'
import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsTypes } from './redux_store'
import { connectionAPI } from '../api/connection_api'
import { setProfilePicture } from './auth_reducer'
import { profile } from 'console'
import { subscriptionAPI } from '../api/subscription_api'
import { cleanProfilePosts, setPostsOwnerAndAllCount } from './profile_posts_reducer'
import { AxiosError } from 'axios'

const SET_USER_PROFILE = 'profile/SET-USER-PROFILE'
const SET_STATUS = 'profile/SET-STATUS';
const CLEAN_PROFILE = 'profile/CLEAN-PROFILE';
const SET_CONNECTION = 'profile/SET-CONNECTION'
const ACCEPT_CONNECTION = 'profile/ACCEPT-CONNECTION'
const SET_SUBSCRIPTION = 'profile/SET-SUBSCRIPTION'
const SET_PICTURE = 'profile/SET-PICTURE'

let initialState = {
  profileExists: null,
  profile: undefined as ProfileType | null | undefined,
  posts: [] as Array<PostType>,
  postsLoaded: false,
  postsCursor: null as string | null,
  newPostText: '',
  newPostPhotos: [] as Array<PhotoType>,
  newPostForm: { error: ''},
  commentPhotos: []
}

const profileReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case SET_PICTURE: {
      let profile = state.profile
      if(profile) {
        profile.picture = action.picture
        let profileUpdated: ProfileType = {...profile}
        //return {...state, profile: profileUpdated}
      }
      return {...state}
    }
    case ACCEPT_CONNECTION: {
      if(state.profile) {
        if(state.profile.connection) {
          state.profile.connection.isAccepted = true
          state.profile = {...state.profile}
        }
      }
      return {...state}
    }
    case SET_CONNECTION: {
      if(state.profile) {
        state.profile.connection = action.connection
        state.profile = {...state.profile}
      }
      return {...state}
    }
    case SET_SUBSCRIPTION: {
      if(state.profile) {
        state.profile.subscription = action.subscription
        state.profile = {...state.profile}
      }
      return {...state}
    }
    case SET_USER_PROFILE: {
      return { ...state, profile: action.profile }
    }
    case SET_STATUS: {
      return { 
        ...state, 
        profile: state.profile ? { ...state.profile, status: action.status } : null // Во время компиляции typescript анализирует начальное состояние profile, profile в это время равен null, а это значит, что делая копию объекта есть возможность, что
        // что state.profile будет также null и получится, что копия будет создана из null, то есть получится объект типа такого {status: 'text'}. Естественно, что нельзя 
        // изменить статус, если профиль не загружен, но в теории я мог бы ступить и это было бы возможно, поэтому это круто, что tipescript не даёт скомпилироваться
      }
    }
    case CLEAN_PROFILE: {
      //console.log('CLEAN_PROFILE')
      //let setAll = (obj, val) => Object.keys(obj).forEach(k => obj[k] = val);
      //let setNull = obj => setAll(obj, null); // обнуляет все свойства объекта
      //let cleanedProfile = {status: null}
      //setNull(cleanedProfile);
      console.log('clean')
      return { ...state, postsLoaded: false, posts: [], profile: undefined }
    }
    default:
      return state
  }
}

/*
Что такое ThunkAction? Это тип для функций(им типизируется функция, а точнее thunk(thunk action)). dispatch, getState и extraArgument - это аргументы, то есть эти три аргумента будут переданы в thunk где-то там(в middleware вроде).
R - это тип возвращаемого значения функции
S - это тип возвращаемого значения функции getState, в моём приложении это будет AppStateType, то есть getState по задумке возвращает весь state.
E - это экстра аргумент, пока он не нужен
A - это тип thunk action

export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

Выше ThunkAction был типизирован так ThunkAction<Promise<void>, AppStateType, unknown, ActionsType>

Если я укажу, что какая-то функция будет возвращать ThunkAction<Promise<void>, AppStateType, unknown, ActionsType>, то это значит, что она возвратит функцию, которя принимает 3 аргумента:
  dispatch: ThunkDispatch<AppStateType, unknown, ActionsType>,
  getState: () => AppStateType,
  extraArgument: unknown

и возвращает объект типа Promise<void>
*/

export const actions = { // actions creators обязательно декларировать в этом объекте, а не вне него, иначе InferActionsTypes не сможет вывести типы
  setUserProfile: ( profile: ProfileType | null) => ({ type: SET_USER_PROFILE, profile: profile } as const),
  setStatus: (status: string) => ({ type: SET_STATUS, status: status } as const),
  cleanProfile: () => ({ type: CLEAN_PROFILE } as const),
  setConnection: (connection: ConnectionType | null) => ({type: SET_CONNECTION, connection} as const),
  acceptConnection: () => ({type: ACCEPT_CONNECTION} as const),
  setSubscription: (subscription: SubscriptionType | null) => ({type: SET_SUBSCRIPTION, subscription} as const),
  setPicture: (picture: ProfilePictureType) => ({type: SET_PICTURE, picture} as const)
}
export let cleanProfile = (): ThunkType => {
  return async (dispatch) => {
    dispatch(cleanProfilePosts())
    dispatch(actions.cleanProfile())
  }
}

export let getProfilePicture = (pictureId: string): ThunkType => async (dispatch) => {
  try {
    let response = await profileAPI.getProfilePicture(pictureId)
    if(response.status === 200) {
      dispatch(setProfilePicture(response.data.picture.versions['cropped_medium']))
    }
    return response
  }
  catch (e) {
    const error = e as AxiosError
    console.log('catch')
  }
}

export let getUserById = (userId: string): ThunkType => async (dispatch) => {
  try {
    let response = await profileAPI.getUser(userId)
    if(response.status === 200) {
      dispatch(actions.setUserProfile({...response.data}))
      let id = response.data.id
      let allPostsCount = response.data.postsCount
      dispatch(setPostsOwnerAndAllCount(id, allPostsCount))
    }
    return response
  }
  catch (e) {
    const error = e as AxiosError
    if(error.response && error.response.status === 404) {
      dispatch(actions.setUserProfile(null));
    }
  }
}

export let getUserByUsername = (username: string): ThunkType => async (dispatch) => {
  try {
    let response = await profileAPI.getUserByUsername(username)
    if(response.status === 200) {
      dispatch(actions.setUserProfile({...response.data}));
    }
    return response
  }
  catch (e) {
    const error = e as AxiosError
    if(error.response && error.response.status === 404) {
      dispatch(actions.setUserProfile(null));
    }
  }
  
}

export let updateAvatar = (photo: any, x: string, y: string, width: string, userId: string): ThunkType => {
  return async (dispatch) => {
    let response = await profileAPI.updateAvatar(photo, x, y, width)
    // console.log(response)
    if(response.status === 201) {
      dispatch(cleanProfile())
      dispatch(getUserById(userId)) // чтобы нигде на странице не было устаревшей аватарки нужно заново загрузить профиль
      dispatch(getProfilePicture(response.data.id))
    }
  }
}

export let createPhoto = (image: any): ThunkType => async (dispatch) => {
  let response = await profileAPI.createPhoto(image, '0', '-1')
  return response
}

export let updateStatus = (userId: string, status: string): ThunkType => {
  return async (dispatch) => {
    const response = await profileAPI.updateStatus(userId, status)
    
    if(response.status === 200) {
      dispatch(actions.setStatus(status))
    } else {
      let errorText = 'hz_' + response.status
      if(response.status === 404) {
        errorText = 'not found'
      }
       dispatch(stopSubmit('statusForm', {'status': errorText}))
    }
  }
}

export let createConnection = (
  userId: string,
  subscribe: boolean
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await connectionAPI.createConnection(userId, subscribe)
      if(response.status === 201) {
        let getConnectionResponse = await connectionAPI.getConnection(response.data.id)
        if(getConnectionResponse.status === 200) {
          dispatch(actions.setConnection(getConnectionResponse.data.connection))
        }
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 422) {
        let responseData = error.response.data
        console.log(responseData)
        if([22, 23, 24].includes(responseData.code)) {
          let getConnectionResponse = await connectionAPI.getConnection(responseData.connection_id)
          if(getConnectionResponse.status === 200) {
            dispatch(actions.setConnection(getConnectionResponse.data.connection))
          }
        }
        //dispatch(actions.setConnection(null))
      } 
    }
  }
}

export let createSubscription = (
  userId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await subscriptionAPI.createSubscription(userId)
      if(response.status === 201) {
        let getSubscriptionResponse = await subscriptionAPI.getSubscription(response.data.id)
        if(getSubscriptionResponse.status === 200) {
          dispatch(actions.setSubscription(getSubscriptionResponse.data.subscription))
        }
      }
    }
    catch (e) {
      const error = e as AxiosError
      // if(err.response && err.response.status === 422) {
      //   let responseData = err.response.data
      //   console.log(responseData)
      //   if([22, 23, 24].includes(responseData.code)) {
      //     let getConnectionResponse = await connectionAPI.getConnection(responseData.connection_id)
      //     if(getConnectionResponse.status === 200) {
      //       dispatch(actions.setConnection(getConnectionResponse.data.connection))
      //     }
      //   }
      //   //dispatch(actions.setConnection(null))
      // } 
    }
  }
}

export let deleteSubscription = (
  subscriptionId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await subscriptionAPI.deleteSubscription(subscriptionId)
      if(response.status === 200) {
        dispatch(actions.setSubscription(null))
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 404) {
        dispatch(actions.setSubscription(null))
      } 
    }
  }
}

export let acceptConnection = (
  connectionId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await connectionAPI.acceptConnection(connectionId)
      if(response.status === 200) {
        dispatch(actions.acceptConnection())
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 404) {
        dispatch(actions.setConnection(null))
      } 
    }
  }
}

export let getConnection = (
  connectionId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await connectionAPI.getConnection(connectionId)
      if(response.status === 200) {
        dispatch(actions.setConnection(response.data.connection))
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 404) {
        dispatch(actions.setConnection(null))
      } 
    }
  }
}

export let deleteConnection = (
  connectionId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await connectionAPI.deleteConnection(connectionId)
      if(response.status === 200) {
        dispatch(actions.setConnection(null))
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 404) {
        dispatch(actions.setConnection(null))
      } 
    }
  }
}

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsType>

export default profileReducer