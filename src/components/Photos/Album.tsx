import React, { useEffect, memo, FC, useCallback} from 'react';
//import { makeStyles } from "@material-ui/core/styles";
import PhotoGallery from '../Common/PhotoGallery';
import { Typography, Breadcrumbs, Link } from '@material-ui/core';
import { getAlbum} from '../../redux/photos_reducer'
// import { useTheme } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next';
import Skeleton from '@material-ui/lab/Skeleton';
import { NavLink, useParams} from 'react-router-dom'
import { AppStateType } from '../../redux/redux_store';

// const useStyles = makeStyles((theme) => ({

// }));

type PropsType = {
}

const Album: FC<PropsType> = memo((props: PropsType) => {

  const album = useSelector((state: AppStateType) => state.photos.album)
  const albums = useSelector((state: AppStateType) => state.photos.albums)
  const albumPhotos = useSelector((state: AppStateType) => state.photos.albumPhotos)

  const dispatch = useDispatch()

  //const classes = useStyles();
  //const theme = useTheme();
  //const bigTileHeight = useMediaQuery(theme.breakpoints.up('sm'));
  const { t } = useTranslation();
 // const [showAllAlbums, setShowAllAlbums] = useState(false)
  //const [preparedPhotos, setPreparedPhotos] = useState(null)
  const params: any = useParams()
  const { id, albumId } = params

  const loadAlbums = useCallback(() => {
    dispatch(getAlbum(albumId))
  }, [])

  useEffect(() => {
    loadAlbums()
  }, [loadAlbums])
  

  let albumInAlbumsArray = albums.filter(album => album.id === albumId)[0]
  
  let albumName = !album ? <Skeleton variant='text' /> : (album && album.name)
  if(album && (albumId === album.id)) {
    albumName = albumName
  } else if(albumInAlbumsArray) {
    albumName = albumInAlbumsArray.name
  } else {
    albumName = <Skeleton variant='text' width={160} />
  }

  return (
    <div>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link color="inherit" component={NavLink} to={`/${id}/albums`} >
          {t('All albums')}
        </Link>
        <Typography color="textPrimary">{albumName}</Typography>
      </Breadcrumbs>
      <br/>

      { album && (albumId === album.id) ?
        <div
          style={{
            minWidth: albumPhotos.length > 0 ? 200 : 0
          }}
        >
          <PhotoGallery
          // @ts-ignore
            grid={true}
            columnsCount={4}
            place={`albumId=${albumId}`}
            editMode={false}
            images={albumPhotos}
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
    </div>
  )
})

export default Album