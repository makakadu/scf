import { Button, Card, CardActions, Checkbox, ClickAwayListener, MenuItem, MenuList, Paper, Popper, TextField, useTheme } from '@material-ui/core'
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPostPhoto, getPostPhoto } from '../../redux/profile_posts_reducer'
import PhotoGallery from '../Common/PhotoGallery'
import { useStyles } from './ProfileStyles'
import AddPhotoDialog from '../Common/AddPhotoDialog'
import { useTranslation } from 'react-i18next'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import LinearProgress from '@material-ui/core/LinearProgress'
import SettingsIcon from '@material-ui/icons/Settings'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import EmojiPicker from '../Common/EmojiPicker'
import SentimentSatisfiedRoundedIcon from '@material-ui/icons/SentimentSatisfiedRounded'

const PostForm = props => {
  const { onSubmit, editMode, setEditMode, text, currentAttachments, commentingIsDisabled, isPublic} = props
  
  const openImageExplorer = () => {
    photoInput.current.click()
  }
  // const openVideoExplorer = () => videoInput.current.click()
  // const openAudioExplorer = () => audioInput.current.click()

  const [attachments, setAttachments] = useState(editMode ? [...currentAttachments] : [])
  const [postText, setPostText] = useState(editMode ? text : '')

  const theme = useTheme()
  const [error, setError] = useState('')
  const photoInput = React.useRef(null)
  // const videoInput = React.useRef(null)
  // const audioInput = React.useRef(null)
  const [addedPhotos, setAddedPhotos] = React.useState([])
  const [showAddPhotoDialog, setShowAddPhotoDialog] = useState(false)
  const dispatch = useDispatch();
  const [images, setImages] = React.useState([])
  const newPostForm = useSelector(state => state.profile.newPostForm)
  // const newPostPhotos = useSelector(state => state.profile.newPostPhotos)
  // const [addedVideosIds, setAddedVideosIds] = React.useState([])
  // const [addedAudiosIds, setAddedAudiosIds] = React.useState([])
  const classes = useStyles({ 'matches800': true })
  const { t } = useTranslation();
  const [progressObjects, setProgressObjects] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [publicCheckboxIsChecked, setPublicCheckboxIsChecked] = useState(editMode ? isPublic : true)
  const [disableComments, setDisableComments] = useState(editMode ? commentingIsDisabled : false)
  const [cleanFieldTrigger, setCleanFieldTrigger] = useState(false)

  //console.log(progress)

  let handleImageUpload = async (event) => {
    const files = event.target.files
    
    const pseudoFiles = [] // Содержит "псевдо" файлы, псевдо файл - это созданный мной объект, где хранится имя, fileId, тип и "реальный" файл. Это сделано для того, чтобы
    // можно было добавлять один и тот же файл и избежать конфликта. Здесь главную роль играет fileId, который является идентификатором файла, а раньше им было имя файла,
    // но имена файлов могут повторяться, поэтому лучше fileId
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      const {type} = file
      
      if(!type) { // Эсли у файла нет типа, то пропукаем его
        continue
      }
      if((type && type.endsWith('jpeg')) || (type.endsWith('png')) || (type.endsWith('jpg'))) { 
        
        let filename = file.name
        let fileId = file.name + Date.now()

        // С помощью setProgress добавляем объект для отслеживания прогресса (progressInfo), имя(filename) ему нужно для того, чтобы показывать для какого файла показан прогресс
        // fileId даётся такой же как и для псевдо файла, чтобы понимать для какого файла создан объект-прогресс(progressInfo)
        setProgressObjects(prev => {
          let progressInfo = {filename, loaded: 0, total: -1, fileId: fileId}
          return [...prev, progressInfo]
        })
        pseudoFiles.push({fileId: fileId, filename, type, realFile: file})
      }
      else { // Эсли формат не подходит, то пропускаем его
        continue
      }
    }
    photoInput.current.value = '' // очищаем input, чтобы можно было добавить тот же файл

    for (let i = 0; i < pseudoFiles.length; i++) { // далее проходимся уже по псевдо файлам
      let pseudoFile = pseudoFiles[i]
      
      try {
        let response = await dispatch(createPostPhoto(pseudoFile.realFile, (progressEvent) => {
          setProgressObjects(prev => {
            let progressInfo = prev.find(progressInfoItem => progressInfoItem.fileId === pseudoFile.fileId)

            if(progressInfo) {
              if(progressInfo.total === -1) { // С самого начала у объекта-прогресса total === -1, я сделал это на всякий случай, вдруг его можно подделать
                progressInfo.total = progressEvent.total // После первого события прогресса ставит реальный total, который предоставляет axios. Больше это условие не выполнится
              }
              progressInfo.loaded = progressEvent.loaded // обновляется при каждом событии прогресса
            }
            return [...prev] // все это происходит в функции, результат которой попадёт в setProgressObjects из useState, поэтому возвращаем значение, которое нужно установить в
            // setProgressObjects. Новый массив приведёт к перерисовке
          })
        }))

        if(response.status === 201) {
          response = await dispatch(getPostPhoto(response.data.id))
          if(response.status === 200) {
            let returnedPhoto = response.data.photo
            let photo = {id: returnedPhoto.id, src: `http://localhost:8001/images/for-photos/${returnedPhoto.versions[2]}`}
            setAttachments(prev => [...prev, photo]) // prev используется из-за того, что эта функция асинхронная, когда она начинает выполняться, то на неё не влияют
            // перерисовки, естественно после перерисовки функция handleImageUpload создаётся заново, но текущая выполняется всё равно и использует данные со своего рендера
          }
        }
      }
      catch(err) {
        console.log(err)
      } 
    }
  }

  const handleSubmit = () => {

    if(isSubmitting || (!postText.length && !attachments.length)) {
      return
    }
    // if(textFieldRef.current === text) {
    //   if(setEditMode) setEditMode(false)
    //   return
    // }
    setIsSubmitting(true)
    console.log(Number(publicCheckboxIsChecked))
    let preparedAttachments = attachments.map(attachment => attachment.id)

    onSubmit(postText, preparedAttachments, Number(publicCheckboxIsChecked), Number(disableComments), null)
      .then(
        () => {
          setAttachments([])
          setIsSubmitting(false)
          setPostText('')
          setCleanFieldTrigger(prev => !prev)
        }
      )
  }

  const onDone = (selectedPhotos) => {
    let srcs = []
    let filteredSelected = []
    selectedPhotos.forEach(photo => {
      let inAddedPhotos = addedPhotos.filter(addedPhoto => photo.id === addedPhoto.id)[0]
      if (!inAddedPhotos) {
        filteredSelected.push(photo)
        srcs.push(photo)
      }
    })
    setImages([...images, ...srcs])
    setAddedPhotos([...addedPhotos, ...filteredSelected])
  }

  const [postSettingsAnchor, setPostSettingsAnchor] = useState(null)

  const handleClickAwayPostSettings = () => {
    if(postSettingsAnchor) {
      setPostSettingsAnchor(null)
    }
  }

  const postSettings = (
    <ClickAwayListener onClickAway={ handleClickAwayPostSettings } >
      <div>
      <div
        onClick={ (e) => setPostSettingsAnchor(e.currentTarget) }
        style={{cursor: 'pointer'}}
      >
        <SettingsIcon style={{display: 'block'}} />
      </div>

      <Popper
        open={Boolean(postSettingsAnchor)}
        anchorEl={postSettingsAnchor}
        placement='top'
        transition
        modifiers={{
          offset: {
            enabled: true,
            offset: '0, 12'
          }
        }}
      >
        <Paper style={{border: '1px solid gray'}}>
          <MenuList dense >

            <MenuItem
              disableRipple
              style={{padding: 0, paddingRight: 8}}
              onClick={e => setPublicCheckboxIsChecked(prev => !prev)}
            >
              <div style={{display: 'flex', alignItems: 'center', }}>
                <Checkbox checked={publicCheckboxIsChecked} />
                <div>{t('Public')}</div>
              </div>
            </MenuItem>

            <MenuItem
              disableRipple
              style={{padding: 0, paddingRight: 8}}
              onClick={e => setDisableComments(prev => !prev)}
            >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Checkbox checked={disableComments} />
                <div>{t('Disable comments')}</div>
              </div>
            </MenuItem>

          </MenuList>
        </Paper>
      </Popper>
      </div>
    </ClickAwayListener>
  )
  
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const emojiPickerPopperAnchor = useRef(null)

  const onEmojiSelect = e => {
    setPostText(prev => prev += e.native)
  }

  const handleOnChange = (e) => {
    setPostText(e.target.value)
  }

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const handleEmojiPickerClose = () => setShowEmojiPicker(false);

  let emojiPopper = (
    <Popper
      open={showEmojiPicker}
      anchorEl={emojiPickerPopperAnchor.current}
      transition
      //disablePortal // если выключить portal, то EmojiPicker будет находится под кнопкой опубликовать и будет прозрачным. Благодаря Portal дочерний компонент может рендериться совсем в другом месте 
      //placement='top-end'
      modifiers={{ offset: { enabled: true, offset: '0, 10' } }}
    >
      <EmojiPicker
        show={true}
        onSelect={onEmojiSelect}
        onClose={handleEmojiPickerClose}
      />
    </Popper>
  )

  let pickEmoji = (
    <div>
      <SentimentSatisfiedRoundedIcon
        onClick={toggleEmojiPicker}
        style={{
          cursor: 'pointer',
          color: !showEmojiPicker
            ? theme.palette.action.disabled : null
        }}
        ref={emojiPickerPopperAnchor}
      />
      { emojiPopper }
    </div>
  )

  return (
    <div style={{ overflow: 'visible' }}>
      <div
        style={{
          padding: '0 8px',
          display: 'flex',
          position: 'relative'
        }}
      >
        <div style={{ width: '100%' }}>
          <TextField
            size='small'
            placeholder={ t('Write something') }
            multiline
            fullWidth
            value={ postText }
            onChange={ handleOnChange }
            InputProps={{
              classes: { input: classes.resize, },
              style: { padding: 6, },
              endAdornment: pickEmoji
            }}
            onFocus={ e => {
              e.currentTarget.setSelectionRange(
                postText.length,
                postText.length
              )}
            }
          />
        </div>

      </div>

      <div style={{ padding: 8}}>

        <div style={{ marginBottom: 8}}>
          { progressObjects.map(e => {
            console.log(e)
            let percents = 0
            
            if(e.total > -1 && e.loaded) {
              percents = Math.floor((e.loaded / e.total) * 100)
            }
            if(percents === 100) {
              return
            }
            return <div style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
              <div style={{ marginRight: 16}} >{e.filename}</div>
              <LinearProgress style={{width: 150, height: 10}} variant="determinate" value={percents} />
            </div>
          })}
        </div>

        <div>
          <PhotoGallery
            images={attachments ? attachments : []}
            editMode={true}
            spacing={1}
            imageBorderRadius={2}
            setAttachments={setAttachments}
          />
        </div>

      </div>

      <CardActions disableSpacing={true} >
        <div className={classes.addMedia}>
          <input
            accept='image/*'
            className={classes.input}
            id='photo-input'
            multiple
            type='file'
            onChange={(event) => {
              handleImageUpload(event)
              //setShowAddPhotoDialog(false)
            }}
            ref={photoInput}
          />
          {/*<input
            accept='video/*'
            className={classes.input}
            id='video-input'
            multiple
            type='file'
            //onChange={handleUploadClick}
            ref={videoInput}
          />
          <input
            accept='audio/*'
            className={classes.input}
            id='audio-input'
            multiple
            type='file'
            //onChange={handleUploadClick}
            ref={audioInput}
          />*/}

          <div style={{marginLeft: 16, display: 'flex', alignItems: 'center'}}>
            <div onClick={openImageExplorer} style={{marginRight: 16, cursor: 'pointer'}}><AddAPhotoIcon /></div>
          </div>

          { showAddPhotoDialog &&
            <AddPhotoDialog
              handleClose={() => setShowAddPhotoDialog(false)}
              onUploadFromStorage={handleImageUpload}
              show={showAddPhotoDialog}
              onDone={onDone}
            />
          }
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <div style={{marginRight: 16}}>{ postSettings }</div>
          { editMode &&
            <Button disabled={ isSubmitting } style={{ marginRight: 16 }} onClick={ () => setEditMode(false) } >
              { t('Cancel') }
            </Button>
          }
          <Button
            variant='contained'
            disabled={isSubmitting || (!postText.length && !attachments.length)}
            disableElevation
            style={{ textTransform: 'none'}}
            onClick={ handleSubmit }
          >
            { editMode ? t('Save') : t('Publicate')}
          </Button>
        </div>
      </CardActions>
      
      { isSubmitting && <LinearProgress /> }

    </div>
  )

}

export default PostForm