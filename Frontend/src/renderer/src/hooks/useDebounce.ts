import { debounce } from '@renderer/utils/debounce'
import { useRef, useEffect, useMemo } from 'react'

type Callback<T extends unknown[]> = (...args: T) => void

export default function useDebounce<T extends unknown[]>(
  callback: Callback<T>,
  delay: number = 500
) {
  const ref = useRef<Callback<T> | undefined>(undefined)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = (...args: T) => {
      ref.current?.(...args)
    }
    return debounce(func, delay)
  }, [delay])

  return debouncedCallback
}
