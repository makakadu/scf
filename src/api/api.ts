import  axios, { AxiosInstance } from 'axios'
import { PhotoType, ProfileType } from '../types/types';
//import store from '../redux/redux_store'

//export let baseUrl = 'https://c71b0f40a8fd.ngrok.io/'
//let websocketUrl = 'ws://00f1117a0bef.ngrok.io/'

export const baseUrl = 'http://localhost:8001'
export const imagesStorage = `${baseUrl}/images/for-photos/`
let websocketUrl = 'ws://localhost:1234/'

export const instance = axios.create({       // Настроенный экземпляр axios для устранения дублирования и сокращения кода
  withCredentials: true,            // Не нужно в каждом запросе указывать то, что браузер должен отправлять куки
  //baseURL: 'https://8a0f021cffee.ngrok.io/', // Не нужно указывать url в каждом запросе
  baseURL: baseUrl,
  headers: {}                       // И headers тоже не нужно указывать
})

instance.interceptors.request.use(function (config) {
    //instance.defaults.headers.common.Authorization = `bearer ${localStorage.getItem("JWT")}`;
    const jwt = localStorage.getItem("JWT")
    if(jwt )config.headers.Authorization = `bearer ${jwt}`
    return config;
  },
  // function (error) {
  //   return error
  // }
);

// const AuthAPITypes = {
//   CheckAuthType: 
// }

// instance.interceptors.response.use(
//    response => {
//        console.log(response)
//        return response;
//    },
//    error => {
//        console.log(error.response)
// //        return Promise.reject();

//        if(!error.response) {
//            //return Promise.reject();
//            return {status: -1}
//        }
// //        console.log(error.response)
//        return error
// //        if(error.response.status.match(/401|403|404|405|409|422/)) {
// //            return error;
// //        }
//    }
// );


type SearchUsersResponseType = {
  items: Array<ProfileType>,
  count: number,
  cursor: string | null
}

export const appAPI = {
  searchUsers(text: string, count: number | null, cursor: string | null) {
    const countParam = count ? `&count=${count}` : ''
    const cursorParam = cursor ? `&cursor=${cursor}` : ''
    return instance.get<SearchUsersResponseType>(`/search?query=${text}${countParam}${cursorParam}&full-profile=1`)
  },
  searchUsersMini(text: string, count: number | null, cursor: string | null) {
    const countParam = count ? `&count=${count}` : ''
    const cursorParam = cursor ? `&cursor=${cursor}` : ''
    return instance.get(`/search?query=${text}${countParam}${cursorParam}`)
  }
}

export const usersAPI = {
   getUsers(currentPage: number | null = null, pageSize: number | null = null) {
       return instance.get(`users?page=${currentPage}&count=${pageSize}`) // получаем данные из сервера(асинхронно). get возвращает промис, у промиса вызывается метод then, передаём в него callback, эта стрелочная функция
           .then(response => response.data)//выполнится внутри then, там ей передастся информация полученная из сервера(+немного инфы из axios). then тоже возвращает промис, но если у возвращенного промиса
                 // вызвать then, то он, в этом случае, будет передавать в callback уже не весь response сервера, а только data
   }
}


/* export const friendsAPI = {
   getFriends(queryString) {
       return instance.get(`friends${queryString}`).then(
           response => console.log(response),
           error => console.log(error)
       )
   },
   
   offerFriendship(receiverId) {
       return instance.post('friendship_requests', {receiverId: receiverId}).then(
           response => {
               console.log(response)
               return returnSuccessResponse(response)
           },
           error => {
               console.log(error.response)
               return returnErrorResponse(error)
           }
       )
   },
   
   cancelFriendshipRequest(friendshipId) {
       return instance.delete(`friendship_requests/${friendshipId}`).then(
           response => {
               console.log(response)
               return returnSuccessResponse(response)
           },
           error => {
               console.log(error.response)
               return returnErrorResponse(error)
           }
       )
   },
   acceptFriendship(friendshipId) {
       return instance.put(`friendship_requests/${friendshipId}`).then(
           response => {
               return {code: response.status, ...response.data}
           },
           error => {
               return extractCodeAndErrorMessage(error)
           }
       )
   },
   acceptFriendship(friendshipId) {
       return instance.patch(`friendships/${friendshipId}`).then(
           response => returnSuccessResponse(response),
           error => returnErrorResponse(error)
       )
   },
   
   destroyFriendship(friendshipId) {
       return instance.delete(`friendships/${friendshipId}`).then(
           response => {
               console.log(response)
               return returnSuccessResponse(response)
           },
           error => {
               console.log(error.response)
               return returnErrorResponse(error)
           }
       )
   }
}*/

