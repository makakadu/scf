import React, { useState, useEffect, useCallback, lazy } from 'react';
import Header from './components/Header/Header.js'
import NotFound from './components/NotFound/NotFound'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route,useLocation, Redirect } from "react-router-dom";
import 'moment/locale/fr'
import 'moment/locale/ru'
import 'moment/locale/uk'
import 'moment/locale/de'
import moment from 'moment'
import Button from '@material-ui/core/Button';
import { CssBaseline, Snackbar, IconButton, useMediaQuery } from "@material-ui/core";
import {
  createMuiTheme, responsiveFontSizes, useTheme
} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import { ThemeProvider } from "@material-ui/core/styles";
import getThemeObject from './theme.js'
import { useStyles } from './AppStyles.js'
import { initializeApp } from './redux/app_reducer'
import CloseIcon from '@material-ui/icons/Close';
import PhotoViewer from './components/Photos/PhotoViewer.jsx';
import queryString from 'query-string'
import { AppStateType } from './redux/redux_store';
import PostWindow from './PostWindow.js';
import PostPage from './PostPage.js';
import LeftNavigation from './components/LeftNavigation/LeftNavigation.js';
import { useTranslation } from 'react-i18next';
import { usePrevious } from './hooks/hooks.js';
import './App.css'
import Preloader from './components/Common/Preloader/Preloader.jsx';
import Feed from './components/Feed/Feed.js';
import Subscriptions from './components/Subscriptions/Subscriptions';
import Search from './components/Search/Search';

const Connections = lazy(() => import('./components/Contacts/Connections'))
const Profile = lazy(() => import('./components/Profile/Profile.js'))
const Login = lazy(() => import('./components/Login/Login.js'))
const SignUp = lazy(() => import('./components/SignUp/SignUp.js'))
const Settings = lazy(() => import('./components/Settings/Settings.js'))

const App: React.FC = React.memo(props => {
  const language = useSelector((state: AppStateType) => state.app.language)
  const appearance = useSelector((state: AppStateType) => state.app.appearance)
  const isInitialized = useSelector((state: AppStateType) => state.app.initialized)
  const isAuthenticated = useSelector((state: AppStateType) => state.auth.isAuth)
  //const picture = useSelector(getCurrentUserPicture)
  const classes = useStyles({ matches: true });
  //let location = useLocation();
  const dispatch = useDispatch()
  const [dialogueInfo, setDialogueInfo] = useState(false) // При изменении dialogueInfo перерисовывается всё приложение 
  const [networkLost, setNetworkLost] = useState(false);
  const [networkAppears, setNetworkAppears] = useState(false)
  const { t, i18n } = useTranslation()

  const qwe = useMediaQuery('(max-width: 1300px)')

  console.log(isAuthenticated)

  const prevIsAuthenticated = usePrevious(isAuthenticated)

  if (moment.locale() !== language) moment.locale(language)

  const loadAppData = useCallback(() => {
    dispatch(initializeApp())
  }, [])

  useEffect(() => {
    function onoffline() {
      setNetworkLost(true)
    }
    function ononline() {
      setNetworkLost(false)
      setNetworkAppears(true)
    }
    window.addEventListener('offline', onoffline)//'Network connection has been lost'))
    window.addEventListener('online', ononline)

    loadAppData()

    return () => {
      window.removeEventListener('offline', onoffline)
      window.removeEventListener('online', ononline)
    }
  }, [loadAppData]) // Если не добавить второй аргумент(массив) в callback, то useEffect будет срабатывать после каждого изменения состояния и return также будет выполняться после каждого изменения

  let theObj: any = getThemeObject(Boolean(appearance))
  
  let themeConfig = responsiveFontSizes(createMuiTheme(theObj))
  let loadingDisplay = <div style={{ background: '#424242', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />

  if (!isInitialized) return loadingDisplay

  if (language !== i18n.language) {                                       // если пропустить проверку на isInitialized, то language будет null, то есть в i18n.changeLanguage() будет передаваться null, App перерисуется и если language всё так же будет null, то опять будет
    if (language) setTimeout(() => i18n.changeLanguage(language), 100)    // в i18n.changeLanguage() установлен null и App опять обновится. Так будет продолжаться пока с сервера не будет загружен язык. Поэтому нужно делать проверку на isInitialized, isInitialized будет true уже после загрузки языка                                                                
    return loadingDisplay                                                // timeout нужен для того, чтобы после смены языка всё перерисовалось. Если убрать таймаут, то перерисовка происходит только когда i18n загружает новый язык
  }

  //const photoId = queryString.parse(location.search).photoId

  let networkLostSnakbar = <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    autoHideDuration={null}
    open={networkLost}
    message={'Интернета нема'}
    action={
      <React.Fragment>
        <Button color="secondary" size="small" onClick={() => {}}>
          Refresh
        </Button>
        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setNetworkLost(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    }
  />

  let networkAppearsSnackbar = <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    open={networkAppears}
    message={'Интернет есть!'}
    autoHideDuration={5000}
    action={
      <React.Fragment>
        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setNetworkAppears(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    }
  />

  //let background = location.state && location.state.background;
    
  // if(!isAuthenticated && prevIsAuthenticated) {
  //   return <Redirect to='/login' />
  // }

  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />

        <Header dialogueInfo={dialogueInfo} />

        <div className={classes.appBody} >

          <LeftNavigation />

          <div className={classes.content}>

            <React.Suspense fallback={<Preloader />}>

              <Switch > {/*location={background || location} >*/}
                <Route exact path='/' render={() => <Feed /> } />
                <Route exact path='/i/:username/subscriptions' render={() => <Subscriptions /> } />
                <Route exact path='/search' render={() => <Search /> } />
                <Route exact path='/i/:username' component={Profile} />
                <Route exact path='/i/:username/contacts' component={Connections} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={SignUp} />
                <Route path='/i/posts/:postId' render={() => <PostPage />} />
                <Route path='/settings' component={Settings} />

                {/*<Route path='/albums' render={() => <Grid xs={12} style={{ background: 'red' }}>albums</Grid>} />
                <Route path='/dialogs' render={() => <Dialogs {...kek} />} /> // Если передавать атрибуты так: setDialogueInfo={setDialogueInfo}, то приложение не компилируется. Это происходит не во всех случаях. Вот здесь я нашел решение https://stackoverflow.com/questions/48240449/type-is-not-assignable-to-type-intrinsicattributes-intrinsicclassattribu
                <Route path='/avatar_editor' render={() => <MyAvatarEditor />} />
                
                }}/>*/}
                
                <Route component={NotFound} />
              </Switch>

            </React.Suspense>
            
            { /*background && <Route path="/i/posts/:postId" children={<PostWindow />} />*/}

            { /*photoId && <PhotoViewer /> */}
            <Route path="/photos/:id" children={<PhotoViewer />} />
            {networkLost && networkLostSnakbar}
            {networkAppears && networkAppearsSnackbar}
          </div>

        </div>

    </ThemeProvider>
  )
})

export default App
