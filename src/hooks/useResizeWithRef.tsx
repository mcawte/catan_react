import { useEffect, useLayoutEffect, useState } from "react"

export const useResizeWithRef = (myRef: React.RefObject<HTMLDivElement>) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    useLayoutEffect(() => {
      // I don't think it can be null at this point, but better safe than sorry
       if (myRef.current !== null) {
      setWidth(myRef.current.offsetWidth)
      setHeight(myRef.current.offsetHeight)
       }
     },[myRef]);
  
    useEffect(() => {
      const handleResize = () => {
        if (myRef.current !== null) {
        setWidth(myRef.current.offsetWidth)
        setHeight(myRef.current.offsetHeight)
        }
      }
  
      window.addEventListener('resize', handleResize)
  
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [myRef])
  
    return { width, height }
  }

