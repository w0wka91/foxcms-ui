import './App.css'
import React, { useEffect, useState } from 'react'
import AuthenticatedApp from './AuthenticatedApp'
import UnauthenticatedApp from './UnauthenticatedApp'
import { useDataApi } from './hooks/useDataApi'

const App: React.FC = () => {
  const [user, setUser] = useState<User>()
  const [{ data, isLoading }] = useDataApi<User>('/user')

  useEffect(() => {
      setUser(data)
    },
    [data],
  )
  if (isLoading) return null
  return (
    <>
      {user && user.username ?
        <AuthenticatedApp/> :
        <UnauthenticatedApp onSuccessfulLogin={(user: User) => setUser(user)}/>}
    </>
  )
}

export default App
