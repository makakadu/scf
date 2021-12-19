import React, {useEffect, useState} from 'react';
import Avatar from "@material-ui/core/Avatar";
import PhotoGallery from '../Common/PhotoGallery.js';
import ShareIcon from "@material-ui/icons/Share";
import {NavLink} from 'react-router-dom'
import moment from 'moment'
import {baseUrl, imagesStorage} from '../../api/api'
import {useTranslation} from 'react-i18next';
import YesCancelDialog from '../Common/YesCancelDialog.js';
import { Paper, MenuList, Typography, DialogTitle, Dialog, DialogContent, DialogActions, MenuItem, Menu, IconButton, Button, CardMedia, CardHeader, Divider, CardContent, Modal, Card, CardActions } from '@material-ui/core';
import { editPostReaction, deletePostReaction, createPostReaction } from '../../redux/profile_posts_reducer'
// import './Styles.css';
import { useStyles } from './PostStyles';
import SimpleText from '../Common/SimpleText.jsx';
import AutoTogglingPopper from '../Common/AutoTogglingPopper.jsx';
import CommentsSection from './CommentsSection/CommentsSection.js';
import Reactions from './Reactions.js'; 
import reactionsData from '../Common/ReactionsData.ts';
import Preloader from '../Common/Preloader/Preloader.jsx';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserPicture } from '../../redux/auth_selectors';
import PostForm from '../Profile/PostForm.js';

