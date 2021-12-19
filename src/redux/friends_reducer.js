import {friendsAPI} from '../api/api'
import {getUser} from './profile_reducer'
import {setError} from './app_reducer'

const SET_FRIENDS = 'SET-FRIENDS'
const SET_FRIENDSHIP_REQUEST_IS_SENDING = 'SET-FRIENDSHIP-IS-SENDING'
const SET_SUBSCRIPTION_REQUEST_IS_SENDING = 'SET-SUBSCRIPTION-IS-SENDING'

let initialState = {
    friends: [
        {
            id: 22,
            name: 'Fedya Maslov',
            isAcceptsMessages: true,
            avatar: '/images/standard/friend.jpg'
        },
        {
            id: 556,
            name: 'Lena Pena',
            isAcceptsMessages: true,
            avatar: '/images/standard/friend.jpg'
        },
        {
            id: 123,
            name: 'Anton Petrov',
            isAcceptsMessages: true,
            avatar: '/images/standard/friend.jpg'
        },
        {
            id: 4433,
            name: 'Gena Bukin',
            isAcceptsMessages: true,
            avatar: '/images/standard/friend.jpg'
        },
        {
            id: 1231,
            name: 'Galya Petrova',
            isAcceptsMessages: true,
            avatar: '/images/standard/friend.jpg'
        },
    ],
    friendshipRequestIsSending: false,
    subscriptionRequestIsSending: false
}

const friendsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FRIENDS:
            return { ...state, friends: [...action.friends] }
        case SET_FRIENDSHIP_REQUEST_IS_SENDING:
            return { ...state, friendshipRequestIsSending: action.friendshipRequestIsSending }
        case SET_SUBSCRIPTION_REQUEST_IS_SENDING:
            return { ...state, subscriptionRequestIsSending: action.subscriptionRequestIsSending }
        default:
            return state
    }
}

export let offerFriendship = id => {
    return (dispatch) => {
        dispatch(toggleFriendshipRequestIsSending(true));
        friendsAPI.offerFriendship(id).then(response => {
            if(response.httpCode === 409) {
                alert(response.errorCode === 5)
                switch(response.errorCode) {
                    case 4: dispatch(setError('Вы уже предложили дружбу этому пользователю'));break;
                    case 5: dispatch(setError('Пользователь уже предложил вам дружбу'));break;
                    //case 1: dispatch(setError('Вы уже друзья'));break;
                }
            } else if(response.httpCode === 422) {
                
            }
            getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, id)
        })
    }
}

export let toggleFriendshipRequestIsSending = (value) => {
    return {type: SET_FRIENDSHIP_REQUEST_IS_SENDING, friendshipRequestIsSending: value}
}

export let toggleSubscriptionRequestIsSending = (value) => {
    return {type: SET_SUBSCRIPTION_REQUEST_IS_SENDING, subscriptionRequestIsSending: value}
}

export let destroyFriendship = (friendshipId, friendId) => {
    return (dispatch) => {
        dispatch(toggleFriendshipRequestIsSending(true));
        friendsAPI.destroyFriendship(friendshipId).then(response => {
            if(response.httpCode === 404) {
                dispatch(setError('Невозможно удалить пользователя из друзей, вероятно, он уже удалил вас из друзей'));
                getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, friendId)
            }
            getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, friendId)
        })
    }
}

export let cancelFriendshipOffer = (friendshipId, requesteeId) => {
    return (dispatch) => {
        dispatch(toggleFriendshipRequestIsSending(true));
        friendsAPI.destroyFriendship(friendshipId).then(response => {
            if(response.httpCode === 404) {
                dispatch(setError('Невозможно отменить предложение дружбы, поскольку его не существует'));
                getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, requesteeId)
            }
            getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, requesteeId)
        })
    }
}

let getUserAndDisableFriendshipRequestIsSendingFlag = async (dispatch, friendId) => {
    let promise = await dispatch(getUser(friendId))
    console.log(promise)
    dispatch(toggleFriendshipRequestIsSending(false));
}

export let acceptFriendship = (friendshipId, senderId) => {   
    return async dispatch => {
        dispatch(toggleFriendshipRequestIsSending(true));
        
        let response = await friendsAPI.acceptFriendship(friendshipId)
        if(response.httpCode === 404) {
            dispatch(setError('Пользователь отменил предложение дружбы'));
            getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, senderId)
        } else if(response.httpCode === 422) {
            switch(response.errorCode) {
                case 1: dispatch(setError('Вы уже являетесь друзьями'));break;
                case 2: dispatch(setError('Действие невозможно'));break;
                case 3: dispatch(setError('Вы достигли максимального количества друзей'));break;
            }
            getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, senderId)
        } else if(response.httpCode === 200) {
            getUserAndDisableFriendshipRequestIsSendingFlag(dispatch, senderId)
        }
    }
}

export let setFriends = friends => ({type: SET_FRIENDS, friends: friends})

export default friendsReducer
