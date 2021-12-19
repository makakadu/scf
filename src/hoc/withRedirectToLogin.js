import React from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

export const withRedirectToLogin = (Component) => {

    class RedirectComponent extends React.Component {
        render() {
            //if(!this.props.isAuth) return <Redirect to="/anus" />
            console.log(this.props)

            return <Component {...this.props} fromLogin='qweqwe' />
        }
    }

    let mapStateToProps = state => ({isAuth: state.auth.isAuth})
    
    return connect(mapStateToProps)(RedirectComponent)
}
