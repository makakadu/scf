import {connect} from 'react-redux'
import SignUp from './SignUp.js'
import {signUp} from '../../redux/auth_reducer'
import {withRedirectToProfile} from '../../hoc/withRedirectToProfile'
import {compose} from 'redux'

let mapStateToProps = (state) => ({})

export default compose(
    connect(mapStateToProps, {signUp})//,
    //withRedirectToProfile
)
(SignUp)
