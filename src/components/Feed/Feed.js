import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import {useDispatch, useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next';
import { useStyles } from './FeedStyles.js'
import { Box, Button, IconButton, Paper } from '@material-ui/core'
import ProfilePost from '../ProfilePost/ProfilePost.js';
import { getFeedPosts, getMoreFeedPosts, cleanProfilePosts } from '../../redux/profile_posts_reducer';
import Preloader from '../Common/Preloader/Preloader.jsx';
import { isAbsolute } from 'path';
import StickyPanel from '../Common/StickyPanel.js';
import { Skeleton } from '@material-ui/lab';
import PostSkeleton from '../Common/PostSkeleton.js';

const Feed = React.memo( props => {
  const classes = useStyles()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.profilePosts.posts)
  const cursor = useSelector((state) => state.profilePosts.cursor)
  const loaded = useSelector((state) => state.profilePosts.areLoaded)
  const loadMorePostsButton = useRef(null)
  const [morePostsLoading, setMorePostsLoading] = useState(false)

  useEffect(() => {
    document.title = t('Feed')
    dispatch(getFeedPosts(5))
    return () => dispatch(cleanProfilePosts())
  }, [])

  // const handleLoadMorePosts = async () => {
  //   if(!morePostsLoading && loaded && cursor) {
  //     setMorePostsLoading(true)
  //     await dispatch(getMoreFeedPosts(5, cursor))
  //     setMorePostsLoading(false)
  //   }
  // } 

  const handleLoadMorePosts = useCallback( async () => {
    if(!morePostsLoading && loaded && cursor) {
      setMorePostsLoading(true)
      await dispatch(getMoreFeedPosts(5, cursor))
      setMorePostsLoading(false)
    }
  }, [morePostsLoading, loaded, cursor])

  const panel = <div className={classes.panel}>
    <StickyPanel top={55}>
      <Paper style={{padding: 16, height: 100}}></Paper>
    </StickyPanel>
  </div>

  if(loaded && posts && !posts.length) {
    return <section className={classes.feed}>
      <Paper style={{flexGrow: 1, display: 'flex', justifyContent: 'center', marginRight: 16}}>
        {/* <LocalFloristIcon style={{width: 150, height: 150}} /> */}
        <div style={{ fontSize: '130px' }}>🐮</div>
        <Typography variant='h6' >
          {t('Публикаций пока нет')}
        </Typography>
      </Paper>
      { panel }
    </section>
  }

  // useEffect(() => {
  //   var options = {
  //     root: null,
  //     rootMargin: '100px',
  //     threshold: 0.1
  //   }
  //   var callback = function(entries, observer) {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         handleLoadMorePosts()
  //       }
  //     })
  //   };
  //   var observer = new IntersectionObserver(callback, options);
  //   observer.observe(loadMorePostsButton.current)

  //   return () => observer.disconnect()
  // }, [handleLoadMorePosts])

  let postsList = posts && posts.map(post => {
    return (
      <ProfilePost
        onDelete={() => {}}
        onOwnWall={false}
        key={post.id}
        postData={post}
        wallWidth={500}
        embeddedPost={post.embeddedPost}
        inList={true}
        userIsAuthenticated={true}
      />
    )
  })

  let postsSkeletonsList = [0, 1, 2].map(() => <PostSkeleton />)

  return <section className={classes.feed}>
    <main className={classes.posts}>
      { loaded
        ? postsList
        : postsSkeletonsList
      }
      <div style={{display: 'flex', justifyContent: 'center'}} ref={loadMorePostsButton} >
        { loaded && !!cursor &&
          <div style={{ border: '1px solid black', position: 'relative'}}>
            <Button onClick={handleLoadMorePosts} >Загрузить ещё</Button>   
            <div style={{position: 'absolute', top: 0, right:0, left:0, bottom: 0, display: morePostsLoading ? 'block' : 'none' }}><Preloader /></div>
          </div>
        }
      </div>
    </main>
    { panel }
  </section>

})

export default Feed
