import React, { PropsWithChildren } from 'react'
import { css } from 'emotion'
import { Card, colors } from 'react-atomicus'

interface RelationFormCardProps {
  title: string | React.ReactNode
}

const RelationFormCard: React.FC<PropsWithChildren<RelationFormCardProps>> = ({
  title,
  children,
}) => {
  return (
    <Card
      className={css`
        margin: 4.8rem 6.4rem;
        overflow: visible;
      `}
    >
      <div
        className={css`
          height: 4.8rem;
          background-color: ${colors.grey100};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        `}
      >
        <span>{title}</span>
      </div>

      <div
        className={css`
          padding: 1.2rem;
          & > * {
            margin-bottom: 1.2rem;
          }
        `}
      >
        {children}
      </div>
    </Card>
  )
}

export { RelationFormCard }
