import React from 'react'
import { css } from 'emotion'
import { Button, Card, colors, Input } from 'react-atomicus'
import useForm from 'react-hook-form'
import { User } from '../types/foxcms.global'

interface FormData {
  username: string;
  password: string;
}

interface Props {
  onSuccessfulLogin: (user: User) => void
}

const UnauthenticatedApp: React.FC<Props> = ({ onSuccessfulLogin }) => {
  const { register, handleSubmit, formState, errors } = useForm<FormData>()
  const onSubmit = async ({ username, password }: FormData) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await fetch('/login', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      throw Error(response.statusText)
    }
    onSuccessfulLogin(await response.json())
  }
  return (
    <div
      className={css`
        background: linear-gradient(
          0deg,
          ${colors.blue800} 1%,
          ${colors.blue500} 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
      `}
    >
      <Card
        className={css`
          text-align: center;
          width: 38.4rem;
          padding: 2.4rem 3.2rem;
        `}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={css`
            & > * {
              margin-bottom: 1.6rem;
            }
          `}
        >
          <Input
            name="username"
            label="Username"
            iconRight="user"
            type="text"
            autoComplete="off"
            autoFocus
            error={errors['username'] && 'Please enter your username'}
            ref={register({ required: true })}
          />
          <Input
            name="password"
            label="Password"
            iconRight="lock"
            type="password"
            autoComplete="off"
            error={errors['password'] && 'Please enter your password'}
            ref={register({ required: true })}
          />
          <Button
            size="large"
            fluid={true}
            disabled={formState.isSubmitting}
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default UnauthenticatedApp
