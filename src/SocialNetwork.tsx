import React, { Suspense} from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import App from './App';
// import { Store } from 'redux';
import store from "./redux/redux_store"
// import { instance } from './api/api' // axios instance
// import { setCommonError } from './redux/app_reducer'
// import { logOut } from './redux/auth_reducer';

// // https://axios-http.com/docs/handling_errors
// instance.interceptors.response.use(response => { // я переместил это сюда, потому что в файле api не импортируется store
//   //console.log(response)
//   return response;
// }, error => {

//   if(!error.response) { // если у error нет response, то значит axios не смог присоединиться до сервера 
//     store.dispatch(setCommonError('Network error'))//alert('Network error')
//     //alert('No connection')
//     Promise.reject(error)
//   } else if(error.status === 500) {

//   } else if (error.response.status === 401) {
//     store.dispatch(logOut())
//   }
//   return error.response; // если ошибка, например, 404, то возвращаем ответ в первозданном виде, для этого нужно возвратить не просто объект error, а error.response
// });

type PropsType = {
}

const SocialNetwork: React.FC<PropsType> = (props) => {
  const renderTranslationFallback = (
    <div
      style={{
        background: 'black',
        width: '1300px',
        height: '1100px'
      }}
    />
  )

  return (
    <>
      {/*<React.StrictMode>  из-за него происходит больше перерисовок, но он полезен, нужно будет почитать о нём*/}
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={renderTranslationFallback} > {/* будет показываться пока перевод(на какой-то язык) не закончился */}
            <App />
          </Suspense>
        </Provider>
      </BrowserRouter>
      {/*</React.StrictMode>*/}
    </>
  )
}

export default SocialNetwork
