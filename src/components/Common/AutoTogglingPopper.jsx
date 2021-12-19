import React, { useEffect, useRef } from 'react'
import { Fade, Popper } from '@material-ui/core';
//import { usePrevious } from '../../hooks/hooks';


/*
  Затея с этим компонентом провалилась из-за того, что ним его поведением управлять в родительском компоненте, а иногда даже невозможно
  Например нельзя нормально удалить timeout извне. Я попытался это сделать в useEffect при изменении anchor, но почему-то он не удаляется, а мне нужно чтобы он удалялся, чтобы отменить появление поппера.
  Возможно я что-то не так сделал и этого можно добиться, но я не знаю как. Также мне не нравится как выглядит этот компонент и не нравится как родительский элемент закрывает поппер.
  Возможно я не прав, но проще когда поппер не управляет сам собой, проще когда им управляет внешний компонент.
*/
const AutoTogglingPopper = props => {
  const {children, openArea, fadeTimeout, placement, anchor, setAnchor, openTimeout, closeTimeout} = props

  let placement1 = placement

  if(!['bottom', 'top', 'right', 'left'].includes(placement)) {
    placement1 = 'bottom'
  }

  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);

  const stopPostMenuHiding = () => {
    clearTimeout(hideTimeout.current)
  }

  //const previousAnchor = usePrevious(anchor)

  useEffect(() => {
    clearTimeout(showTimeout.current)
    //console.log('clear timeout')
  }, [anchor])

  const open = (e) => {
    let target = e.currentTarget
    clearTimeout(hideTimeout.current)
    
    if(!Boolean(anchor)) {
      //console.log('create timeout')
      showTimeout.current = setTimeout(() => {
        setAnchor(target)
        //console.log('set anchor')
      }, openTimeout ?? 200);
    }
  }

  const close = (e) => {
    if(!anchor) {
      clearTimeout(showTimeout.current)
    }
    hideTimeout.current = setTimeout(() => {
      setAnchor(null)
    }, closeTimeout ?? 200);
  }

  return (
    <div onMouseLeave={close} >

      <div onMouseEnter={open} >
        { openArea }
      </div>

      <Popper
        open={Boolean(anchor)}
        anchorEl={anchor}
        placement={placement1}
        // modifiers={{
        //   offset: { enabled: true, offset: '40, 0' }
        // }}
        transition
        onMouseEnter={stopPostMenuHiding}
      >
        {({ TransitionProps }) => (

          <Fade {...TransitionProps} timeout={fadeTimeout}>
            {children}
          </Fade>

        )}
      </Popper>

    </div>
  )
}

export default AutoTogglingPopper