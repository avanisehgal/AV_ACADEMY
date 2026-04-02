import React, { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
    }

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [data-hover], .chapter-header, .resource-card, .modal-close')) {
        dot.classList.add('cursor-hover')
        ring.classList.add('cursor-hover')
      }
    }

    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [data-hover], .chapter-header, .resource-card, .modal-close')) {
        dot.classList.remove('cursor-hover')
        ring.classList.remove('cursor-hover')
      }
    }

    let animFrame
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      animFrame = requestAnimationFrame(animate)
    }
    animate()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      cancelAnimationFrame(animFrame)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
