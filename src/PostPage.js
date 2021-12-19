import React from 'react';
//import { useHistory, useLocation, useParams } from "react-router-dom";
// import Post from './components/Profile/Post/Post.js';

function PostPage() {
  // let history = useHistory();
  // let location = useLocation();

  const post = {id: "22", text: "Сегодня приехал в поле и очень классно посрал смотря на красивые пейзажи и дыша свежым воздухом", photos: [], videos:[], creatorId: "31231231", creatorName: "Михаил Белкин"}

  return (
    <div>
      {/* <Post
        onDelete={() => console.log('delete')}
        onOwnWall={false}
        key={post.id}
        postData={post}
        wallWidth={500}
        embeddedPost={null}
        inPostPage
      /> */}
    </div>
  );
}

export default PostPage
