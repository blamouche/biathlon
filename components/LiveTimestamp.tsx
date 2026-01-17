'use client'

import { useEffect, useState } from 'react'

export default function LiveTimestamp() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return <>{time.toISOString()}</>
}
