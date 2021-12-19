import React from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

// export const withRedirectToProfile = (Component) => {

//   class RedirectComponent extends React.Component {
//     render() {
//       if(this.props.isAuth) {
//         return <Redirect to={`/profile/${this.props.userId}`} />
//       }
//       return <Component {...this.props} />
//     }
//   }

//   return connect(state => (
//     {
//       isAuth: state.auth.isAuth,
//       userId: state.auth.id
//     }
//   ))(RedirectComponent)
// }

export const withRedirectToProfile = (Component) => {

  const RedirectComponent = props => {
    console.log({...props})
    return <Component /> // В обычном js {...props} - это копирование объекта, а в JSX - это превращение объекта в имя=значение, если, например
    // объект props выглядит так: {name: 'Alex', age: 33}, то получается так: <Component name='Alex' age={33} />
  }

  return connect(state => (
    {
      isAuth: state.auth.isAuth,
      userId: state.auth.id
    }
  ))(RedirectComponent)
}