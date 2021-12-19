import React, {useCallback, useRef, useState} from 'react'

import AddReactionIcon from '@mui/icons-material/AddReaction'
import classNames from 'classnames'
import { useStyles } from './ReactionsStyles.js';
import '../ReactionAnimationStyles.css'
import { Fade, Popper } from '@material-ui/core';
import reactionsData from '../../../../Common/ReactionsData.ts';
import ReactionsList from '../../../Common/ReactionsList.js';

const Reactions = React.memo(props => {

  const {reactionType, onReaction, onDeleteReaction} = props

  const classes = useStyles();
  const [animation, setAnimation] = useState(false);
  const showPopperTimeout = useRef(null);
  const hidePopperTimeout = useRef(null);
  const [anchor, setAnchor] = useState(null)
  
  const toAnimate = useCallback(() => {
    if(!animation) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 500);
    }
  }, [])

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
    if(reactionType) {
      onDeleteReaction()
      setAnchor(null)
    }
  }

  const onButtonClick = () => {
    clearTimeout( showPopperTimeout.current )
    setAnchor(null)
    if(!reactionType) {
      onReaction(1)
      toAnimate()
    } else {
      deleteReaction()
    }
  }

  const onReactionClick = reactionNumber => {
    setAnchor(null)
    onReaction(reactionNumber)
    toAnimate()
  }

  return (
    <div onMouseLeave={ closePopper }  >

      <div onMouseEnter={ openPopper } style={{display: 'flex', alignItems: 'center'}} >
        { reactionType
          ? <div className={ classes.currentReactionImageContainer } >
            <div
              onClick={ onButtonClick }
              className={ classNames((animation ? `shake` : null), classes.currentReactionImage) }
              style={{
                backgroundImage: `url(${reactionsData[reactionType - 1].src})`,
              }}
            />
          </div>
          : 
          <div className={ classes.currentReactionImageContainer } >
            <AddReactionIcon
              onClick={ onButtonClick }
              style={ {fontSize: '16px', cursor: 'pointer'} }
            />
          </div>
        }
      </div>

      <Popper
        open={ Boolean(anchor) }
        anchorEl={ anchor }
        placement='top'
        modifiers={{
          offset: { enabled: true, offset: '40, 0' }
        }}
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