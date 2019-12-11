import React, { PropsWithChildren } from 'react'
import { css, cx } from 'emotion'
import { colors } from 'react-atomicus'

const Table = ({
                 children,
                 className,
               }: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <table
      className={cx(
        css`
          position: relative;
          border-collapse: collapse;
          border-radius: 3px;
          width: 100%;
        `,
        className,
      )}
    >
      {children}
    </table>
  )
}

Table.Row = ({ children, ...rest }: React.HTMLProps<HTMLTableRowElement>) => (
  <tr
    className={css`
      &:hover {
        cursor: pointer;
        background: ${colors.blue100};
      }
    `}
    {...rest}
  >
    {children}
  </tr>
)

Table.Header = ({ children }: PropsWithChildren<{}>) => (
  <thead>
  <tr>{children}</tr>
  </thead>
)

Table.HeaderCell = ({
                      children,
                      ...rest
                    }: React.HTMLProps<HTMLTableHeaderCellElement>) => (
  <th
    className={css`
      padding: 1.6rem 3.2rem;
      background: ${colors.grey100};
      color: ${colors.grey700};
      border-bottom: 1px solid ${colors.grey200};
      font-weight: 600;
      text-align: left;
    `}
    {...rest}
  >
    {children}
  </th>
)

Table.Body = ({ children }: PropsWithChildren<{}>) => <tbody>{children}</tbody>

Table.Cell = ({
                children,
                className,
                ...rest
              }: React.HTMLProps<HTMLTableDataCellElement>) => (
  <td
    className={cx(
      css`
        padding: 2.4rem 3.2rem;
        border-bottom: 1px solid ${colors.grey200};
        font-weight: 400;
        font-family: inherit;
        color: ${colors.grey700};
      `,
      className,
    )}
    {...rest}
  >
    {children}
  </td>
)

export default Table