const ProfilePost = React.memo(props => {
  const {
    postData,
    onOwnWall,
    embeddedPost,
    wallWidth,
    inWindow,
    inPostPage,
    userIsAuthenticated,
    onDelete,
    onRestore,
    onPut,
    onPatch
 } = props

  const dispatch = useDispatch()
  const classes = useStyles();
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null)
  const [showNewCommentField, setShowNewCommentField] = useState(postData.commentsCount > 0)
  const [shareMenuIsOpen, setShareMenuIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoreError, setRestoreError] = useState('')
  const [attachments, setAttachments] = useState([])
  const [menuDisabled, setMenuDisabled] = useState(false)
  const [commentingIsToggling, setCommentingIsToggling] = useState(false)
  const [postMenuAnchor, setPostMenuAnchor] = useState(null)
  const [showShareDialog, setShowShareDialog] = React.useState(false)
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)
  
  const creatorLink = `/i/${postData.creator.username}`
  const picture = useSelector(getCurrentUserPicture) // Чтобы была актуальная аватарка. Это понадобится в случае, если аватарку изменили, а посты взяты из состояния, где ещё старая аватарка
  const creatorPicture = onOwnWall
    ? `${imagesStorage}${picture}`
    : `${imagesStorage}${postData.creator.picture}`

  const postCreatorFullName = `${postData.creator.firstName} ${postData.creator.lastName}`
  const hasMedia = postData.attachments.length > 0

  const postCreationDate = new Date(postData.timestamp)
  const currentDate = Date.now()
  const differenceInHours = (((currentDate - postCreationDate) / 1000) /60) / 60
  const isEditable = differenceInHours < 24

  useEffect(() => {
    let photos = []
    postData.attachments.map(p => {
      photos.push({
        id: p.id,
        src: `${imagesStorage}${p.versions[2]}`
      })
    })
    setAttachments(photos)
  }, [postData.attachments])


  const handleRestore = () => {
    setIsRestoring(true)
    onRestore(postData.id)
      .then(
        () =>  setIsRestoring(false),
        () => {
          setRestoreError('Не удалось восстановить пост')
          setTimeout(() => setRestoreError(''), 3000)
          setIsRestoring(false)
        }
      )
  }

  if(postData.isDeleted) {
    return (
      <Paper style={{ padding: 16 }} >
        <div style={{  }}>
          <SimpleText color='textSecondary' >
            {t('Post was removed')}
          </SimpleText>
          <span style={{ cursor: 'pointer'}} onClick={handleRestore} >
            <SimpleText>{t('Restore')}</SimpleText>
          </span>
        </div>
        { isRestoring && <div><Preloader size={30} color='secondary' /></div> }
        { restoreError && <span style={{ color: 'red' }}>{ restoreError }</span>}
      </Paper>
    )
  }

  const closeShareMenu = () => {
    setShareMenuAnchor(null)
  }
  
  const close = () => {
    setShowCancelDialog(false)
    setShowShareDialog(false)
  }

  const onEditClick = () => {
    setEditMode(true)
    setPostMenuAnchor(null)
  }

  const toggleCommenting = () => {
    let value = postData.commentingIsDisabled ? 0 : 1
    setMenuDisabled(true)
    setCommentingIsToggling(true)
    const onEnd = () => {
      setMenuDisabled(false)
      setCommentingIsToggling(false)
    }
    // dispatch(patchPost(postData.id, 'comments_are_disabled', value))
    //   .then(onEnd, onEnd)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setMenuDisabled(true)
    const onEnd = () => {
      setPostMenuAnchor(null)
      setIsDeleting(false)
      setMenuDisabled(false)
    }
    onDelete(postData.id).then(onEnd, onEnd)
  }
  
  let allReactionsCount = 0;
  postData.reactionsCount.forEach(item => {
    allReactionsCount += item.count
  })

  const sortedReacionsCount = postData.reactionsCount.sort((a, b) => {
    if (a.count > b.count) return -1
    if (b.count > a.count) return 1
    return 0
  })
  const topReactionsTypes = []

  for (var i = 0; i < 3; i++) {
    if(sortedReacionsCount[i] !== undefined) {
      topReactionsTypes.push(sortedReacionsCount[i])
    }
  }

  const onCreateReaction = reactionType => {
    return dispatch(createPostReaction(postData.id, reactionType))
  }

  const onEditReaction = reactionType => {
    return dispatch(editPostReaction(postData.id, postData.requesterReaction.id, reactionType))
  }

  const onDeleteReaction = () => {
    return dispatch(deletePostReaction(postData.id, postData.requesterReaction.id))
  }

  const onEditSave = async function(text, attachments, isPublic, disableComments) {
    // return dispatch(editPost(postData.id, text, attachments, disableComments, isPublic))
    //   .then(
    //     () => setEditMode(false),
    //     () => {}
    //   )
  }

  const renderShareMenu = (
    <Menu
      anchorEl={shareMenuAnchor} getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      id='post-share-menu'
      keepMounted={true}
      open={Boolean(shareMenuAnchor)}
      onClick={closeShareMenu}
      onClose={closeShareMenu}
      disableScrollLock
    >
      {!onOwnWall &&
        <MenuItem onClick={() => setShowShareDialog(true)} >
          <SimpleText>{t('Share on wall')}</SimpleText>
        </MenuItem>
      }
      <MenuItem><SimpleText>{t('Share in my group')}</SimpleText></MenuItem>
      <MenuItem><SimpleText>{t('Share in dialogue')}</SimpleText></MenuItem>
    </Menu>
  );
    
  const renderShareDialog = (
    <Dialog
      onClose={() => setShowCancelDialog(true)}
      open={showShareDialog}
    >
      <DialogTitle >Lol kek</DialogTitle>

      <DialogContent>
        Кантент
      </DialogContent>
      
      <DialogActions>
        <React.Fragment>
          <Button variant="contained" onClick={() => console.log('kek')} >{t('Back')}</Button>
          <Button variant="contained" onClick={() => console.log('kek')} >{t('Save')}</Button>
        </React.Fragment>
      </DialogActions>
      <YesCancelDialog
        show={showCancelDialog}
        setShow={setShowCancelDialog}
        onYes={close}
        title={t('Discard changes')}
        text={t('You sure you want to discard changes?')}
      />
    </Dialog>
  )

  const renderEmbedded = null

  if(embeddedPost) {
    const hasMedia = Boolean(embeddedPost.photos.length) || Boolean(embeddedPost.videos.length) 
    const photos = []
    embeddedPost.photos.map(p => photos.push({img: baseUrl + p}))

    renderEmbedded = (
      <CardMedia className={classes.embeddedPostMedia}>
        <CardHeader
          title={
            <Typography
              component={NavLink} to={creatorLink}
              children={embeddedPost.creatorName}
            />
          }
          subheader={moment(embeddedPost.timestamp).format("DD MMMM HH:mm")}
          avatar={
            <Avatar
              component={NavLink} to={creatorLink}
              aria-label="recipe" 
              className={classes.avatar}
              src={`${baseUrl}${embeddedPost.creatorAvatar}`}
            />
          }
        />
        <Divider />
        { embeddedPost.text &&
          <CardContent>{ embeddedPost.text }</CardContent>
        }
        <CardMedia>
          <PhotoGallery
            images={photos}
            editMode={false} 
            width={wallWidth} 
            spacing={1}
          />
        </CardMedia>
  
      </CardMedia>
    )
  }

  const media = (
    hasMedia && !editMode &&
    <CardMedia >
      <div style={{padding: '0 8px', marginBottom: 8}} >
        <PhotoGallery
          place={`postId=${postData.id}`}
          images={attachments}
          spacing={1}
          imageBorderRadius={2}
        />
      </div>
    </CardMedia>
  )

  const menuItemPreloader = (
    <div className={classes.menuItemPreloader}>
      <Preloader size={30} color='secondary' />
    </div>
  )

  const postMenu = (
    <AutoTogglingPopper
      openArea={
        <div className={classes.postHeaderMenuAnchor} >
          <MoreHorizIcon />
        </div>
      }
      fadeTimeout={300}
      placement='bottom'
      closeTrigger={true}
      anchor={postMenuAnchor}
      setAnchor={setPostMenuAnchor}
    >
      <Paper elevation={3} style={{minWidth: 200}} >
        <MenuList dense >

        {onOwnWall ?
          <>
            { isEditable &&
            <MenuItem disabled={menuDisabled} onClick={onEditClick} >
              {t('Edit')}
            </MenuItem>
            }
            <MenuItem disabled={menuDisabled} onClick={handleDelete} >
              {t('Delete')}
              { isDeleting && menuItemPreloader }
            </MenuItem>

            <MenuItem disabled={menuDisabled} onClick={toggleCommenting} >
              { t(postData.commentingIsDisabled ? 'Enable comments' : 'Disable comments') }
              { commentingIsToggling && menuItemPreloader }
            </MenuItem>
          </>
          :
          <>
            <MenuItem disabled={menuDisabled} >
              {t('Complain')}
            </MenuItem>
          </> }
          
          <MenuItem disabled={true} >
            {t('Add to bookmarks')}
          </MenuItem>

        </MenuList>

      </Paper>
    </AutoTogglingPopper>
  )

  const shareAction = (
    <div>
      <IconButton onClick={() => setShareMenuIsOpen(true)} >
        <ShareIcon />
      </IconButton>

      <Modal
        style={{display:'flex',alignItems:'center',justifyContent:'center'}}
        open={shareMenuIsOpen}
        onClose={() => setShareMenuIsOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper className={classes.shareMenu} >
          <MenuItem value={10}>Поделиться</MenuItem>
          <MenuItem value={20}>Поделиться</MenuItem>
          <MenuItem value={30}>Поделиться</MenuItem>
        </Paper>
      </Modal>
    </div>
  )

  const commentsAndReactionsInfo = (
    (allReactionsCount > 0 || postData.commentsCount > 0) &&
    <>
    <div className={classes.postDivider} ><Divider /></div>
    <div className={classes.postReactionsAndCommentsInfo} >
      <div className={classes.postReactionsInfo} >
        {topReactionsTypes.map((reaction) => {
          const reactionImageSrc = reactionsData.find(element => element.type === reaction.type).src
          return (
            <div
              key={ reaction.type }
              className={classes.mostPopularReactionsItem}
              style={{ backgroundImage: `url(${reactionImageSrc})`, }}
            />
          )
        })}
        { allReactionsCount > 0 &&
          <div><SimpleText>{ allReactionsCount }</SimpleText></div>
        }
      </div>
      { postData.commentsCount > 0 &&
        <SimpleText >{`${t('Comments')}: ${postData.commentsCount}`}</SimpleText>
      }
    </div>
    <div className={classes.postDivider} ><Divider /></div>
    </>
  )

  return (
    <Card className={classes.card} style={{ maxWidth: (inWindow || inPostPage) ? 550 : 'auto' }}>
      <CardHeader
        className={classes.postHeader}
        action={ !editMode && userIsAuthenticated && postMenu }
        title={
          <Typography
            component={NavLink} to={creatorLink}
            children={ postCreatorFullName }
            color='textPrimary'
          />
        }
        subheader={
          <Typography variant='body2'
            style={{ cursor: 'pointer' }}
            children={ moment(postData.timestamp).format("DD MMMM HH:mm") }
            color='textSecondary'
          />
        }
        avatar={
          <Avatar
            className={classes.avatar}
            src={creatorPicture}
            component={NavLink} to={creatorLink}
          />
        }
      />
      { postData.text && !editMode &&
        <CardContent className={classes.contentContainer} >
          <SimpleText>{postData.text}</SimpleText>
        </CardContent>
      }
      { editMode &&
        <>
          <PostForm
            onSubmit={ onEditSave}
            editMode={editMode}
            setEditMode={setEditMode}
            text={postData.text}
            currentAttachments={attachments}
            commentingIsDisabled={postData.commentingIsDisabled}
            isPublic={postData.isPublic}
          />
          <Divider />
        </>
      }
      { media }
      { renderEmbedded }
      { commentsAndReactionsInfo }
      { userIsAuthenticated &&
        <CardActions className={classes.postActions} >
          <Reactions
            animate
            onCreateReaction={onCreateReaction}
            onEditReaction={onEditReaction}
            onDeleteReaction={onDeleteReaction}
            currentUserReaction={postData.requesterReaction}
          />
          { shareAction }
        </CardActions>
      }
      <>
        <CommentsSection
          key={ postData.id }
          postId={postData.id}
          postCreatorId={postData.creator.id}
          showNewCommentField={showNewCommentField}
          commentsCount={postData.commentsCount}
          //comments={postData.comments}
          commentingIsDisabled={postData.commentingIsDisabled}
          userIsAuthenticated={userIsAuthenticated}
          onOwnWall={onOwnWall}
        />

      </>
              
      { renderShareMenu }
      { renderShareDialog }

    </Card>
  )
})

export default ProfilePost