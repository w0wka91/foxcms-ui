import React, { PropsWithChildren } from 'react'
import { css } from 'emotion'
import { fontSizes, colors } from 'react-atomicus'

interface Props {
  title: string
}

const PageHeader: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        padding: 3.2rem 0;
      `}
    >
      <h1
        className={css`
          font-size: ${fontSizes[6]};
          margin-right: auto;
          color: ${colors.grey700};
          font-weight: 400;
        `}
      >
        {title}
      </h1>
      {children}
    </div>
  )
}

export default PageHeader
