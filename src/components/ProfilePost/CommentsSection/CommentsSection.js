import React, {useState, useEffect } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { useStyles } from './CommentsSectionStyles.js'
import Comment from '../Comment/Comment.js'
import NewComment from '../NewComment.js'
import SimpleText from '../../Common/SimpleText.jsx'
// import { useTranslation } from 'react-i18next'
import { getComments, createComment } from '../../../redux/profile_posts_reducer'
import { getCurrentUserId, getCurrentUserPicture } from '../../../redux/auth_selectors'
import Preloader from '../../Common/Preloader/Preloader.jsx'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getPostComments } from '../../../redux/profile_posts_selectors'
import { useTranslation } from 'react-i18next'
import { baseUrl } from '../../../api/api'

const CommentsSection = React.memo(props => {

  console.log('KEKEKE')

  const { postId, commentsCount, commentingIsDisabled, showNewCommentField, userIsAuthenticated, postCreatorId } = props
  const classes = useStyles()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentUserId = useSelector(getCurrentUserId)
  const comments = useSelector(state => getPostComments(state, postId))
  const picture = useSelector(getCurrentUserPicture)
  const currentUserPicture = `${baseUrl}/images/for-photos/${picture}`

  const [qwe, setQwe] = useState(false)
  const [commentsAreHidden, setCommentsAreHidden] = useState(false)
  const [commentWithReplyFieldId, setCommentWithReplyFieldId] = useState(null) // ID комментария или ответа под которым открыто поле для ответа
  const reversed = [...comments].reverse()

  useEffect(() => {
    if(commentsCount && !comments.length) {
      dispatch(getComments(currentUserId, postId, null, 2, 'DESC'))
    }
  }, [commentsCount, comments.length, currentUserId, postId, dispatch]) // React ругает на то, что используемые внутри переменные не находятся в массиве зависимостей. Я их туда добавил, но я сделал так
  // что dispatch(getComments) сработает только при условии, которое будет true только один раз

  const commentsLength = comments.length

  useEffect(() => {
    setQwe(false)
  }, [commentsLength])

  const onShowMoreClick = () => {
    setQwe(true)
    // let offsetId = null
    // if(commentsSorting === 'DESC') {
    //   offsetId = comments[comments.length - 1].id
    // } else {
    //   offsetId = offsetCommentId ? offsetCommentId : comments[comments.length - 1].id
    // }
    
    let offsetId = comments[comments.length - 1].id

    dispatch(getComments(currentUserId, postId, offsetId, 5, 'DESC'))
  }

  const [anchor, setAnchor] = useState(null)

  const createCommentCallback = async (text) => {
    return dispatch(createComment(postId, text, null, null))
  }

  const renderNewCommentField = (
    <div className={classes.stickyNewCommentFieldContainer} >
      <NewComment onCreate={createCommentCallback} postId={postId} autoFocus={false} creatorPicture={currentUserPicture} />
    </div>
  )

  const renderShowMoreButton = (
    <div style={{cursor: 'pointer', display: 'flex', }} onClick={onShowMoreClick} >
      <SimpleText > {t('Load previous')} </SimpleText>
      { qwe &&
        <div style={{marginLeft: 8}} ><Preloader color='secondary' size={15} /></div>
      }
    </div>
  )

  const toggleCommentsVisibilityButton = (
    <div
      className={classes.toggleCommentsVisibilityButton}
      style={{ marginLeft: 'auto' }}
      onClick={() => setCommentsAreHidden(prev => !prev)}
    >
      { commentsAreHidden 
        ? <KeyboardArrowDownIcon style={{  marginRight: 8 }} />
        : <KeyboardArrowUpIcon style={{  marginRight: 8 }} />
      }
    </div>
  )

  const header = (
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
      { comments && commentsCount > comments.length && !commentsAreHidden &&
        renderShowMoreButton
      }
      { toggleCommentsVisibilityButton }
    </div>
  )

  return (
    <div className={ classes.commentsSection } >
      { commentsCount > 0 && header }

      <div style={{ display: commentsAreHidden ? 'none' : 'block' }}>
        { comments.length > 0 &&
          reversed.map((comment, index) => {
            return (
              <Comment
                key={comment.id}
                postId={postId}
                postCreatorId={postCreatorId}
                commentData={comment}
                currentUserReaction={comment.requesterReaction}
                replies={comment.replies}
                isReply={false}
                commentingIsDisabled={commentingIsDisabled}
                inList={true}
                commentWithReplyFieldId={commentWithReplyFieldId}
                setCommentWithReplyFieldId={setCommentWithReplyFieldId}
                userIsAuthenticated={userIsAuthenticated}
              />
            )
          })
        }

        { commentsCount > 0 && !comments.length && <Preloader color='secondary' size={40} /> }

        {/* !commentingIsDisabled && showNewCommentField && renderNewCommentField */}
        { userIsAuthenticated && !commentingIsDisabled && renderNewCommentField } 
      </div>

  </div>
  )
})


export default CommentsSection




