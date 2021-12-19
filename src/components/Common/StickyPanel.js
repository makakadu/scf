import React, {useState, useEffect, useRef} from 'react';
// import './RightProfilePanel.css'
import { useStyles } from './StickyPanelStyles'

const StickyPanel = ({top, children}) => {

  const classes = useStyles({top});

  //useEffect(() => discard(),[matchParams]) // Сброс если matchParams отличается от предыдущего matchParams, а оно отличается всегда. matchParams используются потому что это единственное свойство, которое меняется всегда, ведь сбрасывать нужно всегда

  const panel = useRef(null)

  useEffect(() => {
    let onScroll = () => {
      let panelHeight = panel.current.getBoundingClientRect().height
      let panelTop = Number(panel.current.style.top.split('p')[0])

      let fromStickyTopToViewportBottom = panelTop < 0
        ? Math.abs(panelTop) + window.innerHeight : window.innerHeight - panelTop

      if(panelHeight > fromStickyTopToViewportBottom) {
        let newPanelStickyTop = window.innerHeight - panelHeight
        panel.current.style.top = `${newPanelStickyTop}px`
      }
      else if(panelHeight < fromStickyTopToViewportBottom) {
        let newPanelStickyTop = panelTop + (fromStickyTopToViewportBottom - panelHeight)

        if(newPanelStickyTop > 64) {
          newPanelStickyTop = 64
        }
        panel.current.style.top = `${newPanelStickyTop}px`
      }
    }
    
    document.addEventListener('scroll', onScroll)
    document.addEventListener('scroll', () => {
      // К счастью позволяется множество слушателей на scroll event, поэтому этот слушатель именно добавляется, а не заменяет предыдущий
    })

    return () => {
      console.log('remove listener')
      document.removeEventListener('scroll', onScroll) // удаляется конкретный слушатель, js это выясняет благодаря переданной функции, будет удалён listener, в который была передана
      // функция onScroll вторым параметром
    }
  }, [])

  return (
    <div
      className={classes.panel}
      ref={panel}
    >
        {children}

    </div>
  )
}

export default StickyPanel
