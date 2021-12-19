import React, {useState, useEffect, useRef} from 'react';
import Avatar from "@material-ui/core/Avatar";
import {useTranslation} from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux'
import { useStyles } from './CommentStyles';
import { usePrevious } from '../../../hooks/hooks';
import SimpleText from '../../Common/SimpleText';
import { ClickAwayListener, Divider, Link, MenuItem, MenuList, Paper, Popper, Tooltip, Typography } from '@material-ui/core';
import classNames from 'classnames';
import NewComment from '../NewComment';
import moment from 'moment'
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@material-ui/icons';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { getReplies } from '../../../redux/profile_posts_reducer'
import { getCurrentUserId, getCurrentUserPicture } from '../../../redux/auth_selectors'
import Preloader from '../../Common/Preloader/Preloader';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { createCommentReaction, deleteComment, deleteCommentReaction, editCommentReaction, editPostComment, restoreComment } from '../../../redux/profile_posts_reducer'
import { nFormatter } from '../../../helper/helperFunctions.js'
import { NavLink } from 'react-router-dom';
import { baseUrl } from '../../../api/api';

const Comment = React.memo(props => {
  const {
    postId,
    postCreatorId,
    commentData,
    currentUserReaction,
    isReply,
    commentingIsDisabled,
    replies,
    handleRespondClick,
    userIsAuthenticated
  } = props

  const classes = useStyles({isReply: isReply});
  const { t } = useTranslation();
  const [showReplyField, setShowReplyField] = useState(false);
  const [showReplies, setShowReplies] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(false)
  const dispatch = useDispatch()
  const currentUserId = useSelector(getCurrentUserId)
  const currentUserPicture = useSelector(getCurrentUserPicture)
  let newCommentCreatorPicture = `${baseUrl}/images/for-photos/${currentUserPicture}`
  let creatorPicture = `${baseUrl}/images/for-photos/${commentData.creator.picture}`
  const isOwnPost = currentUserId === postCreatorId
  const isOwnComment = currentUserId === commentData.creator.id
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoreError, setRestoreError] = useState('')
  const [isReacting, setIsReacting] = useState(0)
  const [replied, setReplied] = useState(commentData)
  const [editMode, setEditMode] = useState(false)
  const [repliesAreLoading, setRepliesAreLoading] = useState(false)
  const [focusTrigger, triggerFocus] = useState(false)
  const prevCommentingIsDisabled = usePrevious(commentingIsDisabled);

  const onRespondToReplyClick = (comment) => {
    setReplied(comment)
    setShowReplyField(true)
    triggerFocus(prev => !prev)
  }

  const handleCommentDelete = () => {
    setIsDeleting(true)
    dispatch(deleteComment(commentData.id, postId, commentData.rootId))
      .then(
        (response) => {
          setMenuAnchor(null)
          setIsDeleting(false)
        },
        (err) => {
          setMenuAnchor(null)
          setIsDeleting(false)
        }
      )
  }

  const handleCommentRestore = () => {
    setIsRestoring(true)
    dispatch(restoreComment(commentData.id, postId, commentData.rootId))
    .then(
      (response) => {
        setIsRestoring(false)
      },
      (err) => {
        setRestoreError('Не удалось восстановить комментарий')
        setTimeout(() => setRestoreError(''), 3000)
        setIsRestoring(false)
      }
    )
  }

  const reversedReplies = replies ? [...replies].reverse() : []

  useEffect(() => { // Естественно срабатывает в начале
    if(prevCommentingIsDisabled !== commentingIsDisabled) { // Если комментарии включаются или выключаются, то убираются поля для добавления ответов. Но чтобы не выполнять тело этого if при монтировании
      setShowReplyField(false) // проверяем изменилось ли свойство commentingIsDisabled, если не изменилось, то значит код не будет выполнен при монтировании
    }
  }, [commentingIsDisabled])

  let matched = commentData.reactionsCount.filter((element) => {
    return element.type === 1
  })

  let likesInfo = commentData.reactionsCount.find(element => element.type === 1)
  let likesCount = nFormatter(likesInfo ? likesInfo.count : 0)

  let dislikesInfo = commentData.reactionsCount.find(element => element.type === 2)
  let dislikesCount = nFormatter(dislikesInfo ? dislikesInfo.count : 0)

  let likedByCurrentUser = commentData.requesterReaction && commentData.requesterReaction.type === 1
  let dislikedByCurrentUser = commentData.requesterReaction && commentData.requesterReaction.type === 2

  const handleRepliesLoad = () => {
    if(commentData.repliesCount > replies.length) {
      const lastReply = commentData.replies[commentData.replies.length - 1]
      const offsetId = lastReply ? lastReply.id : null
      setRepliesAreLoading(true)
      dispatch(getReplies(currentUserId, postId, commentData.id, offsetId, 3))
        .then(
          () => setRepliesAreLoading(false),
          () => setRepliesAreLoading(false)
        )
    }
  }

  const handleShowReplies = () => {
    if(showReplies) {
      return
    }
    setShowReplies(true)
    setRepliesAreLoading(true)
    if(commentData.repliesCount > replies.length && replies.length === 0) {
      dispatch(getReplies(currentUserId, postId, commentData.id, null, 2))
        .then(
          () => setRepliesAreLoading(false),
          () => setRepliesAreLoading(false)
        )
    }
  }

  let reactionPreloaderTimeout = null

  const beforeReacting = (type) => {
    setIsReacting(type)
  }

  const onReactionClickEnd = () => {
    clearTimeout(reactionPreloaderTimeout)
    setTimeout(() => {
      setIsReacting(0)
    }, 400)
  }

  const handleReactionClick = (type) => {
    if(!userIsAuthenticated) {
      return
    }
    let commentId = commentData.id

    if(currentUserReaction) {
      let currentUserReactionId = currentUserReaction.id

      if(type === currentUserReaction.type) {
        beforeReacting(type)
        dispatch(deleteCommentReaction(postId, commentId, commentData.rootId, currentUserReactionId))
          .then(onReactionClickEnd, onReactionClickEnd)
      }
      else if(type !== currentUserReaction.type) {
        beforeReacting(type)
        dispatch(editCommentReaction(postId, commentId, commentData.rootId, currentUserReactionId, type))
          .then(onReactionClickEnd, onReactionClickEnd)
      }
    }
    else {
      beforeReacting(type)
      dispatch(createCommentReaction(postId, commentId, commentData.rootId, type))
        .then(onReactionClickEnd, onReactionClickEnd)
    }
  }

  const repliedFullName = `${replied.creator.firstName} ${replied.creator.lastName}`
  const creatorFullName = `${commentData.creator.firstName} ${commentData.creator.lastName}`

  const handleClickAwayMenu = () => {
    if(menuAnchor) {
      setMenuAnchor(null)
    }
  }

  const menu = (
    <ClickAwayListener onClickAway={ handleClickAwayMenu } >
      <div>
        <div onClick={ (e) => setMenuAnchor(e.target) } style={{cursor: 'pointer'}}><MoreHorizIcon style={{display: 'block'}} /></div>

        <Popper
          open={Boolean(menuAnchor)}
          anchorEl={menuAnchor}
          //placement={placement}
          transition
        >
          <Paper style={{border: '1px solid gray'}}>
            <MenuList>

              { !isOwnComment &&
              <MenuItem disableRipple >
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                  <div>{t('Complain')}</div>
                </div>
              </MenuItem>
              }

              { isOwnComment &&
              <MenuItem onClick={ () => { setEditMode(true); setMenuAnchor(null) }} disableRipple >
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                  <div>{t('Edit')}</div>
                </div>
              </MenuItem>
              }

              {(isOwnPost || isOwnComment) &&
              <MenuItem onClick={handleCommentDelete} disableRipple >
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                  <div>{t('Delete')}</div>
                  <div style={{width: 40, display: 'flex', flexDirection: 'row-reverse'}} >{ isDeleting && <Preloader size={20} color='secondary' /> }</div>
                </div>
              </MenuItem>
              }

            </MenuList>
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  )

  const likeButton = (
    <>
      <div style={{cursor: 'pointer' }} onClick={ () => handleReactionClick(1) }> 
        { likedByCurrentUser
          ? <ThumbUp fontSize='small' style={{display: 'block'}} />
          : <ThumbUpOutlined fontSize='small' style={{display: 'block'}} />
        }
      </div>
      { isReacting === 1 && <div style={{ position: 'absolute', left: -4 }}><Preloader color='secondary' size={24} /></div> }
    </>
  )

  const dislikeButton = (
    <>
      <div style={{cursor: 'pointer' }} onClick={ () => handleReactionClick(2) } > 
        { dislikedByCurrentUser
          ? <ThumbDown fontSize='small' style={{display: 'block'}} />
          : <ThumbDownOutlined fontSize='small' style={{display: 'block'}} />
        }
      </div>
      { isReacting === 2 && <div style={{ position: 'absolute', left: -4 }} ><Preloader color='secondary' size={24} /></div> }
    </>
  )

  let repliedCreatorName = ''
  if(commentData.replied && commentData.replied.id !== commentData.rootId) {
    let repliedCreator = commentData.replied.creator
    repliedCreatorName = `${repliedCreator.firstName} ${repliedCreator.lastName}`
  }

  const [showReplied, setShowReplied] = useState(false)

  const onEditSave = (text, attachmentId) => {
    return dispatch(editPostComment(postId, commentData.id, text, attachmentId, commentData.rootId))
  }

  const commentContent = (
    <div className={classes.content} >
      <div className={classes.commentText} style={{ display: 'flex'}}>
        { repliedCreatorName &&
          <>
            <div
              onMouseEnter={ () => setShowReplied(true)}
              onMouseLeave={ () => setShowReplied(false)}
              style={{display: 'flex' }}
            >
              <div style={{ cursor: 'pointer' }} >
                <SimpleText color='textSecondary'>{repliedCreatorName}</SimpleText>
              </div>
              { showReplied &&
                <Paper style={{position: 'absolute', border: '1px solid gray', padding: 10, bottom: 25, minWidth: 100}}>
                  { commentData.replied.text}
                </Paper>
              }
              <span>,&nbsp;</span>
            </div>
          </>
        }
        
        <SimpleText>{commentData.text}</SimpleText>
      </div>

      { commentData.attachment && 
        <div style={{marginTop: commentData.text ? 8 : 0, maxWidth: 150}} >
          { commentData.attachment && 
            <img
              style={{width: '100%'}}
              src={`http://localhost:8001/images/for-photos/${commentData.attachment.src}`}
            />
          }
        </div>
      }
    </div>
  )

  const commentBody = (
    <div className={ classes.commentBody } >

      <div
        className={ classes.header }
        style={{ display: 'flex'}}
      >
        <div>
          <NavLink
            to={`/i/${commentData.creator.username}`}
            className={classes.creatorNameLink}
          >
            <Typography variant='subtitle2'>
              { creatorFullName }
            </Typography>
          </NavLink>
        </div>
        
        <div style={{marginLeft: 8}}><SimpleText color='textSecondary' >{moment(commentData.timestamp).format("DD MMMM HH:mm")}</SimpleText></div>
        {/*moment(commentData.timestamp).format("DD MMMM HH:mm")*/}

        <div style={{marginLeft: 'auto'}} >
          { !editMode && userIsAuthenticated && menu }
        </div>
      </div>

      { editMode
        ? <NewComment
            editMode={editMode}
            setEditMode={setEditMode}
            defaultValue={commentData.text}
            currentAttachment={commentData.attachment}
            onEditSave={onEditSave}
            autoFocus={true}
          />
        : commentContent
      }

    </div>
  )

  if(commentData.deleted) {
    return (
      <div style={{ marginLeft: 56, padding: 16 }} >
        <div style={{  }}>
          <SimpleText color='textSecondary' >
            {t('Comment was removed')}
          </SimpleText>
          <span style={{ cursor: 'pointer'}} onClick={handleCommentRestore} ><SimpleText>{t('Restore')}</SimpleText></span>
        </div>
        { isRestoring && <div><Preloader size={30} color='secondary' /></div> }
        { restoreError && <span style={{ color: 'red' }}>{ restoreError }</span>}
      </div>
    )
  }

  const underComment = (
    <div className={classes.underComment}>
      {/*<Divider orientation='vertical' flexItem className={classes.underCommentDivider} /> */}

      <div style={{ display: 'flex', alignItems: 'center' }} >

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }} >
          { likeButton }
          { <span style={{ marginLeft: 4, marginRight: 8 }} >{ likesCount > 0 && likesCount } </span> }
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}  >
          { dislikeButton }
          { <span style={{ marginLeft: 4 }} >{ dislikesCount > 0 && dislikesCount } </span> }
        </div>

      </div>

      {!commentingIsDisabled && userIsAuthenticated &&
        <>
          <div style={{ margin: '0 8px' }} />
          <div>
            <span
              className={classNames(classes.replyButton, classes.replyButtonActive)}
              onClick={() => {
                if(handleRespondClick) {
                  console.log('OLOLO')
                  handleRespondClick(commentData)
                } else {
                  setShowReplyField(true)
                  triggerFocus(prev => !prev)
                  setReplied(commentData)
                }
              }}
            >
              <div style={{ textTransform: 'uppercase' }} >{t('Reply')}</div>
            </span>
          </div>
        </>
      }

      { editMode && <div style={{cursor: 'pointer', marginLeft: 'auto', textTransform: 'uppercase'}} onClick={() => setEditMode(false)} >{t('Cancel editing')}</div>}

    </div>
  )

  const repliesContainer = (
    <div className={classes.repliesContainer} >

      { replies.length === 0 && commentData.repliesCount > 0 &&
        <div className={ classes.toggleRepliesVisibilityButton } onClick={handleShowReplies} >
            <div><ArrowDropDownIcon style={{ display: 'block'}}/></div>
            <div><SimpleText >{`${t('Show replies')} (${commentData.repliesCount})`}</SimpleText></div>
            { repliesAreLoading && <div style={{ marginLeft: 16 }} ><Preloader size={24} /></div> }
          </div>
      }
      { replies.length > 0 &&
        <>
          { commentData.repliesCount > replies.length && replies.length > 0 &&
            <div
              className={ classes.loadMoreRepliesButton }
              onClick={ handleRepliesLoad }
            >
              <div ><SimpleText >{t('Load previous replies')}</SimpleText></div>
              { repliesAreLoading && <div style={{ marginLeft: 16 }} ><Preloader size={20} /></div> }
            </div>
          }
          { commentData.repliesCount > replies.length && replies.length === 0 &&
            <Preloader color='secondary' />
          }

          { reversedReplies.map(reply => {
            return <Comment
              key={reply.id}
              postId={postId}
              postCreatorId={postCreatorId}
              commentData={reply}
              currentUserReaction={reply.requesterReaction}
              replies={[]}
              isReply={true}
              commentingIsDisabled={commentingIsDisabled}
              inList={false}
              handleRespondClick={onRespondToReplyClick}
              setReplied={setReplied}
              userIsAuthenticated={userIsAuthenticated}
            />
            })
          }
        </>
      }
      { showReplyField && !commentingIsDisabled && userIsAuthenticated &&
        <div className={classes.newReplyFieldContainer}  >
          { replied && replied.rootId &&
            <div style={{ marginLeft: 56, marginTop: 8 }} ><SimpleText color='textSecondary'> ответ для {repliedFullName}</SimpleText></div>
          }
          <NewComment
            creatorPicture={newCommentCreatorPicture}
            postId={postId}
            rootId={replied.rootId ? replied.rootId : replied.id}
            repliedId={replied.id}
            autoFocus={true}
            focusTrigger={ focusTrigger }
            setShowReplyField={ setShowReplyField }
            //setCommentWithReplyFieldId={setCommentWithReplyFieldId}
          />
        </div>
      }

    </div>
  )

  return (
    <>
    <div className={classes.container} style={{ padding: `0 ${isReply ? '0px' : '0px'}` }}>

      <div className={classes.comment}>
        <Avatar
          component={Link}
          to={`/i/${commentData.creator.username}`}
          className={classes.creatorAvatar}
          src={creatorPicture}
        />

        <div style={{ flexGrow: 1}} >
          { commentBody }
          { underComment }
        </div>
      </div>

      { !isReply && repliesContainer }

    </div>
  </>
  )
})

export default Comment