import { IconButton, Modal } from '@material-ui/core';
import React, { useRef } from 'react';
import {useHistory } from "react-router-dom";
import Post from './components/Profile/Post/Post.js';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

function PostWindow() {
  let history = useHistory();
  //let location = useLocation();

  let back = event => {
    console.log(history)
    event.stopPropagation();
    //console.log(event.target.parentElement)
    //console.log(event.currentTarget)
   if(event.target === event.currentTarget) {
      //history.replace(history.);
      history.replace(history.location.state.background.pathname)
    }
    
  };

  const post = {id: "22", text: "Сегодня приехал в поле и очень классно посрал смотря на красивые пейзажи и дыша свежым воздухом", photos: [], videos:[], creatorId: "31231231", creatorName: "Михаил Белкин"}

  const modal = useRef(null)

  return (
      <Modal
        //disableScrollLock
        id='modal'
        open={true}
        
        style={{
          background: "rgba(0, 0, 0, 0.65)",
         // display: 'flex',
          //alignItems: 'center',
          //justifyContent: 'center',
          
        }}
      >
        <div ref={modal} id='container' onClick={back} style={{height: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer', overflowY: 'scroll', overflowX: 'hidden'}} >
          
          <div style={{cursor: 'initial', position: 'relative'}} >
            <div id='top' style={{height: 50}}/>
            <Post
              onDelete={() => console.log('delete')}
              onOwnWall={false}
              key={post.id}
              postData={post}
              wallWidth={500}
              embeddedPost={null}
              inWindow
            />
            
            <div style={{height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <IconButton
                style={{ background: 'grey' }}
                onClick={() => modal.current.scrollTo({ top: 0,  behavior: "smooth" })}
              >
                <ArrowUpwardIcon />
              </IconButton>
            </div>

          </div>
        </div>
      </Modal>
    
  );
}

export default PostWindow
