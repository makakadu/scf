import { ThunkAction } from "redux-thunk"
import { profileAPI } from "../api/profile_api"
import HttpStatusCode from "../api/HttpStatusCode"
import { me } from "./auth_reducer"
import { AppStateType, InferActionsTypes } from "./redux_store"
import { ConnectionType } from "../types/types"
import { connectionAPI } from '../api/connection_api'

const SET_CONNECTIONS = 'connections/SET-CONNECTIONS'
const ADD_ACCEPTED_CONNECTIONS = 'connections/ADD-ACCEPTED-CONNECTIONS'
const SET_ACCEPTED_CONNECTIONS_COUNT = 'connections/SET-ACCEPTED-CONNECTIONS-COUNT'

let initialState = {
  connections: null as Array<ConnectionType> | null,
  allConnectionsCount: null as number | null,
  acceptedConnections: undefined as Array<ConnectionType> | undefined,
  acceptedConnectionsCount: undefined as number | undefined,
  acceptedConnectionsCursor: undefined as string | null | undefined, // значение null говорит о том, что в БД уже нет записей, а undefined о том, что connections ещё не загружались
  outgoingConnections: undefined as Array<ConnectionType> | undefined,
  outgoingConnectionsCount: undefined as number | undefined,
  incomingConnections: undefined as Array<ConnectionType> | undefined,
  incomingConnectionsCount: undefined as number | undefined,
}

const appReducer = (state: InitialStateType = initialState, action: any): InitialStateType => {
  switch (action.type) {
    case SET_CONNECTIONS:
      return {...state, connections: action.connections, allConnectionsCount: action.count}
    default:
      return state;
  }
}

const actions = {
  setConnections: (connections: Array<ConnectionType>, count: number) => (
    { type: SET_CONNECTIONS, connections, count} as const
  ),
  addAcceptedConnections: (connections: Array<ConnectionType>, count: number) => (
    { type: ADD_ACCEPTED_CONNECTIONS, connections} as const
  ),
  setAcceptedConnectionsCount: (count: number) => ({type: SET_ACCEPTED_CONNECTIONS_COUNT, count} as const)
}

export let getConnectionsOfUser = (userId: string, count: number, offsetId: string | null, type: string | null): ThunkType => {
  return async (dispatch) => {
    // let response = await connectionAPI.getConnectionsOfUser(userId, count, null, offsetId, type);

    // if(response.status === HttpStatusCode.OK) {
    //   const responseData = response.data

    //   dispatch(actions.setConnections(responseData.connections, responseData.count))
    // } else {
    //   //dispatch(actions.setSettings(localStorage.i18nextLng, 0))
    // }
  }
}

export let getAcceptedConnectionsOfUser = (userId: string, count: number, cursorId: string | null): ThunkType => {
  return async (dispatch, getState) => {
    // let response = await connectionAPI.getConnectionsOfUser(userId, count, null, cursorId, 'accepted');

    // if(response.status === HttpStatusCode.OK) {
    //   // const responseData = response.data
    //   // dispatch(actions.addAcceptedConnections(responseData.connections))
    //   // let state = getState()
    //   // if(state.connections.acceptedConnectionsCount === undefined) {
    //   //   dispatch(actions.setAcceptedConnectionsCount(responseData.count))
    //   // }
    // } else {
    //   //dispatch(actions.setSettings(localStorage.i18nextLng, 0))
    // }
  }
}

type InitialStateType = typeof initialState // Тип выводится из объекта initialState.
type ActionsType = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsType>

export default appReducer;
