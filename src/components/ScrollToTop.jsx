import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const SCROLL_DURATION = 600

function easeInOut(progress) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2
}

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const scrollPositions = useRef(new Map())
  const animationFrame = useRef(null)

  useEffect(() => {
    const positions = scrollPositions.current
    const targetPosition = positions.get(pathname) ?? 0
    const startPosition = window.scrollY
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (animationFrame.current) cancelAnimationFrame(animationFrame.current)

    if (reduceMotion || startPosition === targetPosition) {
      window.scrollTo({ top: targetPosition, behavior: 'auto' })
    } else {
      const startedAt = performance.now()
      const animateScroll = (now) => {
        const progress = Math.min((now - startedAt) / SCROLL_DURATION, 1)
        const position = startPosition + (targetPosition - startPosition) * easeInOut(progress)
        window.scrollTo({ top: position, behavior: 'auto' })

        if (progress < 1) animationFrame.current = requestAnimationFrame(animateScroll)
      }

      animationFrame.current = requestAnimationFrame(animateScroll)
    }

    return () => {
      positions.set(pathname, window.scrollY)
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [pathname])

  return null
}
