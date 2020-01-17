import React from 'react'
import { css } from 'emotion'
import { colors, Icon, Label } from 'react-atomicus'
import Dayjs from 'dayjs'

const Info = ({
  label,
  value,
}: {
  label: string
  value: string | React.ReactNode
}) => (
  <div
    className={css`
      display: flex;
      flex-direction: column;
    `}
  >
    <Label>{label}</Label>
    <span>{value}</span>
  </div>
)

interface ContentMetadataProps {
  content: any
}
const ContentMetadata = ({ content }: ContentMetadataProps) => {
  return (
    <div
      className={css`
        flex-basis: 25%;
        background: #fff;
        border: 1px solid ${colors.grey200};
        border-radius: 3px;
        min-width: auto;
        padding: 2.4rem 3.2rem;
        & > *:not(:last-child) {
          margin-bottom: 1.6rem;
        }
      `}
    >
      <Info
        label="Status"
        value={
          <div
            className={css`
              display: flex;
              align-items: center;
              & > *:not(:last-child) {
                margin-right: 1.2rem;
              }
            `}
          >
            <Icon
              name="circle"
              fill={
                content?.status === 'Published'
                  ? colors.green500
                  : content?.status === 'Pending'
                  ? colors.blue400
                  : 'none'
              }
            />
            <span>{content?.status}</span>
          </div>
        }
      />
      <Info
        label="Created at"
        value={Dayjs(content?.createdAt).format('DD.MM.YYYY HH:mm')}
      />
      <Info
        label="Updated at"
        value={Dayjs(content?.updatedAt).format('DD.MM.YYYY HH:mm')}
      />
    </div>
  )
}

export { ContentMetadata }
