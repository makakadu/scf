import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import PhotoGallery from '../Common/PhotoGallery';
import { GridList, GridListTile, GridListTileBar, Paper, Typography, Button, Tab, Tabs, Box } from '@material-ui/core';
import { getAlbums, getPhotos } from '../../redux/photos_reducer'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { baseUrl } from '../../api/api'
import { useTranslation } from 'react-i18next';
import Skeleton from '@material-ui/lab/Skeleton';
import { profileAPI } from '../../api/api'
import { withRouter, NavLink, Route, Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({

}));

const Photo = React.memo(props => {

  return (
    <div>
      <img width='100' height='100' src="https://source.unsplash.com/random" />
    </div>
  );
})

export default Photo