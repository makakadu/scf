import {AnyAction, applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import dialogsReducer from './dialogs_reducer';
import profileReducer from './profile_reducer';
//import usersReducer from './users_reducer.js';
//import friendsReducer from './friends_reducer.js';
import authReducer from './auth_reducer';
import appReducer from './app_reducer';
import photosReducer from './photos_reducer';
import connectionsReducer from './connections_reducer';
import testReducer from './test_reducer';
import feedReducer from './feed_reducer';
import profilePostsReducer from './profile_posts_reducer'
import { reducer as formReducer } from 'redux-form'
import subscriptionsReducer from "./subscriptions_reducer";
import usersReducer from "./users_reducer";

let rootReducer = combineReducers({
    dialogsPage: dialogsReducer,
    //usersPage: usersReducer,
    //friendsPage: friendsReducer,
    auth: authReducer,
    form: formReducer,
    profile: profileReducer,
    app: appReducer,
    photos: photosReducer,
    test: testReducer,
    connections: connectionsReducer,
    feed: feedReducer,
    profilePosts: profilePostsReducer,
    subscriptions: subscriptionsReducer,
    users: usersReducer
});

export type InferActionsTypes<T> = T extends { [keys: string]: (...args: any[]) => infer U } ? U : never

/*
  T - это объект с экшн создателями(а точнее тип, который создан на основе объекта с экшн создателями)
  actions выглядит как-то так:
  const actions = {
    cleanViewerPhotos: () => ({
        type: CLEAN_VIEWER_PHOTOS
    }),
    setAlbums: (albums: Array<AlbumType>) => ({
        type: SET_ALBUMS,
        albums: albums
    }),
  }
  то есть typeof action - это что-то типа такого:
  {
    cleanViewerPhotos: () => any
    setAlbums: () => any
  }
  Дальше идёт: extends { [keys: string]: (...args: any[]) => infer U
  [keys: string] - это ключи, например, cleanViewerPhotos и setAlbums
  extends { [keys: string]: (...args: any[]) => infer U значит, что T должен наследовать { [keys: string]: (...args: any[]) => infer U
  а поскольку T это тип - объект, который содержит ключи-строки и значения функции, то всё ок.
  infer U значит, что будет выводиться тип из возвращаемого значения функции, а поскольку функции возвращают экшны, то U - это тип, который выводится(infer) из возвращаемого экшна
  короче говоря, () => infer U значит: выведи тип из возвращаемого значения. TypeScript пробегается по каждой функции из объекта с actions creators, анализирует, что она возвращает,
  понимает, что возвращается объект и возвращает тип, который выводится на основе этого объекта
  ? U : never - это условный (тернарный) оператор, если true, то возвращается выведенный тип, иначе never
*/
//const mw: ThunkMiddleware<State, AnyAction

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType> // тип для всего state

let store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export type AppDispatch = ThunkDispatch<AppStateType, any, AnyAction>

export default store;
