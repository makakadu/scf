import React, { useEffect } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {
  Link,
  useHistory,
  useLocation,
  useParams,
  NavLink
} from "react-router-dom";
import { Modal, ClickAwayListener, Paper, CircularProgress, CardHeader, Avatar, IconButton, Divider } from '@material-ui/core';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { useStyles } from './PhotoViewerStyles'
import queryString from 'query-string'
import { getPostPhotos, getProfilePhotosForViewer, getAlbumPhotos, cleanViewerPhotos } from '../../redux/photos_reducer'
import {baseUrl} from '../../api/api'
import MaterialLink from '@material-ui/core/Link'
import moment from 'moment'

const PhotoViewer = React.memo(props => {
  const {photos = [], photosAreLoaded, getPostPhotos, getProfilePhotosForViewer, getAlbumPhotos, cleanViewerPhotos} = props
  
  let history = useHistory();
  //let params = useParams();
  let location = useLocation();
  let classes = useStyles();

  let parsedQueryString = queryString.parse(location.search)
  let currentId = parsedQueryString.photoId
  let postId = parsedQueryString.postId
  let profileId = parsedQueryString.profileId
  let albumId = parsedQueryString.albumId
  
  useEffect(() => {
    cleanViewerPhotos()
    if(postId) {
      getPostPhotos(postId)
    } else if(profileId) {
      getProfilePhotosForViewer(profileId, 100)
    } else {
      getAlbumPhotos(albumId)
    }

    return () => cleanViewerPhotos()
  }, [])

  let state = location.state
  
  let viewedPhotosCount
  if(state) {  // state можно передавать дальше, в нём можно хранить количество просмотренных фото, с помощью этого числа легко вернуться на страницу, которая находится под PhotoViewer
    viewedPhotosCount = state.viewedPhotosCount ? state.viewedPhotosCount : -1
  }

  let currentPhoto = photos.filter(photo => photo.id === currentId)[0]
  let currentSrc = currentPhoto && currentPhoto.src

  let currentPhotoIndex
  photos.forEach((photo, index) => {
    if(photo.id === currentId) currentPhotoIndex = index
  })

  let backgroundPath = location.pathname.split('?')[0]
  let photosSource
  
  if(postId) {
    photosSource = `postId=${postId}`
  } else if(profileId) {
    photosSource = `profileId=${profileId}`
  } else {
    photosSource = `albumId=${albumId}`
  }

  let close = e => {
    e.stopPropagation()
    let stateExist = false
    if(location.state) {
      stateExist = location.state.lolkek
    } else {
      stateExist = false
    }

    if(!stateExist) { // Если вход на страницу был произведён через скопированную ссылку, то стейта(state) не будет, поэтому при закрытии нужно создать новую запись в истории и перейти туда, только так можно закрыть просмотр фото
      history.push(location.pathname) 
    } else {
      history.go(viewedPhotosCount)
    }
  }
  
  let creatorLink = currentPhoto && (currentPhoto.creator && `/profile/${currentPhoto.creator.id}`)

  return (
    <Modal
      open={true}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 1200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ClickAwayListener onClickAway={close} >
          <Paper className={classes.photoViewerContainer} >
            <div className={classes.photoViewer}>
              { photosAreLoaded ?
                <>
                  { photos.length > 1 &&
                    <div className={classes.arrowContainer}>
                      <Link
                        to={{
                          pathname: `${backgroundPath}`,
                          search: `?photoId=${(photos[currentPhotoIndex - 1] || photos[photos.length - 1]).id}&${photosSource}`,
                          state: { 
                            lolkek: location.state && location.state.lolkek,
                            viewedPhotosCount: viewedPhotosCount - 1
                          }
                        }}
                        className={classes.arrow}
                      >
                        <ArrowBackIosIcon />
                      </Link>
                    </div>
                  }
                  
                  <div
                    style={{
                      display: 'flex'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: 700,
                          height: 600,
                          backgroundImage: `url(${currentSrc})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundSize: 'contain'
                        }}
                      />
                      <MaterialLink
                        color='inherit'
                        component={NavLink}
                        to={`/profile/${currentPhoto.creator.id}/albums/${currentPhoto.album.id}`}
                      >
                        <div>
                          {currentPhoto.album.name}
                        </div>
                      </MaterialLink>
                    </div>

                    <div
                      style={{
                        width: 250,
                        height: 600
                      }}
                    >
                      <CardHeader
                        title={
                          <MaterialLink
                            color='inherit'
                            component={NavLink}
                            to={creatorLink}
                            children={currentPhoto.creator.name}
                          />
                        }
                        subheader={moment(parseInt(currentPhoto.timestamp)).format("DD MMMM YYYY")}
                        avatar={
                          <IconButton
                            style={{padding: 0, overflow: 'hidden'}}
                            component={NavLink}
                            to={creatorLink}
                            children={
                              <Avatar 
                                aria-label="recipe" 
                                //className={classes.avatar}
                                src={`${baseUrl}/images/${currentPhoto.creator.avatar}`}
                              />
                            }
                          />
                        }
                      />
                      <Divider />
                    </div>
                  </div>

                  { photos.length > 1 && 
                    <div className={classes.arrowContainer}>
                      <Link
                        to={{
                          pathname: `${backgroundPath}`,
                          search: `?photoId=${(photos[currentPhotoIndex + 1] || photos[0]).id}&${photosSource}`,
                          state: { 
                            lolkek: location.state && location.state.lolkek,
                            viewedPhotosCount: viewedPhotosCount - 1
                          }
                        }}
                        className={classes.arrow}
                      >
                        <ArrowForwardIosIcon />
                      </Link>
                    
                    </div>
                  }
                </>
                :
                <div
                  style={{
                    width: 700,
                    height: 600,
                  }}
                >
                  <CircularProgress />
                </div>
              }
            </div>

          </Paper>
        </ClickAwayListener>
      </div>
        
    </Modal >
  );
})

let mapStateToProps = state => {
  return {
    photos: state.photos.viewerPhotos,
    photosAreLoaded: state.photos.viewerPhotosAreLoaded,
  }
}

let functions = {
  getPostPhotos,
  getProfilePhotosForViewer,
  getAlbumPhotos,
  cleanViewerPhotos
}

export default compose(
  connect(mapStateToProps, functions),
)(PhotoViewer);