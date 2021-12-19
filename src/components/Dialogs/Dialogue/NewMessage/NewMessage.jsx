import React, {useRef, useState} from 'react'
//import {connect} from 'react-redux'
//import styles from './NewMessageForm.module.css'
import {Field, reduxForm} from "redux-form"
import {TextArea} from '../../../FormControls/FormControls.js'
import {makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import {useTranslation} from 'react-i18next';
import SendIcon from '@material-ui/icons/Send';
import { useTheme } from '@material-ui/core/styles'
import SentimentSatisfiedRoundedIcon from '@material-ui/icons/SentimentSatisfiedRounded';
import EmojiPicker from '../../../Common/EmojiPicker'
import {change} from 'redux-form'
import {connect} from 'react-redux'
import {compose} from 'redux'
import $ from 'jquery'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Popper, Paper, MenuList, MenuItem, Grow, Collapse, Fade, Zoom, Tooltip, withWidth } from '@material-ui/core';
import PhotoCameraRoundedIcon from '@material-ui/icons/PhotoCameraRounded';
import TheatersRoundedIcon from '@material-ui/icons/TheatersRounded';
import AudiotrackRoundedIcon from '@material-ui/icons/AudiotrackRounded';
import TooltipWithTheme from '../../../Common/TooltipWithTheme.jsx';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 50,
    //borderRadius: '10em',
    padding: 0,
    //marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.background.default}`
  },
  form: {
    flexGrow: 1,
    //marginRight: theme.spacing(1)
  },
  field: {
    width: '100%',
  },
  resize: theme.typography.body2,
  attachContainer: {
    ...theme.styles.flexCenter,
    width: theme.spacing(6)
  }, 
  attachFileType: {
    ...theme.styles.twoDimensionsCentering,
    width: theme.spacing(4),
    height: theme.spacing(5)
  }
}))

