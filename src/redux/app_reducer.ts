import { ThunkAction } from "redux-thunk"
import { profileAPI } from "../api/profile_api"
import HttpStatusCode from "../api/HttpStatusCode"
import { me } from "./auth_reducer"
import { AppStateType, InferActionsTypes } from "./redux_store"

const INITIALIZED_SUCCESS = 'app/INITIALIZED_SUCCESS'
const SET_PRELOADER = 'app/SET-PRELOADER'
const SET_PROFILE_SETTINGS = 'app/SET_PROFILE_SETTINGS'
const SET_LANGUAGE = 'app/SET-LANGUAGE'
const SET_COMMON_ERROR = 'app/SET-COMMON-ERROR'
const SET_APPEARANCE = 'app/SET-APPEARANCE'
const SET_PAGE_ID = 'app/SET-PAGE-ID'
const CLEAN_SETTINGS = 'app/CLEAN-SETTINGS'

let language: string = localStorage.language ? localStorage.language : navigator.language
if(!localStorage.language) {
  localStorage.setItem('language', language)
}

let initialState = {
  initialized: false,
  preloader: null as boolean | null, // Когда будет выведен тип с помощью typeof, то тип будет выглядеть как-то так:
  // preloader: null | string
  language: language,
  commonError: null as string | null,
  appearance: 1,
}

// appReducer принимает объект типа InitialStateType и возвращает объект(копию) такого же типа
const appReducer = (state: InitialStateType = initialState, action: any): InitialStateType => { // Можно типизировать state явно, а можно и не явно, не явно - это когда присваиваем initialState по умолчанию и typeScript улавливает то, что initialState - это объект типа AppReducerInitialStateType 
  switch (action.type) {
    case INITIALIZED_SUCCESS:
      return {...state, initialized: true}
    case SET_PRELOADER:
      return { ...state, preloader: action.flag }
    // case SET_PAGE_ID:
    //   return { ...state, pageId: action.pageId }
    case SET_PROFILE_SETTINGS:
      return { ...state, ...action.settings }
    case SET_LANGUAGE:
      console.log(action)
      return { ...state, language: action.language }
    case SET_APPEARANCE:  
      return { ...state, appearance: action.appearance }
    case SET_COMMON_ERROR:
      return { ...state, commonError: action.error }
    case CLEAN_SETTINGS:
      return { ...state, language: localStorage.language ? localStorage.language : navigator.language}
    default:
      return state;
  }
}

const actions = {
  initializedSuccess: () => ({ type: INITIALIZED_SUCCESS } as const),
  togglePreloader: (flag: boolean)  => ({ type: SET_PRELOADER, flag: flag } as const),
  setPageId: (pageId: string) => ({ type: SET_PAGE_ID, pageId: pageId } as const),
  setCommonError: (error: string) => ({ type: SET_COMMON_ERROR, error: error} as const),
  setLanguage: (language: string) => ({ type: SET_LANGUAGE, language: language } as const),
  setAppearance: (appearance: number) => ({ type: SET_APPEARANCE, appearance: appearance } as const),
  setSettings: (language: string, appearance: number) => ({ type: SET_PROFILE_SETTINGS, settings: { language, appearance }} as const),
  cleanSettings: () => ({type: CLEAN_SETTINGS} as const)
}

export const setCommonError = (error: string): ThunkType => {
  return (dispatch) => {
    dispatch(actions.setCommonError(error))
  }
}

export const changeLanguage = (id: string, language: string): ThunkType => {
  return (dispatch) => {
    return profileAPI.changeLanguage(id, language).then((response: any) => {
      if(response.status === HttpStatusCode.OK) {
        //window.location.reload() // перезагружаем страницу потому что так проще, иначе сликом много проблем
        dispatch(actions.setLanguage(language))
      }
    })
  }
}

export const changeAppearance = (userID: string, appearance: boolean): ThunkType => {
  return async (dispatch) => {
    
    let appearanceNumber = appearance ? 1 : 0
    return profileAPI.changeAppearance(userID, appearanceNumber).then((response: any) => {
      console.log(response)
      if(response.status === HttpStatusCode.OK) {
        dispatch(actions.setAppearance(appearanceNumber))
      }
    })
  }
}

export let getUserSettings = (id: string): ThunkType => {
  return async (dispatch) => { // может быть стоит возвратить response и пускай дальше разбирается вызывающий код? Мне кажется, что нет, удобнее когда функция занимается отдельной задачей
    let response = await profileAPI.getProfileSettings(id);
    if(response.status === HttpStatusCode.OK) {
      const responseData = response.data
      const language = responseData.language
      const appearance = responseData.theme
      dispatch(actions.setSettings(language, appearance))
    } else {
      //dispatch(actions.setSettings(localStorage.i18nextLng, 0))
    }
  }
}

export const cleanSettings = (): ThunkType => {
  return async (dispatch) => {
    dispatch(actions.cleanSettings())
  }
}

export const initializeApp = (): ThunkType => {
  return async (dispatch) => { // async функция всегда возвращает промис. Если async функция будет возвращать значение, то оно будет обёрнуто в промис. Зачем эта
    //функция async? Потому что в этой функции используется await, а await работает только внутри async функций
    dispatch(actions.togglePreloader(true))
                                           
    try {
      let response = await dispatch(me()) // Даже если в me() мы возвращаем не промис, а какую-то строку, то возвратится всё равно промис, потому что асинхронные функции всегда возвращают промисы.
      // нужно подождать пока выполнятся me() и getUserSettings и только потом диспатчить initializedSuccess и togglePreloader, поэтому используется await, то есть выполнение не будет продолжено пока
      // me() и getUserSettings не выполнятся
      // await используется перед вызовом функции, которая возвращает промис
                                              // await заставит интерпретатор ждать пока промис выполнится, то есть будет возвращён не промис, а значение
      if(response.status === 200) { // Если пользователь аутентифицирован, то получаем его настройки
        await dispatch(getUserSettings(response.data.id)) // пока настройки пользователя не будут извлечены, нельзя ставить initialized в true
      }
    }
    catch(err) {
      console.log("catch")
    }
    
    dispatch(actions.initializedSuccess());
    dispatch(actions.togglePreloader(false))
   }
}

type InitialStateType = typeof initialState // Тип выводится из объекта initialState.
type ActionsType = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsType>

export default appReducer;
