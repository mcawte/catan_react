import { useEffect, useLayoutEffect, useState } from "react"

export const useResize = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    useLayoutEffect(() => {
      // I don't think it can be null at this point, but better safe than sorry
       
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
       
     },[]);
  
    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
      }
  
      window.addEventListener('resize', handleResize)
  
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])
  
    return { width, height }
  }