const NewMessage = ({ onSubmit, isLoaded, isAcceptsMessages, change, width }) => {
  const theme = useTheme()
  let classes = useStyles()
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true)

  const onTextChange = data => {
    let message = null
    if(data.message) {
    data.message = data.message.replace(new RegExp('\r?\n','g', '↵'), '')
      message = data.message
    }
		
    if(!message) {
      if(!disabled) setDisabled(true)
      return
    }
    if(disabled) setDisabled(false)

    const statusSymbolsLimit = 100
    if(message.length > statusSymbolsLimit) {
      data.message = message.substring(0, statusSymbolsLimit)
    } else {
      data.message = message
    }
  }

  const form = useRef(null)

  const onEnterPress = (e) => {
    var code = e.keyCode ? e.keyCode : e.which;
    if(code === 13 && !disabled) { // проверка на disabled нужна на всякий случай. Если что, то disabled - это состояние кнопки 'Отправить'
      form.current.submit()
    }
  }

  const onSend = messageData => {
    if(!messageData.message) { // проверка содержимого формы перед отправкой вверх
      return
    }
    onSubmit(messageData)
  }

  const handleFormSubmit = () => {
    if(form.current) form.current.submit()
  }
  
  const onEmojiSelect = e => {
    let field = $('#new_message_field')
    let fieldValue = field.val()
    change('sendMessage', 'message', `${fieldValue}${e.native}`) // change не работает в компоненте, который завёрнут в redux form
    //postField.val()
  }

  const [openAttachFileTooltip, setOpenAttachFileTooltip] = React.useState(false);

  const handleCloseAttachFileTooltip = () => {
    setOpenAttachFileTooltip(false);
  };

  const handleOpenAttachFileTooltip = () => {
    setOpenAttachFileTooltip(true);
  };

  const handleToggleAttachFileTooltip = () => {
    setOpenAttachFileTooltip((prevOpen) => !prevOpen);
  };

  const renderFileTypes = (
    <div>
      <div className={ classes.attachFileType }><PhotoCameraRoundedIcon /></div>
      <div className={ classes.attachFileType }><TheatersRoundedIcon /></div>
      <div className={ classes.attachFileType }><AudiotrackRoundedIcon /></div>
    </div>
  )

  const renderAttachIcon = <AttachFileIcon />

  const renderAttachFileButton = (
    <IconButton
      onClick={handleToggleAttachFileTooltip}
      size='medium'
    >
      {renderAttachIcon}
    </IconButton>
  )

  const isMobile = width === 'xs' || width === 'sm'

  const renderAttachFileTooltip = (
    <TooltipWithTheme
      open={ openAttachFileTooltip }
      onClose={ handleCloseAttachFileTooltip } // Срабатывает когда время исчезать или, например, при "внешнем" нажатии(click away), если используется ClickAwayListener
      onOpen={ handleOpenAttachFileTooltip } // срабатывает при наведении на дочерний элемент
      TransitionComponent={ Fade } // тип анимации появления и исчезновения
      TransitionProps={{ timeout: 0 }} // время появления/исчезновения, то есть время за которое элемент полностью появится/исчезнет
      enterDelay={ 0 } // задержка появления
      leaveDelay={ 0 } // зарержка исчезновения
      interactive // можно взаимодействовать с ним
      arrow
      title={ renderFileTypes }
      disableHoverListener={isMobile}
      //disableFocusListener
      //disableTouchListener
      PopperProps={{
        disablePortal: true,
      }}
    >
      <div>
        {isMobile ?
          renderAttachFileButton
          :
          <div className={ classes.attachContainer } >
            {renderAttachIcon}
          </div>
        }
      </div>
    </TooltipWithTheme>
  )

  return (
    <div className={ classes.root } >
      { isLoaded &&
        isAcceptsMessages ?
          <>
            {renderAttachFileTooltip}

            <NewMessageForm 
              ref={ form } 
              onEnterPress={ onEnterPress } 
              onSubmit={ onSend } 
              onChange={ onTextChange }
              placeholder={ t('Enter message') }
              onEmojiSelect={ onEmojiSelect }
            />

            <IconButton 
              color='secondary'
              disabled={ disabled }
              onClick={ handleFormSubmit }
              children={ <SendIcon /> }
            />
          </>
        :
        isAcceptsMessages === false && <div>Невозможно отослать сообщение</div>
      }
    </div>
  )
}

const NewMessageForm = reduxForm({ form: 'sendMessage' })(
  ({ onSubmit, error, reset, onEnterPress, placeholder, onEmojiSelect }) => {
    let classes = useStyles()
    const theme = useTheme()

    const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
  
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      setOpen(false);
    };

    const renderEmojiPickerIcon = (
      <SentimentSatisfiedRoundedIcon
        onClick={handleToggle}
        style={{cursor: 'pointer'}}
        ref={anchorRef}
      />
    )

    const renderPopperContainer = (
      <>
        {renderEmojiPickerIcon}

        <Popper
          open={open} 
          anchorEl={anchorRef.current}
          transition
          //disablePortal
          placement='top-end'
          modifiers={{
            offset: { 
              enabled: true,
              offset: '0, 10' // сдвиг
            }
          }}
          style={{
            zIndex: 1 // Чтобы эмоджи были выше чем даты
          }}
        >
          <EmojiPicker
            show={true}
            onSelect={onEmojiSelect}
            onClose={handleClose}
          />
        </Popper>
      </>
    )

    return (
      <form className={classes.form} onKeyPress={onEnterPress}>
        <Field
          autoFocus
          size='small'
          id='new_message_field'
          name="message"
          component={TextArea}
          placeholder={placeholder}
          className={classes.field}
          variant='outlined'
          fontSize={theme.typography.body2.fontSize}
          style={{padding: 3}}
          endAdornment={renderPopperContainer}
        />
      </form>
    )
  } 
)
let mapStateToProps = state => {
  return {
  }
}

let functions = {
  change
}

export default compose(
  connect(mapStateToProps, functions),
  withWidth()
)(NewMessage);
