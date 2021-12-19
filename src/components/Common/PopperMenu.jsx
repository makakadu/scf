import React, { useEffect, useRef } from 'react'
import { ClickAwayListener, Fade, makeStyles, Paper, Popper } from '@material-ui/core';

const useStyles = makeStyles(theme => {

  return {
    border: {
      //background: 'red',
      border: `1px solid ${theme.palette.divider}`
    }
  }
})

const PopperMenu = ({anchor, children, onClickAway, offset = '', placement = 'bottom', width = 'auto' }) => {
  const classes = useStyles();
  // console.log(anchor)

  return (
    <ClickAwayListener onClickAway={ onClickAway } >
      <Popper
        open={Boolean(anchor)}
        anchorEl={anchor}
        placement={ placement }
        modifiers={{
          offset: {
            enabled: !!offset,
            offset: offset
          }
        }}
        transition
        style={{
          width: width,
          zIndex: 1
        }}
      >
        <Paper className={classes.border} >
          { children }
        </Paper>

      </Popper>
    </ClickAwayListener>
  )
}

export default PopperMenu