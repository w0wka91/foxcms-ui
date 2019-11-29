import { css } from 'emotion'
import React from 'react'
import { colors, shadows } from 'react-atomicus'

const AuthenticatedApp: React.FC = () => {
  return (
    <div
      className={css`
        border-top: 4px solid ${colors.blue700};
        min-height: 100vh;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
      `}
    >
      <header
        className={css`
          padding: 1.6rem;
          box-shadow: ${shadows[0]};
        `}
      >
        HEADER
      </header>
      <div
        className={css`
          display: flex;
          flex: 1 1 auto;
          flex-direction: row;
        `}
      >
        <div
          className={css`
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
          `}
        >
          <main
            className={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              flex: 1 1 auto;
              padding-bottom: 3.2rem;
            `}
          >

          </main>
        </div>
        <div
          className={css`
            flex: 0 0 25.6rem;
            background: linear-gradient(
              0deg,
              ${colors.blue800} 1%,
              ${colors.blue500} 100%
            );
            order: -1;
          `}
        >
          SIDEBAR1
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedApp
