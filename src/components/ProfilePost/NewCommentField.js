import React, {useState, useEffect, useRef} from 'react';

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from 'react-i18next';
import './Styles.css';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles, Popper, TextField } from '@material-ui/core';
import SentimentSatisfiedRoundedIcon from '@material-ui/icons/SentimentSatisfiedRounded';
import { useDispatch } from 'react-redux'
import Preloader from '../../Common/Preloader/Preloader';
import EmojiPicker from '../../Common/EmojiPicker';

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

  const { postId, rootId, repliedId, avatarSize, autoFocus, value, setCommentWithReplyFieldId } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const width = avatarSize ? avatarSize : 40
  const height = avatarSize ? avatarSize : 40

  const minLength = ((value ? value + ', ' : '') + '').length

  const [text, setText] = useState('')

  const changeText = (e) => {
    console.log(e.target.value)
    setText(e.target.value)
  }

  const ref1 = useRef(null)

  const [commentIsCreating, setCommentIsCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    console.log(ref1)
  }, [])

  console.log('Rerender new comment')

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

  const handleCreate = () => {
    if(text.length > 200) {
      setError('Превышено количество символов')
      return
    }
    setCommentIsCreating(true)

    dispatch(createComment(postId, text, rootId, repliedId))
      .then((response) => {
        setCommentIsCreating(false)
        setText('')
        setError(false)
        setCommentWithReplyFieldId(null)
      })
      .catch((error) => {
        console.log(error)
        setCommentIsCreating(false)
        setError("Невозможно создать комментарий")
      })
  }

  const onEnterPress = (event) => {
    console.log(event.key)
    console.log(event.shiftKey)
    if(event.key === 'Enter' && event.shiftKey) {
      return
    }
    else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // onChange не сработает и enter не попадёт в поле
      handleCreate()
    }
  }



  return (
    <div className={classes.newCommentField} >
      <Avatar
        style={{ marginRight: 8, width: width, height: height }}
        src="https://bipbap.ru/wp-content/uploads/2019/05/86ae0b2400c92d333751c8d9a9ae68e4.png"/
      >

      <TextField
        onKeyPress={ onEnterPress }
        autoFocus={ autoFocus}
        ref={ref1}
        size='small'
        placeholder={t('Write comment')}
        multiline
        fullWidth
        variant="outlined"
        value={text}
        delaultValue={'aaaaaaa'}
        onChange={ changeText }
        error={Boolean(error)}
        helperText={error ? error : ""}
        InputProps={{ // Только так в TextField можно изменить размер текста, шрифт и т.д.. 
          classes: { input: classes.newCommentFieldTextSize, },
          style: { borderRadius: '10px' },
          endAdornment: endAdornment
        }}
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )}
      />

      <div style={{position: 'relative'}}>
        <IconButton
          style={{width: 40, height: 40}} 
          disabled={ commentIsCreating || !text.length } 
          className={classes.createCommentButton} onClick={ handleCreate }
        >
          <SendIcon />
        </IconButton>
        { commentIsCreating &&
          <div style={{position: 'absolute', top: 0, right: 0}}>
            <Preloader size={40} />
          </div>
        }
      </div>
    </div>
  )

})

export default NewComment




