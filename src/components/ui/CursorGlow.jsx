import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const cursorRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 768) return

    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
        cursor.style.opacity = '1'
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    let reqId
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15
      cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`
      reqId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(reqId)
    }
  }, [])

  return <div ref={cursorRef} className="cursor-glow" id="cursor-glow"></div>
}
