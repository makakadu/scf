import React from 'react'
import {useTranslation} from 'react-i18next';
import { useTheme } from '@material-ui/core/styles'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import $ from 'jquery'
import { ClickAwayListener, Paper } from '@material-ui/core';

const EmojiPicker = ({onSelect, onClose, position, style}) => {
  const show = true
	const { t } = useTranslation();
	const theme = useTheme()

	const onKeyPress = (e) => {
    console.log(e.keyCode + '__' + e.which)
    var code = e.keyCode ? e.keyCode : e.which;
    if(code === 27 && show) { // проверка на disabled нужна на всякий случай. Если что, то disabled - это состояние кнопки 'Отправить'
      onClose()
    }
  }

  const [kek, setKek] = React.useState(false)
  const container = React.useRef(null)

  React.useEffect(() => {
    setTimeout(() => {
      if(container.current) container.current.focus()
    }, 100) // Задержка сделана из-за того, что без неё страница возвращается на самый вверх
  }, [show])

  let realPosition = position === 'top' ? 'bottom' : 'top'

	if(!show) return null

	return (
    <div
        tabIndex="1" // нужно для того, чтобы div фокусировался
        ref={container}
        
      
      onKeyPress={() => console.log('kek')}
      onKeyDown={onKeyPress}
      style={{
        //padding: 10,
        outline: 'none'
      }}
    >
      <ClickAwayListener onClickAway={onClose} >
        <Picker
          
          onSelect={onSelect}
          theme={theme.palette.type}
          set='google'
          i18n={
            {
              search: t('Search'),
              categories: {
                search: t('Search results'),
                recent: t('Recent'),
                smileys: t('Smileys & Emotion'),
                people: t('People & Body'),
                nature: t('Animals & Nature'),
                foods: t('Food & Drink'),
                activity: t('Activity'),
                places: t('Travel & Places'),
                objects: t('Objects'),
                symbols: t('Symbols'),
                flags: t('Flags'),
                custom: t('Custom'),
              },
              categorieslabel: t('Emoji categories'),
              skintones: {
                1: t('Default Skin Tone'),
                2: t('Light Skin Tone'),
                3: t('Medium-Light Skin Tone'),
                4: t('Medium Skin Tone'),
                5: t('Medium-Dark Skin Tone'),
                6: t('Dark Skin Tone'),
              },
            }
          }
          style={style}
        />
      </ClickAwayListener>
    </div>
	)
}

export default EmojiPicker
