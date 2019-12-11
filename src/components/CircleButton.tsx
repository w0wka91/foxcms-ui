import React, { PropsWithChildren } from 'react'
import { Button } from 'react-atomicus'
import { css, cx } from 'emotion'

interface Props {
  icon: string
  className: string
  title?: string
  onClick?: (event: React.MouseEvent) => void
}

const CircleButton: React.FC<PropsWithChildren<Props>> = ({
                                                            icon,
                                                            className,
                                                            onClick,
                                                            title,
                                                          }) => {
  return (
    <Button
      onClick={onClick}
      title={title}
      className={cx(
        css`
          padding: 1.2rem;
          background-color: transparent;
          border-radius: 100%;
          box-shadow: none;
        `,
        className,
      )}
    >
      <Button.Icon name={icon}/>
    </Button>
  )
}

export default CircleButton
