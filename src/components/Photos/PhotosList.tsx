import React, { useEffect } from 'react';
import PhotoGallery from '../Common/PhotoGallery';
import { getPhotos } from '../../redux/photos_reducer'
//import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Skeleton from '@material-ui/lab/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserId } from '../../redux/auth_selectors';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppStateType } from '../../redux/redux_store';
import { getProfileId } from '../../redux/profile_selectors';
import Preloader from '../Common/Preloader/Preloader';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

const PhotosList: React.FC = React.memo(props => {
  //const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const totalPhotosCount = useSelector((state: AppStateType) => state.photos.totalPhotosCount)
  const photos = useSelector((state: AppStateType) => state.photos.photos)
  const photosAreLoaded = useSelector((state: AppStateType) => state.photos.photosAreLoaded)
  const profileId = useSelector(getProfileId)
  const currentUserId = useSelector(getCurrentUserId)!

  useEffect(() => {
    if(!photosAreLoaded && currentUserId) {
      dispatch(getPhotos(currentUserId, 20))
    }
  }, [photosAreLoaded, currentUserId, dispatch])

  useEffect(() => {
    return () => {
    }
  }, [photos])

  const loadMorePhotos = () => {
    //console.log('loadMorePhotos')
    const lastPhotoTimestamp = photos[photos.length -1].timestamp
    //if(currentUserId) {
      dispatch(getPhotos(currentUserId, 20, lastPhotoTimestamp))
    //}
  }

  if(totalPhotosCount === null) {
    return null
  }

  const unloadedPhotosCount = totalPhotosCount - photos.length

  return (
    <div>
      <InfiniteScroll
        dataLength={photos.length}
        next={loadMorePhotos}
        hasMore={Boolean(unloadedPhotosCount)}
        loader={
          <p style={{ textAlign: 'center' }}>
            <Preloader />
          </p>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b><DoneOutlineIcon /> {t('You have seen it all')}</b>
          </p>
        }

      >
        {
          photosAreLoaded ?
          <div style={{ minWidth: photos.length > 0 ? 200 : 0 }}>
            
            <PhotoGallery
              // @ts-ignore
              grid={true}
              columnsCount={4}
              place={`profileId=${profileId}`}
              editMode={false}
              images={photos}
              spacing={1}
              imageBorderRadius={2}
            />
          </div>
          :
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            {[1, 2, 3, 4].map(el => {
              return <Skeleton animation='pulse' width={'24.5%'} height={120} variant="rect"/>
            })}
          </div>
        }
      </InfiniteScroll>
    </div>
  )
})

export default PhotosList