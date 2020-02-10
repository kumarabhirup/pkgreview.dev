import { useState, useEffect } from 'react'

/**
 * @name useIsMobile - Used for determining the the `shouldHide` state.
 * @param {Number} shouldHideIfLesserThan - If window size becomes lesser than this number, it is mobile.
 *
 * @example
 * const isMobile = useIsMobile()
 */
export default function useIsMobile(shouldHideIfLesserThan = 760) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const resize = () => {
      setIsMobile(window.innerWidth <= shouldHideIfLesserThan)
    }

    window.addEventListener('resize', resize)
    resize()
  }, [shouldHideIfLesserThan])

  return isMobile
}
