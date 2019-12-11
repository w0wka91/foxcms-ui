import { useEffect, useReducer, useState } from 'react'

type Action<T> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE' }

const dataFetchReducer = <T, >(state: T, action: Action<T>) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error()
  }
}

interface State<T> {
  isLoading: boolean
  isError: boolean
  data: T
}

const useDataApi = <T, >(
  initialUrl: string,
  initialData?: T | undefined,
): [any, (url: string) => void] => {
  const [url, setUrl] = useState(initialUrl)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: true,
    isError: false,
    data: initialData,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' })

      try {
        const result = await fetch(url)

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: await result.json() })
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' })
        }
      }
    }

    fetchData()

    return () => {
      didCancel = true
    }
  }, [url])

  return [state, setUrl]
}

export { useDataApi }
