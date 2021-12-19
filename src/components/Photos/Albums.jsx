import React, {useState, useEffect } from 'react';
//import { makeStyles } from "@material-ui/core/styles";
// import PhotoGallery from '../Common/PhotoGallery';
import { GridList, GridListTile, GridListTileBar, Typography, Button, Breadcrumbs } from '@material-ui/core';
import {
  //getAlbums, 
  // getAlbumPhotos, 
  // cleanNewPhotos
} from '../../redux/photos_reducer'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  // useDispatch,
  useSelector
} from 'react-redux'
//import {compose} from 'redux'
import {baseUrl} from '../../api/api'
import {useTranslation} from 'react-i18next';
import Skeleton from '@material-ui/lab/Skeleton';
//import { profileAPI } from '../../api/api'
import { NavLink, useParams } from 'react-router-dom'
import { getCurrentUserId } from '../../redux/auth_selectors';

const Albums = React.memo(props => {
  //console.log('Albums')
  //const classes = useStyles();
  const theme = useTheme();
  const bigTileHeight = useMediaQuery(theme.breakpoints.up('sm'));
  const { t } = useTranslation();
  const [showAllAlbums, setShowAllAlbums] = useState(false)
  //const location = useLocation()
  // const dispatch = useDispatch()
  const albums = useSelector(state => state.photos.albums)
  const albumsAreLoaded = useSelector(state => state.photos.albumsAreLoaded)
  //const profileId = useSelector(state => state.profile.profile.id)
  // const currentUserId = useSelector(getCurrentUserId)
  const newPhotos = useSelector(state => state.photos.newPhotos)

  useEffect(() => {
    //dispatch(getAlbums(currentUserId))
    return () => {
      //dispatch(cleanNewPhotos())
    }
  }, [])
  
  let albumsArr = showAllAlbums ? albums : [albums[0], albums[1], albums[2]]
  console.log(newPhotos)

  // const renderNewPhotos = (
  //   newPhotos &&
  //     <div>
  //       <PhotoGallery
  //         grid={true}
  //         columnsCount={4}
  //         place={`albumId=${currentUserId}-loaded`}
  //         editMode={false}
  //         images={newPhotos}
  //         spacing={1}
  //         imageBorderRadius={2}
  //       />
  //       <div
  //         style={{
  //           display: 'flex',
  //           justifyContent: 'center'
  //         }}
  //       >
  //         <Button variant='outlined' >Add to album</Button>
  //       </div>
  //     </div>
  // )

  const renderAlbums = (
    <GridList 
      cellHeight={bigTileHeight ? 180 : 120}
      cols={3}
      //className={classes.gridList}
    >
      {albumsAreLoaded && albums.length && albumsArr.map((tile) => {
        let cover = tile.cover ? `${baseUrl}/images/${tile.cover}` : `${baseUrl}/images/standard/camera (1).png`

        return (
          <GridListTile
            component={NavLink}
            to={`/${useParams().id}/albums/${tile.id}`}
            key={cover}
          >
            <img
              src={cover}
              alt={tile.name}
            />
            <GridListTileBar
              title={tile.name}
              subtitle={<span>{t('Count')}: {tile.photosCount}</span>}
            />
          </GridListTile>
        )
      })}
    </GridList>
  )

  const renderSkeleton = (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      {[1, 2, 3].map(el => {
        return <Skeleton animation='pulse' width={'32.9%'} height={150} variant="rect"/>
      })}
    </div>
  )

  return (
    <div>
      {/*<Breadcrumbs separator="›" aria-label="breadcrumb">
        {newPhotos.length ?
          <Link 
            color="inherit" 
            component={NavLink} 
            to={`/profile/${profileId}/albums`}
            onClick={() => dispatch(cleanNewPhotos())}
          >
            {t('All albums')}
          </Link>
          :
          <Typography color="textPrimary">{t('All albums')}</Typography>
        }
        {newPhotos.length && <Typography color="textPrimary">Новые фотографии</Typography>}
      </Breadcrumbs>*/}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Typography color="textPrimary">{t('All albums')}</Typography>
      </Breadcrumbs>
      <br/>

      {/*newPhotos.length ? renderNewPhotos : (albumsAreLoaded ? renderAlbums : renderSkeleton)*/}
      {albumsAreLoaded ? renderAlbums : renderSkeleton}
      {!showAllAlbums && (albums.length > 3) &&
        <Button
          variant='outlined'
          style={{width: '100%', marginTop: 16}}
          onClick={() => setShowAllAlbums(prev => !prev)}
        >
          {t('Show all')}
        </Button>
      }
  
    </div>
  )
})

export default Albums