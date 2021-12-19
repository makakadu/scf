import React, {useState, useEffect, useRef} from 'react'
import { makeStyles } from "@material-ui/core/styles"
import { Link, useLocation } from 'react-router-dom'
import Preloader from '../Common/Preloader/Preloader'
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

let glBorderRadius = 0
let glEditMode = false
let glSelectMode = false
let glPlace = null

const NewPhotosTile = React.memo((props) => {
  const {place, imageBorderRadius, editMode, images, spacing, onRemove, columnsCount, selectMode, onSelect, onClick} = props
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const classes = useStyles();
  glBorderRadius = imageBorderRadius
  glEditMode = editMode
  glSelectMode = selectMode
  glPlace = place
  // let count = 0

  // const lastHeight = useRef(null)
  // const photos = useRef([])
  let location = useLocation();
  // const [selectedPhotos, setSelectedPhotos] = useState([])
  // const [imageChangingCount, setImageChangingCount] = useState(0)
  const gallery = useRef(null)

  const createGridPhoto = (photo) =>  {
    let gridPhoto = {
      img: photo.src,
      id: photo.id,
      width: photo.width,
      height: photo.height,
      checked: false,
      isLoading: false,
      isEmpty: false
    }
    return gridPhoto
  }

  const createLoadingPhoto = () =>  {
    let loadingPhoto = {
      img: null,
      id: null,
      width: null,
      height: null,
      checked: false,
      isLoading: true,
      isEmpty: false
    }
    return loadingPhoto
  }

  const createEmptyPhoto = () =>  {
    let emptyPhoto = {
      img: null,
      id: null,
      width: null,
      height: null,
      checked: false,
      isLoading: false,
      isEmpty: true
    }
    return emptyPhoto
  }
  
  useEffect(() => {
    let arr = []
    images.forEach(photo => {
      if(photo.src) {
        arr.push(createGridPhoto(photo))
      } else {
        arr.push(createLoadingPhoto(photo))
      }
    })
    setGridPhotos(arr)
    setPhotosLoaded(true)
  }, [images])

  const [gridPhotos, setGridPhotos] = useState([])
  //console.log(gridPhotos)
  let readyPhotos = null

  if(photosLoaded) {
    const rows = []
    const rowsCount = Math.ceil(gridPhotos.length / columnsCount)
    
    for(let i = 0; i < rowsCount; i++) {
      rows.push({ photos: [] })
    }
    let currentRow = 0
    let currentPhotoInRow = 0
    gridPhotos.forEach(photo => {
      if(currentPhotoInRow === columnsCount) {
        currentRow++
        currentPhotoInRow = 0
      }
      rows[currentRow].photos.push(photo)
      currentPhotoInRow++
    })
    
    const spacingsInRow = spacing * (columnsCount - 1)
    const sp = spacingsInRow / columnsCount
    const photoWidth = (100 / columnsCount) - sp

    rows.forEach(row => {
      if(row.photos.length < columnsCount) {
        let difference = columnsCount - row.photos.length
        while(difference > 0) {
          let emptyPhoto = createEmptyPhoto()
          row.photos.push(emptyPhoto)
          difference--
        }
      }
    })

    return (
      <div style={{ position: 'relative'}}>
        { rows.map(row => {
          return (
            <div
              className={row}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: `${spacing}%`,
                position: 'relative'
              }}
            >
              {row.photos.map((photo, index) => {      
                
                const alignByWidth = (photo.width / photo.height) > 1.5
                const heightBigger = photo.height > photo.width
                const photoHasSquareShape = photo.height === photo.width
                let width = '100%'
                let height = 'auto'
                if(!alignByWidth) {
                  height = '100%'
                  width = null
                }
                
                return (
                  <div
                    style={{
                      width: `${photoWidth}%`,
                      paddingTop: `${photoWidth / 1.5}%`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      borderRadius: imageBorderRadius,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Link
                        to={{
                          pathname: `${location.pathname}`,
                          search: `?photoId=${photo.id}&${glPlace}`,
                          state: { 
                            lolkek: true
                          }
                        }}
                        color='primary'
                        style={{
                          position: 'relative'
                        }}
                      >
                        <img
                          width={'100%'}
                          src={photo.img} 
                        />
                      </Link>
                    </div>

                    { !photo.isLoading && !photo.isEmpty && <Buttons onRemove={() => onRemove(photo.img)}/> }

                    { photo.isLoading && 
                      <div className={ classes.isLoading } >
                        <Preloader />
                      </div>
                    }

                    {/* photo.img && selectMode &&
                      <SelectButton
                        onClick={() => {
                          if(photo.checked) {
                            let lol = selectedPhotos.filter(photo2 => {
                              return photo2 !== photo.img
                            })
                            setSelectedPhotos(lol)
                            photo.checked = false
                          } else {
                            photo.checked = true
                            setSelectedPhotos([...selectedPhotos, photo.img])
                          }
                          onSelect(photo.img)
                        }}
                        isChecked={photo.checked}
                      />
                      */}

                  {/* !glSelectMode && photo.id && <LinkToViewer id={photo.id} allPhotos={gridPhotos} /> */}
                  </div>
                )
              })}
            </div>
          )})
        }

      </div>
    )
  }

  return <div ref={gallery}>{readyPhotos}</div>
})

const Buttons = (props) => {
  let classes = useStyles()

  return (
    <div
      style={{
        position: 'absolute', 
        right: 2,
        top: 2, 
        cursor: 'pointer',
      }}
      
      children={
        <div className={classes.buttons}>
          <DragIndicatorIcon fontSize='medium' />
          <DeleteIcon fontSize='medium' onClick={props.onRemove} />
        </div>
      }
    />
  )
}

const useStyles = makeStyles((theme) => ({
  isLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: 'rgb(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: props => props.imageBorderRadius,
  },
  buttons: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: theme.palette.common.halfTransparentPaper,
    //width: 24,
    //height: 24,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center'
  },
  selectPhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: theme.palette.common.halfTransparentPaper,
    width: 35,
    height: 35,
    cursor: 'pointer',
    borderRadius: 100,
  },
  withTwoPhotos: {
    borderRadius: props => props.imageBorderRadius,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  columnGallery: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative'
  },
  rowGallery: {
    width: '100%', 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative'
  },
  columnWrapper: {
    display: 'flex',
    flexDirection: 'column',
    //justifyContent: 'space-between',
    position: 'relative',
  }, 
  rowWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: `100%`,
    position: 'relative'
  }
}));

export default NewPhotosTile