import React from 'react';
import {useTranslation} from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogTitleWithCloseButton from './DialogTitleWithCloseButton';

// const styles = (theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(2),
//   },
//   closeButton: {
//     position: 'absolute',
//     right: theme.spacing(1),
//     top: theme.spacing(1),
//     color: theme.palette.grey[500],
//   },
// });


const YesCancelDialog = React.memo((
  {show, setShow, onYes, title, text}
) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setShow(false)
  }
  return (
    <Dialog
      //fullWidth={true}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={show}
    >
      <DialogTitleWithCloseButton
        onClose={handleClose}
        children={title}
      />

      <DialogContent dividers>
        <DialogContentText
          children={
            <Typography variant='body2'>{text}</Typography>
          } 
        />
      </DialogContent>
      
      <DialogActions>
        <Button
          onClick={() => setShow(false)}
        >
          {t('Cancel')}
        </Button>
        <Button
          onClick={onYes}
        >
          {t('Yes')}
        </Button>
      </DialogActions>
      
    </Dialog>
  )
})

export default YesCancelDialog
