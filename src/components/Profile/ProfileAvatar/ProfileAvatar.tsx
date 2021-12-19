import React, { FC, memo, useEffect, useState } from 'react';
import {makeStyles} from "@material-ui/core/styles";
import MyAvatarEditor from './MyAvatarEditor.js'
import MaterialAvatar from '@material-ui/core/Avatar';
import { Link, useLocation, NavLink, withRouter, useParams } from 'react-router-dom'
import { Badge, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import PhotoCameraRoundedIcon from '@material-ui/icons/PhotoCameraRounded';
import { useSelector } from 'react-redux';
import { getCurrentUserPicture } from '../../../redux/auth_selectors';
import { getProfilePicture } from '../../../redux/profile_selectors';
import { imagesStorage } from '../../../api/api';

export const useStyles = makeStyles(theme => ({
  container: {
    padding: '5px',
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {},
  },

  avatar: {
    height: 200,
    width: 200,
    '@media (max-width: 860px)': {
      height: 150,
      width: 150,
    },
    //background: '#343434',
    border: '2px solid #343434'
  },
  changeAvatarButton: {
    //background: theme.palette.secondary.main
    //border: `1px solid ${theme.palette.secondary.main}`
  }
}))

type PropsType = {
  avatar: any
  isOwnProfile: boolean
  currentUserId: any
  profilePhotosAlbumId: string
}

const ProfileAvatar: FC<PropsType> = memo((props: PropsType) => {
  const { isOwnProfile, currentUserId, profilePhotosAlbumId } = props
  
  const params: any = useParams()
  
  const picture = useSelector(getProfilePicture)
  // @ts-ignore
  const pictureSrc: any = picture && `${imagesStorage}${picture.versions['cropped_medium']}`

  const classes = useStyles({ avatar: picture });
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
  let location = useLocation();
  useEffect(() => {
    if(showAvatarEditor) setShowAvatarEditor(false)
  }, [picture])

  let handleOpenEditor = () => {  
    if(isOwnProfile) setShowAvatarEditor(true)
  }
  //console.log(picture)
  return (
    <>
      <Badge 
        badgeContent={
          isOwnProfile ?
            <StyledIconButton
              //size='small'
              onClick={handleOpenEditor}
              className={classes.changeAvatarButton}
            >
              <PhotoCameraRoundedIcon />
            </StyledIconButton>
            :
            null
        }
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            borderRadius: 1000
          }}
        >
          <Link
            to={{
              pathname: `${location.pathname}`,
              search: `?photoId=${picture && picture.id}&albumId=${profilePhotosAlbumId}`,
              state: { 
                lolkek: true
              }
            }}
          >
            <MaterialAvatar
              src={ pictureSrc }
              className={classes.avatar}
              style={{}}
            />
          </Link>
        </div>
      </Badge>

      <MyAvatarEditor 
        currentUserId={currentUserId} 
        show={showAvatarEditor} 
        setShow={setShowAvatarEditor}
      />
    </>
  )
})

const StyledIconButton = withStyles((theme) => ({
  root: {
    background: 'rgba(255, 255, 255, 0.24)',
    color: '#fff',
    height: 40,
    width: 40,
    //border: `1px solid #fff`,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.32)'
    }
  },

}))(IconButton);

export default ProfileAvatar
