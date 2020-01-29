import React, { PropsWithChildren } from 'react'
import { css } from 'emotion'
import { colors, fontSizes } from 'react-atomicus'

interface Props {
  title: string
  subtitle?: string
}

const PageHeader: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
  subtitle,
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={css`
        display: flex;
        align-items: baseline;
        padding: 3.2rem 0;
        margin-top: 4.8rem;
      `}
    >
      <h1
        className={css`
          font-size: ${fontSizes[6]};
          color: ${colors.grey700};
          font-weight: 400;
        `}
      >
        {title}
      </h1>
      <h2
        className={css`
          font-size: ${fontSizes[2]};
          margin-left: 1.2rem;
          margin-right: auto;
          color: ${colors.grey500};
          font-weight: 400;
        `}
      >
        {subtitle}
      </h2>
      {children}
    </div>
  )
}

export default PageHeader