let websocketConnection: any = null;

export const websocketsAPI = {
  connectToWebsocket(userId: string, onMessage: (messageData: object, userId: string) => void, onError: () => void) {

    websocketConnection = new WebSocket(`${websocketUrl}?token=lolkek&userId=${userId}`);
    websocketConnection.onopen = function () {
  	};
    websocketConnection.onerror = function (error: any) {
      onError()
    };
    websocketConnection.onmessage = function (message: any) {
      onMessage(JSON.parse(message.data), userId)
    }
    websocketConnection.onclose = function () {
    }
  },
  closeWebsocketConnection() {
    if(websocketConnection !== null) {
      if(websocketConnection.readyState) {
        websocketConnection.close()
      }
    }
  },
  sendMessage: (queryString: string) => {
    websocketConnection.send(`${websocketUrl}?token=lolkek&${queryString}`)
  }
}

type GetPhotosResponseType = {
  items: Array<PhotoType>
  totalCount: number
}

export const photosAPI = {
  getAlbum: (albumID: string) => {
    return request(instance, 'get', `albums/${albumID}`)
  },
  getAlbums: (userID: string, page: number | null = null, limit: number | null = null) => {
    return request(instance, 'get', `users/${userID}/albums`)
  },
  getPhotos: (userID: string, limit: number | null = null, lastPhotoTimestamp: number | null = null) => {
    const lastPhotoTimestampParam = lastPhotoTimestamp ? `&last-photo-timestamp=${lastPhotoTimestamp}` : ''
    const limitParam = limit ? `&limit=${limit}` : ''
    const paramsAreExist = lastPhotoTimestampParam || limitParam
    return instance.get<GetPhotosResponseType>(`users/${userID}/photos${paramsAreExist && '?'}${limitParam}${lastPhotoTimestampParam}`)
  },
  getPhoto: (photoID: string) => instance.get<PhotoType>(`photos/${photoID}`),
  getAlbumPhotos: (albumID: string) => {
    return request(instance, 'get', `albums/${albumID}/photos`)
  },
  addPhoto: (image: any, addCreator: string, albumID: string, options: any) => {
    let formData = new FormData()
    formData.append('image', image)
    formData.append('addCreator', addCreator)
    formData.append('albumID', albumID)
    let config = {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    //console.log(config)
    return instance.post<any>(`photos/`, formData, config)
  },
  createCommentPhoto: (photo: any) => {
    let formData = new FormData()
    formData.append('photo', photo)

    let options = {}
    let config = {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    console.log(config)
    return instance.post<any>(`user-comment-photos/`, formData, config)
  },
  getCommentPhoto: (photoId: string) => {
    return instance.get<PhotoType>(`user-comment-photos/${photoId}`)
  },
  createPostPhoto: (photo: any, onProgressEvent: any) => {
    let formData = new FormData()
    formData.append('photo', photo)

    let options = {}
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgressEvent
    }
    return instance.post<any>(`user-post-photos/`, formData, config)
  },
  getPostPhoto: (photoId: string) => {
    return instance.get<PhotoType>(`user-post-photos/${photoId}`)
  },
}

let request = (axiosInstance: AxiosInstance, requestMethod: string, uri: string, bodyParams?: object, headers: object = {}) => {
  let promise: any;
  let config: any = {
    ...headers
  }

  switch(requestMethod) {
    case 'post':
      promise = bodyParams ? axiosInstance.post(uri, bodyParams, config) : axiosInstance.post(uri)
      break;
    case 'get':
      promise = axiosInstance.get(uri)
      break;
    case 'put':
      promise = bodyParams ? axiosInstance.put(uri, bodyParams, config) : axiosInstance.put(uri)
      break;
    case 'delete':
      promise = axiosInstance.delete(uri, config)
      break;
    case 'patch':
      promise = bodyParams ? axiosInstance.patch(uri, bodyParams, config) : axiosInstance.patch(uri)
      break;
    default: break;
  }

  // if(promise !== undefined) {

  // }

  return promise ? promise.then(
    (response: any) => returnSuccessResponse(response),
    (error: any) => {
      if(!error.response) {
        return returnErrorResponse({response: {status: -1, data: {errors: [error.message]}}})
      } else if(error.response.status === 401) {
        localStorage.removeItem('JWT')
        localStorage.removeItem('pendingMessages')
      }
      return {httpCode: error.response.status, data: {...error.response.data}}
    }
  ) : null
}

const returnSuccessResponse = (response: any) => {
  return {httpCode: response.status, data: {...response.data}}
}

const returnErrorResponse = (error: any) => {
  return {httpCode: error.response.status, data: {...error.response.data}}
}
