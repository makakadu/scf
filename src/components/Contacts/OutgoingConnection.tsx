import React, { useCallback, useEffect, useState, useRef } from 'react';
import { NavLink, Redirect, Route, Switch, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { ConnectionType, ContentLinkType, ProfileType } from '../../types/types';
import { Avatar, Button, CircularProgress, Divider, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { imagesStorage } from '../../api/api';
import SimpleText from '../Common/SimpleText';
import { useStyles } from './ConnectionsStyles';
import ConnectionSkeleton from './ConnectionSkeleton';

type OutgoingConnectionPropsType = {
  connection: ConnectionType
  handleDelete: Function
}

const OutgoingConnection: React.FC<OutgoingConnectionPropsType> = React.memo((props: OutgoingConnectionPropsType) => {
  const classes = useStyles()

  const {connection, handleDelete} = props
  const { t } = useTranslation()
  
  const target = connection.target
  const userPicture = `${imagesStorage}${target.picture}`
  const userFullName = `${target.firstName} ${target.lastName}`
  const userLink = `/i/${target.username}`

  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const onDelete = async () => {
    setIsDeleting(true)
    await handleDelete(connection, 'outgoing')
    setIsDeleting(false)
  }

  return (
    <div className={ classes.connection } key={connection.id} >
      <Avatar
        component={NavLink}
        to={userLink}
        className={classes.avatar}
        src={userPicture}
      />

      <div style={{flexGrow: 1}}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color='textPrimary' component={NavLink} to={userLink} variant='body2' style={{marginBottom: 8}} >
            <b>{ userFullName }</b>
          </Typography>
        </div>

        { connection.deleted ?
          'Запрос был отменён'
          :
          <div style={{ display: 'flex' }}>
            <div className={classes.buttonWrapper} >
              <Button variant='contained' onClick={ onDelete } >
                {t('Cancel')}
              </Button>
              {isDeleting && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>

          </div>
        }
      </div>
    </div>
  )
})

export default OutgoingConnection