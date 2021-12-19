import React, {PureComponent, useEffect, useState} from 'react';
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import { useLocation, withRouter } from 'react-router-dom'
import { makeStyles, Paper } from '@material-ui/core';
import { getCurrentUserUsername } from '../../redux/auth_selectors';
import { compose } from 'redux';
import { withRedirectToLogin } from '../../hoc/withRedirectToLogin';
import { withRedirectToProfile } from '../../hoc/withRedirectToProfile';

const Settings = React.memo(props => {
  const username = useSelector(getCurrentUserUsername)
  const { t } = useTranslation();

  //console.log(props)

  const [users, setUsers] = useState([{
      id: 1,
      name: 'Alex',
    }, {
      id: 2,
      name: 'Bebra',
    }, {
      id: 3,
      name: 'Bob',
    }]
  )

  function handleClick() {
    let alex = users.find(u => u.name === 'Alex')
    alex.name = 'Petr'
    setUsers(users => [...users])
  }

  return (
    <Paper
      style={{
        width: '100%',
        padding: 16
      }}
    >
      {users.map(user => {
        return (
          <User
            //key={user.id}
            name={user.name}
          />
        )
      })
      }
      <button onClick={handleClick} >OLOLO</button>
    </Paper>
  ) 
})

// export default compose(
//   withRouter,
//   withRedirectToLogin,
//   withRedirectToProfile
// )(

class User extends PureComponent {
  componentDidMount() {
    console.log("DID MOUNT  ", this.props.name);
  }
  componentDidUpdate(prevProps) {
    console.log("DID UPDATE  ", prevProps.name, " -> ", this.props.name);
  }
  componentWillUnmount() {
    console.log("WILL UNMOUNT  ", this.props.name);
  }
  render() {
    return (
      <span>{this.props.name}</span>
    );
  }
}

export default Settings
