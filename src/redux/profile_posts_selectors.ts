//import {createSelector} from 'reselect'
import { ConnectionType, PostCommentType, ProfilePictureType, ProfileType, ReactionType } from '../types/types'
import { AppStateType } from './redux_store'

export const getPostComments = (state: AppStateType, postId: string): PostCommentType[] => {
    let post = state.profilePosts.posts.find(post => post.id === postId)
    return post ? post.comments : []
}