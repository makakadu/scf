import React, { useEffect, useRef, useState} from 'react'

import IconButton from "@material-ui/core/IconButton"
import AddReactionIcon from '@mui/icons-material/AddReaction'
import classNames from 'classnames'
import { useStyles } from './ReactionsStyles.js';
import './ReactionAnimationStyles.css'
import ReactionsList from '../Common/ReactionsList.js'
import reactionsData from '../Common/ReactionsData.ts'
import { Fade, Popper } from '@material-ui/core';
//import { useSelector } from 'react-redux';
//import { getCurrentUserPostReaction } from '../../../../redux/profile_selectors.ts';
import Preloader from '../Common/Preloader/Preloader.jsx';
import { usePrevious } from '../../hooks/hooks.js';

const Reactions = React.memo(props => {
  const {currentUserReaction, onCreateReaction, onEditReaction, onDeleteReaction} = props

  const classes = useStyles();
  const [animation, setAnimation] = useState(false);
  const showPopperTimeout = useRef(null);
  const hidePopperTimeout = useRef(null);
  const [anchor, setAnchor] = useState(null)
  const [reactionIsDeleting, setReactionIsDeleting] = useState(false)
  const [reactionIsCreating, setReactionIsCreating] = useState(false)

  const toAnimate = () => {
    if(!animation) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 500);
    }
  }

  let reactionType = currentUserReaction ? currentUserReaction.type : null

  const prevCurrentUserReaction = usePrevious(currentUserReaction)

  useEffect(() => {
    setReactionIsDeleting(false)
    setReactionIsCreating(false)
  }, [currentUserReaction])

  useEffect(() => {
    if(currentUserReaction && prevCurrentUserReaction && (currentUserReaction.type !== prevCurrentUserReaction.type)) {
      toAnimate()
    }
    else if(currentUserReaction && prevCurrentUserReaction === null) { // Если предыдущей реакции нет, то делаем анимацию. Но здесь важно обратить внимание на === null, это
      toAnimate() // важно для того, чтобы анимация не срабатывала при загрузке страницы, а только после создания или изменения реакции.
      // эсли бы prevCurrentUserReaction был undefined, то это значило бы, что страница только что загрузилась и prevCurrentUserReaction еще не получил значение, а это значит
      // что инфы о предыдущей реакции нет, есть только о текущей. Анимировать нужно только эсли текущая реакция отличается от предыдущей, либо если предыдущая === null, а текущая
      // НЕ null и НЕ undefined
    }
  }, [setReactionIsDeleting, setReactionIsCreating, currentUserReaction, prevCurrentUserReaction, toAnimate])

  const stopPopperHiding = () => {
    clearTimeout(hidePopperTimeout.current)
  }

  const openPopper = (e) => {
    let target = e.currentTarget
    clearTimeout(hidePopperTimeout.current)
    
    if(!Boolean(anchor)) {
      showPopperTimeout.current = setTimeout(() => {
        setAnchor(target)
      }, 400);
    }
  }

  const closePopper = (e) => {
    if(!anchor) {
      clearTimeout(showPopperTimeout.current)
    }
    hidePopperTimeout.current = setTimeout(() => {
      setAnchor(null)
    }, 400);
  }

  const deleteReaction = () => {
    if(currentUserReaction) {
      setReactionIsDeleting(true)
      onDeleteReaction()
    }
  }

  const createReaction = (reactionNumber) => {
    if(!currentUserReaction) {
      setReactionIsCreating(true)
      onCreateReaction(reactionNumber)
        .then(
          () => {
            //toAnimate()
            setReactionIsCreating(false)
          },
          () => setReactionIsCreating(false)
        )
    }
  }

  const editReaction = (reactionNumber) => {
    if(currentUserReaction) {
      setReactionIsCreating(true)
      onEditReaction(reactionNumber)
        .then(() => toAnimate())
    }
  }  

  const onButtonClick = () => {
    clearTimeout( showPopperTimeout.current )
    setAnchor(null)
    if(!currentUserReaction) {
      createReaction(1)
    } else {
      deleteReaction()
    }
  }

  const onReactionClick = reactionNumber => {
    setAnchor(null)
    if(currentUserReaction) {
      editReaction(reactionNumber)
    } else {
      createReaction(reactionNumber)
    }
  }

  const renderLoader = (
    (reactionIsCreating || reactionIsDeleting) &&
      <div style={{position: 'absolute', top: 0}}>
        <Preloader size={48} />
      </div>
  )

  return (
    <div onMouseLeave={ closePopper } >

      <div onMouseEnter={ openPopper } style={{ position: 'relative' }} >
        <IconButton onClick={ onButtonClick } disableRipple>
          { reactionType
            ? <div className={ classes.currentReactionImageContainer } >
                <img
                  className={ classNames((animation ? `shake` : null), classes.currentReactionImage) }
                  width='30'
                  height='30'
                  src={ reactionsData[reactionType - 1].src }
                  alt={ reactionsData[reactionType - 1].emotion }
                />
              </div>
            :
            <AddReactionIcon style={ {fontSize: '24px'} }/>
          }
        </IconButton>
        
        { renderLoader }
      </div>

      <Popper
        open={ Boolean(anchor) }
        anchorEl={ anchor }
        placement='top'
        modifiers={{ offset: { enabled: true, offset: '40, 0' } }}
        transition
        onMouseEnter={ stopPopperHiding }
      >
        {({ TransitionProps }) => (
          <Fade { ...TransitionProps } timeout={ 200 }>
            <ReactionsList onReactionClick={ onReactionClick } />
          </Fade>
        )}
      </Popper>

    </div>
  )
})

export default Reactions;