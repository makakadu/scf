import { ConnectionType, PostCommentType, ProfilePictureType, ProfileType, ReactionType } from '../types/types'
import { AppStateType } from './redux_store'


export const getConnections = (state: AppStateType): Array<ConnectionType> | null => {
    return state.connections.connections
}

export const getAllConnectionsCount = (state: AppStateType): number | null => {
  return state.connections.allConnectionsCount
}