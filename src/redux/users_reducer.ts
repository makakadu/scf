import { AxiosError } from 'axios'
import { ThunkAction } from 'redux-thunk'
import { usersAPI } from '../api/api'
import { connectionAPI } from '../api/connection_api'
import { subscriptionAPI } from '../api/subscription_api'
import { ConnectionType, ProfileType, SubscriptionType } from '../types/types'
import { AppStateType, InferActionsTypes } from './redux_store'

const SET_USERS = 'users/SET-USERS'
const CLEAN = 'users/CLEAN'
const UPDATE_CONNECTION = 'users/UPDATE-CONNECTION'
const UPDATE_SUBSCRIPTION = 'users/UPDATE-SUBSCRIPTION'
const ADD_USERS = 'users/ADD_USERS'

let initialState = {
  users: null as Array<ProfileType> | null,
  cursor: null as string | null,
  totalCount: null as number | null
}

const usersReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case CLEAN: {
      return {
        users: null,
        cursor: null,
        totalCount: null
      }
    }
    case SET_USERS: {
      return {...state, users: action.users, totalCount: action.totalCount, cursor: action.cursor}
    }
    case ADD_USERS: {
      if(state.users) {
        return {
          ...state,
          users: state.users.concat(action.users),
          totalCount: action.totalCount,
          cursor: action.cursor
        }
      }
      return state
    }
    case UPDATE_CONNECTION: {
      console.log('UPDATE_CONNECTION')
      if(state.users) {
        let user = state.users.find(u => action.userId === u.id)
        if(user) {
          user.connection = action.connection
          let index = state.users.indexOf(user)
          state.users[index] = {...user}
          return {...state, users: [...state.users]}
        }
      }
      return state
    }
    case UPDATE_SUBSCRIPTION: {
      if(state.users) {
        let user = state.users.find(u => action.userId === u.id)
        if(user) {
          user.subscription = action.subscription
          let index = state.users.indexOf(user)
          state.users[index] = {...user}
          return {...state, users: [...state.users]}
        }
      }
      return state
    }
    default:
      return state
  }
}

export const actions = {
  clean: () => (
    { type: CLEAN } as const
  ),
  setUsers: (users: Array<ProfileType>, totalCount: number | null, cursor: string | null) => (
    { type: SET_USERS, users, totalCount, cursor } as const
  ),
  addUsers: (users: Array<ProfileType>, totalCount: number | null, cursor: string | null) => (
    { type: ADD_USERS, users, totalCount, cursor } as const
  ),
  updateConnection: (userId: string, connection: ConnectionType | null) => (
    { type: UPDATE_CONNECTION, userId, connection } as const
  ),
  updateSubscription: (userId: string, subscription: SubscriptionType) => (
    { type: UPDATE_SUBSCRIPTION, userId, subscription } as const
  ),
}

export let createConnection = (
  userId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await connectionAPI.createConnection(userId, false)
      if(response.status === 201) {
        let getConnectionResponse = await connectionAPI.getConnection(response.data.id)
        if(getConnectionResponse.status === 200) {
          dispatch(actions.updateConnection(userId, getConnectionResponse.data.connection))
        }
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 422) {
        let responseData = error.response.data
        if([22, 23, 24].includes(responseData.code)) {
          let getConnectionResponse = await connectionAPI.getConnection(responseData.connection_id)
          if(getConnectionResponse.status === 200) {
            dispatch(actions.updateConnection(userId, getConnectionResponse.data.connection))
          }
          else if(getConnectionResponse.status === 404) {
            dispatch(actions.updateConnection(userId, null))
          }
        }
      }
    }
    console.log('before resolving')
    return 'END AND RETURN!!!' // Эта функция СРАЗУ возвращает промис с состоянием pending, и после того как выполнение дойдёт до этой строки, этот промис будет resolved
  }
}

export let createConnection2 = (
  userId: string
): ThunkType => {
  return async (dispatch) => {

    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let response = await connectionAPI.createConnection(userId, false)
          if(response.status === 201) {
            let getConnectionResponse = await connectionAPI.getConnection(response.data.id)
            if(getConnectionResponse.status === 200) {
              dispatch(actions.updateConnection(userId, getConnectionResponse.data.connection))
            }
          }
        }
        catch (e) {
          const error = e as AxiosError
          if(error.response && error.response.status === 422) {
            let responseData = error.response.data
            if([22, 23, 24].includes(responseData.code)) {
              let getConnectionResponse = await connectionAPI.getConnection(responseData.connection_id)
              if(getConnectionResponse.status === 200) {
                dispatch(actions.updateConnection(userId, getConnectionResponse.data.connection))
              }
              else if(getConnectionResponse.status === 404) {
                dispatch(actions.updateConnection(userId, null))
              }
            }
          } 
        }
        resolve()
      })()
    })
  }
}

export let acceptConnection = (
  userId: string,
  connectionId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await connectionAPI.acceptConnection(connectionId)
      if(response.status === 200) {
        let getResponse = await connectionAPI.getConnection(connectionId)
        if(getResponse.status === 200) {
          dispatch(actions.updateConnection(userId, getResponse.data.connection))
        }
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 404) {
        dispatch(actions.updateConnection(userId, null))
      } 
    }
  }
}

export let deleteConnection = (
  userId: string,
  connectionId: string
): ThunkType => {
  return async (dispatch) => {
    try {
      let response = await connectionAPI.deleteConnection(connectionId)
      if(response.status === 200) {
        dispatch(actions.updateConnection(userId, null))
      }
    }
    catch (e) {
      const error = e as AxiosError
      if(error.response && error.response.status === 404) {
        dispatch(actions.updateConnection(userId, null))
      } 
    }
  }
}

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<Promise<any>, AppStateType, unknown, ActionsType>

export default usersReducer
