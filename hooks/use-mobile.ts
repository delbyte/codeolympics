import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      // Check both viewport width and user agent for more accurate detection
      const viewportMobile = window.innerWidth < MOBILE_BREAKPOINT
      const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      return viewportMobile || userAgentMobile
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkMobile())
    }
    mql.addEventListener('change', onChange)
    setIsMobile(checkMobile())
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
