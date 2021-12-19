import React, { FC, useState, useEffect, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
//import PhotoGallery from '../Common/PhotoGallery';
import { Paper, Button, Tab, Tabs, Divider, LinearProgress } from '@material-ui/core';
import { addPhoto, cleanNewPhotos } from '../../redux/photos_reducer'
// import { useTheme } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTranslation} from 'react-i18next';
import { NavLink, Route, useHistory, useLocation, useParams } from 'react-router-dom'
import Albums from './Albums';
import PhotosList from './PhotosList';
import Album from './Album';
//import DialogTitleWithCloseButton from '../Common/DialogTitleWithCloseButton';
import { getCurrentUserId } from '../../redux/auth_selectors';
import { useDispatch, useSelector } from 'react-redux';
import NewPhotosTile from './NewPhotosTile';
import { 
  getLoadedPhotosAlbumId, 
  //getProfileId
} from '../../redux/profile_selectors';
import { AppDispatch, AppStateType } from '../../redux/redux_store';

const Photos: FC = React.memo(props => {
  // const profileId = useSelector(getProfileId)
  const loadedPhotosAlbumId = useSelector(getLoadedPhotosAlbumId)!
  const newPhotos = useSelector((state: AppStateType) => state.photos.newPhotos)
  const currentUserId = useSelector(getCurrentUserId)
  const dispatch: AppDispatch = useDispatch();

  const classes = useStyles();
  // const theme = useTheme();
  // const history = useHistory();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const bigTileHeight = useMediaQuery(theme.breakpoints.up('sm'));
  const { t } = useTranslation();
  const location = useLocation()
  const params: any = useParams()
  const [showNewPhotosTab, setShowNewPhotosTab] = useState(false) 
  const photoInput = React.useRef<any>(null)
  const [newPhotosCount, setNewPhotosCount] = useState(0)
  const [triggerUpdating, setTriggerUpdating] = useState(false)
  const loadings = useRef<Array<UploadingPhoto>>([])
  // const [uploadingPhotos, setUploadingPhotos] = useState<Array<UploadingPhoto>>([])

  useEffect(() => {
    //console.log(newPhotos)
  }, [newPhotos])

  type UploadingPhoto = {
    name: string,
    loaded: number,
    total: number,
    error: boolean
  }

  let handleImageUpload = async (event: any) => {
    setShowNewPhotosTab(true)
    const files = event.target.files
    
    if(files) {
      let imageFiles: Array<UploadingPhoto> = []
      for (const prop in files) {
        const file = files[prop]
        const { type, name, size } = file
        if(!type) continue

        if(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg')) {
          imageFiles.push(file)
          const prepared: UploadingPhoto = { name: name, loaded: 0, total: size + 500, error: false }
          //setPhotos2(prev => [...prev, prepared])
          loadings.current.push(prepared)                      // добавляем 500 к весу картинки, потому что кроме картинки будут переданы еще другие данные и весь запрос будет весить больше
        }
      }
      if(newPhotosCount === 0) {
        setNewPhotosCount(imageFiles.length)
      } else {
        setNewPhotosCount(prev => prev + imageFiles.length)
      }

      imageFiles.forEach(file => {
        const options = {
          onUploadProgress: (uploadInfo: any) => {
            let existed = loadings.current.filter(p => p.name === file.name)[0]
            if(existed) {
              existed.total = uploadInfo.total
              existed.loaded = uploadInfo.loaded
              setTriggerUpdating(prev => !prev)
            }
          }
        }
        dispatch(addPhoto(file, '1', loadedPhotosAlbumId, options)).then(
          (response: any) => {
            console.log(response)
          }, (error: any) => {
            loadings.current = loadings.current.filter(l => l.name !== file.name)
            setNewPhotosCount(prev => prev - 1)
          }
        )
        
      })
      photoInput.current!.value = ''                                                                // Очищаем input, чтобы можно было добавить идентичное изображение
    }
  }

  let currentTab = 0
  let path = location.pathname.split('/')[2]
  if(path === 'albums') {
    currentTab = 0
  } else if(path === 'photos') {
    currentTab = 1
  }

  let uploadedPhotosTotalSize = 0
  let uploadedPhotosUploadedSize = 0
  let uploadedPhotosCount = 0
  loadings.current.forEach(l => {
    uploadedPhotosTotalSize += l.total
    uploadedPhotosUploadedSize += l.loaded
    if(l.total === l.loaded) uploadedPhotosCount++
  })
  
  let progress = 0
  if(uploadedPhotosTotalSize !== 0) {
    progress = (uploadedPhotosUploadedSize / uploadedPhotosTotalSize) * 100
  }

  let loadingEnded = uploadedPhotosTotalSize !== 0 && uploadedPhotosTotalSize === uploadedPhotosUploadedSize
  if(loadingEnded) loadings.current = []
  
  const photosUploadingInProgress = Boolean(loadings.current.length)

  if(showNewPhotosTab || newPhotos.length) currentTab = 2
  
  const onTabChange = () => {
    if(newPhotos.length) dispatch(cleanNewPhotos())
    setShowNewPhotosTab(false)
  }

  let arr = []
  newPhotos.forEach(newPhoto => arr.push(newPhoto))

  for(let i = 0; i < (newPhotosCount - newPhotos.length); i++) {
    arr.push({})
  }

  const onInputChange = (event: any) => {
    handleImageUpload(event)
  }

  return (
    <Paper className={ classes.root} >
      <div className={ classes.container}  >
        <div className={ classes.header } >
          <div>
            <Tabs value={ currentTab } aria-label="simple tabs example">
              <Tab
                onClick={onTabChange}
                disabled={currentTab === 0}
                disableRipple
                className={ classes.tab }
                component={NavLink} to={`/${params.id}/albums`}
                label={t('Albums')}
              />
              <Tab
                onClick={onTabChange}
                disabled={currentTab === 1}
                disableRipple
                className={ classes.tab }
                component={NavLink} to={`/${params.id}/photos`}
                label={t('All photos')}
              />
              { (newPhotos.length || showNewPhotosTab) && 
                <Tab
                  disableRipple
                  className={ classes.tab }
                  label={t('New photos')}
                />
              }
            </Tabs>
          </div>

          <div>
            <Route
              exact path={`/:id/(albums|photos)`}
              render={() => {
                return (
                  <div>
                  { photosUploadingInProgress ?
                    <>
                      <div>Загружено <b>{uploadedPhotosCount}</b> фотографий из <b>{loadings.current.length}</b></div>
                      <LinearProgress variant="determinate" value={progress} />
                    </>
                    :                        
                    <>
                      <Button
                        variant='outlined'
                        onClick={() => photoInput.current.click()}
                        style={{ marginRight: 8 }}
                      >
                        {t('Add photo')} 
                      </Button>
                      <Button variant='outlined'> {t('Create album')} </Button>
                    </>
                  }
                  </div>
                )
              }}
            />

            <input
              accept='image/*'
              className={classes.input}
              id='photo-input'
              multiple
              type='file'
              onChange={ onInputChange }
              ref={photoInput}
            />
          </div>
        </div>
        
      </div>

      <Divider />

      { showNewPhotosTab ?
        <div className={ classes.body }>
          <NewPhotosTile
            // @ts-ignore
            columnsCount={4}
            place={`albumId=${currentUserId}-loaded`}
            editMode={false}
            images={arr}
            spacing={1}
            imageBorderRadius={2}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button variant='outlined' >Add to album</Button>
          </div>
        </div>
        :
        <div className={ classes.body }>
          <Route
            exact path={`/:id/albums`}
            render={() => {
              return (
                <TabPanel value={currentTab} index={0}>
                  <Albums />
                </TabPanel>
              )
            }}
          />

          <Route
            exact path={`/:id/photos`}
            render={() => {
              return (
                <TabPanel value={currentTab} index={1}>
                  <PhotosList />
                </TabPanel>
              )
            }}
          />

          <Route
            exact path={`/:id/albums/:albumId`}
            render={() => <Album />}
          />
        </div>
      }
    </Paper>
  )
})

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}

    </div>
  );
}

const useStyles = makeStyles((theme) => {
  const spacing = theme.spacing(2)
  return {
    root: {
      width: '100%'
    },
    container: {
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      padding: `0 ${spacing}px`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      padding: spacing
    },
    skeletonMedia: {
      height: 20
    },
    actions: {
      width: 30,
      height: 30,
      margin: 10
    },
    tab: {
      minWidth: 100
    },
    embeddedPostMedia: {
      margin: `0 ${spacing}px`, 
      border: '1px solid rgb(255, 255, 255, 0.12)', 
      borderRadius: 3, 
      paddingBottom: spacing
    },
    input: {
      display: 'none'
    },
  }
});

export default Photos