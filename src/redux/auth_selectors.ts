import { AppStateType } from './redux_store'
//import {createSelector} from 'reselect'

export const getCurrentUserId = (state: AppStateType) => {
    return state.auth.id
}

export const getCurrentUserUsername = (state: AppStateType) => {
    return state.auth.username
}

export const getCurrentUserPicture = (state: AppStateType) => {
    return state.auth.avatar
}