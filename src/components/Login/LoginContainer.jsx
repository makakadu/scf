import {connect} from 'react-redux'
import Login from './Login.jsx'
import {logIn} from './../../redux/auth_reducer'
import {withRedirectToProfile} from '../../hoc/withRedirectToProfile'
import {compose} from 'redux'

let mapStateToProps = (state) => ({})

export default compose(
    connect(mapStateToProps, {logIn})//,
    //withRedirectToProfile
)
(Login)
