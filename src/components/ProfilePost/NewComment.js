import React, {useState, useEffect, useRef} from 'react';

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from 'react-i18next';
// import './Styles.css';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles, Popper, TextField, useTheme } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import Preloader from '../Common/Preloader/Preloader';
import { usePrevious } from '../../hooks/hooks';
import SentimentSatisfiedRoundedIcon from '@material-ui/icons/SentimentSatisfiedRounded';
import EmojiPicker from '../Common/EmojiPicker';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { createComment, createCommentPhoto, getCommentPhoto } from '../../redux/profile_posts_reducer';

const useStyles = makeStyles((theme) => ({
  createCommentButton: {
    marginLeft: 8
  },
  newCommentFieldTextSize: theme.typography.body2,
  newCommentFieldContainer: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  newCommentField: {
    display: 'flex',
    alignItems: 'flex-start'
  },
}))

const NewComment = React.memo(props => {

  const { postId, rootId, repliedId, avatarSize, autoFocus, value, focusTrigger, setShowReplyField, editMode, setEditMode, onEditSave, defaultValue, currentAttachment, creatorPicture } = props;

  //console.log(currentAttachment)

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const theme = useTheme()

  const openImageExplorer = () => {
    //setShowPhotoPicker(true)
    photoInput.current.click()
  }
  const openVideoExplorer = () => videoInput.current.click()
  const openAudioExplorer = () => audioInput.current.click()

  const photoInput = React.useRef(null)
  const videoInput = React.useRef(null)
  const audioInput = React.useRef(null)

  const [attachment, setAttachment] = useState(currentAttachment)

  const width = avatarSize ? avatarSize : 40
  const height = avatarSize ? avatarSize : 40

  const [text, setText] = useState(editMode ? (defaultValue ? defaultValue : '') : '')

  const changeText = (e) => {
    setText(e.target.value)
  }

  const ref1 = useRef(null)

  const [commentIsCreating, setCommentIsCreating] = useState(false)
  const [commentIsEditing, setCommentIsEditing] = useState(false)
  const [error, setError] = useState("")

  const prevFocusTrigger = usePrevious(focusTrigger)

  useEffect(() => {
    if(prevFocusTrigger !== null && focusTrigger !== prevFocusTrigger) {
      inputRef.current.focus()
    }
  }, [focusTrigger])

  //console.log('Rerender new comment')

  // useEffect(() => {
  //   /*useEffect сработает только один раз в случае изменения commentIsCreating на true, то есть не будет такого, что пользователь отправит сразу 2 или больше комментариев
  //   Можно добиться такого же эффекта и с redux, только для этого нужно, чтобы в state пост содержал свойство commentIsCreating 
  //   Если же можно сделать всё с помощью ref, который будет содержать ссылку на button, после нажатия будет изменено свойство disabled на true и нельзя будет на неё нажать ещё раз. Но всё равно
  //   без async и await не обойтись.
  //   Также есть такой подход: https://stackoverflow.com/questions/35315872/reactjs-prevent-multiple-times-button-press/49642037#49642037. Но либо я не понял, либо он не рабочий*/

  // Вообще можно просто использовать useState и всё, после нажатия кнопки делаем её неактивной через setCommentIsCreating, этот сеттер изменит commentIsCreating мгновенно, пользователь не успеет нажать 2
  // раза на неактивную кнопку

  //   if(commentIsCreating) {
  //     dispatch(createComment(postId, text, null, null))
  //       .then((response) => {
  //         setCommentIsCreating(false)
  //         setText('')
  //         setError(false)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         setCommentIsCreating(false)
  //         setError(true)
  //       })
  //   }
  // }, [commentIsCreating])

  let handleImageUpload = async (event) => {
    
    const file = event.target.files[0]
    
    if(file) {

      const {type} = file
      
      if(!type) return

      if((type && type.endsWith('jpeg')) || (type.endsWith('png')) || (type.endsWith('jpg'))) {
        try {
          let response = await dispatch(createCommentPhoto(file))
          if(response.status === 201) {
            response = await dispatch(getCommentPhoto(response.data.id))
            if(response.status === 200) {
              console.log(response.data.photo)
              setAttachment(response.data.photo)
            }
          }
        }
        catch(err) {
          console.log(err)
        }
        
      }
      photoInput.current.value = ''
    }
    
    // if(files) {
    //   for (var prop in files) {
    //     let file = files[prop]
    //     const {type} = file
        
    //     if(!type) continue

    //     if((type && type.endsWith('jpeg')) || (type.endsWith('png')) || (type.endsWith('jpg'))) {
    //       dispatch(addPostPhoto(file, 0))
    //     }
    //   }
    //   //history.push(`/profile/${match.params.userId}/newphotos`)
    //   photoInput.current.value = '' // Очищаем input, чтобы можно было добавить идентичное изображение
    // }
  }

  const handleSubmit = () => {
    if(text.length > 200) {
      setError('Превышено количество символов')
      return
    } else if (commentIsCreating) {
      return
    }

    let attachmentId = attachment ? attachment.id : null

    if(editMode) {
      setCommentIsEditing(true)
      onEditSave(text, attachmentId)
        .then((response) => {
          setCommentIsEditing(false)
          setText('')
          setError(false)
          if(setShowReplyField) {
            setShowReplyField(false)
          }
          setEditMode(false)
        })
        // .catch((error) => {
        //   console.log(error)
        //   setCommentIsCreating(false)
        //   inputRef.current.focus()
        //   setError("Невозможно создать комментарий")
        // })
    }
    else {
      setCommentIsCreating(true)

      dispatch(createComment(postId, text, attachmentId, rootId, repliedId))
        .then((response) => {
          setCommentIsCreating(false)
          setText('')
          setError(false)
          if(setShowReplyField) {
            setShowReplyField(false)
          }
          setAttachment(null)
        })
        .catch((error) => {
          console.log(error)
          setCommentIsCreating(false)
          inputRef.current.focus()
          setError("Невозможно создать комментарий")
        })
    }
  }

  const onEnterPress = (event) => {
    // console.log(event.key)
    // console.log(event.shiftKey)
    if(event.key === 'Enter' && event.shiftKey) {
      return
    }
    else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // onChange не сработает и enter не попадёт в поле
      handleSubmit()
    }
  }

  const inputRef = useRef(null)

  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = React.useState(false);
  const emojiPickerPopperAnchor = useRef(null)

  const onEmojiSelect = e => {
    setText(prev => prev += e.native)
    //textFieldRef.current = textFieldRef.current + e.native
  }

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const handleEmojiPickerClose = () => setShowEmojiPicker(false);

  let emojiPopper = (
    <div>
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
    </div>
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

  let pickPhoto = (
    <div>
      <AddAPhotoIcon
        onClick={openImageExplorer}
        style={{
          cursor: 'pointer',
          color: !showPhotoPicker
            ? theme.palette.action.disabled : null
        }}
        //ref={emojiPickerPopperAnchor}
      />
    </div>
  )

  const adornments = (
    <div style={{display: 'flex' }}>
      <div style={{marginRight: 8}} >{pickEmoji}</div>
      <div >{pickPhoto}</div>
    </div>
  )

  return (
    <div>
    <div className={classes.newCommentField} >
      { !editMode && <Avatar
          style={{ marginRight: 8, width: width, height: height }}
          src={creatorPicture}
        />
      }

      <TextField
        onBlur={ () => setError("") }
        onKeyPress={ onEnterPress }
        autoFocus={ autoFocus}
        ref={ref1}
        inputRef={ inputRef }
        size='small'
        placeholder={t('Write comment')}
        multiline
        fullWidth
        variant={ editMode ? "standard" : "outlined" }
        value={text}
        //delaultValue={'aaaaaaa'}
        onChange={ changeText }
        error={Boolean(error)}
        helperText={error ? error : ""}
        InputProps={{ // Только так в TextField можно изменить размер текста, шрифт и т.д.. 
          classes: { input: classes.newCommentFieldTextSize, },
          style: { borderRadius: '10px' },
          endAdornment: adornments
        }}
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )}
      />

        <input
          accept='image/*'
          style={{ display: 'none' }}
          id='post-comment-photo-input'
          //multiple
          type='file'
          onChange={(event) => {
            handleImageUpload(event)
            // setShowAddPhotoDialog(false)
          }}
          ref={photoInput}
        />

      <div style={{position: 'relative'}}>
        <IconButton
          style={{width: 40, height: 40}} 
          disabled={ commentIsCreating || commentIsEditing || (!text.length && !Boolean(attachment)) } 
          className={classes.createCommentButton}
          onClick={ handleSubmit }
        >
          <SendIcon />
        </IconButton>

        { (commentIsCreating || commentIsEditing) &&
          <div style={{position: 'absolute', top: 0, right: 0}}>
            <Preloader size={40} />
          </div>
        }
      </div>
    </div>

    { attachment &&
      <div style={{marginLeft: editMode ? 0 : 56, marginTop: 8, maxWidth: 150}}>
        <img
          style={{width: '100%'}}
          src={`http://localhost:8001/images/for-photos/${attachment.versions ? attachment.versions[2] : attachment.src}`} />
        </div>
    }

    </div>
  )

})

export default NewComment




