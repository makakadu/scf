import React from 'react';
import AvatarEditor from './Profile/ProfileChronic/RightProfilePanel/ProfilePicture/node_modules/react-avatar-editor'
import Slider from '@material-ui/core/Slider';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {updateAvatar, createPhoto} from '../redux/profile_reducer'
//const useStyles = makeStyles(theme => ({
//}));
//
const MyAvatarEditor = props => {
  let [selectedImage, setSelectedImage] = React.useState("")
  let [userProfilePic, setUserProfilePic] = React.useState("")
  let [scaleValue, setScaleValue] = React.useState(2)
  let [full, setFull] = React.useState('')

    function dataURItoBlob (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type: mimeString});
    }

  const onCrop = () => {
    if(comp.current !== null) {
      const url = comp.current.getImageScaledToCanvas().toDataURL()
      //setUserProfilePic(url)
      
      //const url2 = comp.current.canvas.toDataURL('image/jpeg')
      let img = dataURItoBlob(url)

      //console.log(img)
      //console.log(selectedImage)
      props.updateAvatar(selectedImage, img, 2)
    }
  }

  const onCreatePhoto = () => {
    props.createPhoto(selectedImage)
  }

  const onScaleChange = (event, newValue) => {
    setScaleValue(newValue)
  }

  const profileImageChange = (event) => {
    const file = event.target.files[0]
    const {type} = file
    if(type && type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg')) {
      setSelectedImage(file)
    }
  }

  let comp = React.useRef(null)

  return (
    <>
      <AvatarEditor
        ref={comp}
        image={selectedImage}
        width={150}
        height={150}
        border={50}
        color={[255, 255, 255, 0.6]} // RGBA
        scale={scaleValue}
        //rotate={14}
        borderRadius={1100}
      />
      <div style={{width: '300px'}}>
      <Slider
        step={0.001}
        min={1}
        max={20}
        value={scaleValue}
        onChange={onScaleChange} 
        aria-labelledby="continuous-slider"
      /></div>
      {/*<input style={{width: '50%'}} type="range" value={scaleValue} min="1" max="10" onChange={onScaleChange} />*/}
     
      <input type="file" accept="image/png, image/jpeg" onChange={profileImageChange} />
      <img src={userProfilePic} />
      <button onClick={onCrop} style={{marginTop: 40}}>Crop</button>
      <button onClick={onCreatePhoto} style={{marginTop: 40}}>Create Photo</button>
    </>
  )
}
let mapStateToProps = state => ({
})

export default compose(
  connect(
    mapStateToProps, 
    {
      updateAvatar, createPhoto
    }
  ),
)(MyAvatarEditor);
