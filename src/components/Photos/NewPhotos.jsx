import React, {useState, useEffect, useRef} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import PhotoGallery from '../Common/PhotoGallery';
import {addPhoto, cleanNewPhotos, setNewPhotoCreating} from '../../redux/photos_reducer'
import { useTheme } from '@material-ui/core/styles';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {useTranslation} from 'react-i18next';
import { DialogActions, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
}));

const NewPhotos = React.memo(props => {
  const {profileId, newPhotoCreating, setNewPhotoCreating, newPhotos, cleanNewPhotos, currentUserId} = props
  const classes = useStyles();
  const { t } = useTranslation();

  console.log(newPhotos)

  useEffect(() => {
    return () => {
      console.log('unmount')
      cleanNewPhotos()
    }
  }, [])

  if(newPhotos.length === 0) {
    return <Redirect to={`/profile/${profileId}/photos`} />
  }

  return (
    <div>
      <PhotoGallery
        grid={true}
        columnsCount={4}
        place={`albumId=${currentUserId}-loaded`}
        editMode={false}
        images={newPhotos}
        spacing={1}
        imageBorderRadius={2}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button variant='outlined' >Add to album</Button>
      </div>
    </div>
  )
})

let mapStateToProps = state => {
  return {
    newPhotos: state.photos.newPhotos,
    newPhotoCreating: state.photos.newPhotoCreating,
    currentUserId: state.auth.id,
    profileId: state.profile.profileInfo.id
  }
}

let functions = {
  addPhoto, cleanNewPhotos, setNewPhotoCreating
}

export default compose(
  connect(mapStateToProps, functions),
)(NewPhotos);