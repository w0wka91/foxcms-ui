import React from 'react'
import { shadows, colors, Icon, Button } from 'react-atomicus'
import { css } from 'emotion'
import {
  fieldName,
  isSystemField,
  fieldIcon,
  fieldInfoTop,
  fieldInfoBottom,
} from './field-utils'
import CircleButton from '../../components/CircleButton'
import { ContentModel_contentModel_fields as Field } from '../../generated/ContentModel'
import { navigate } from '@reach/router'

interface FieldRowProps {
  field: Field
}

const FieldRow: React.FC<FieldRowProps> = ({ field }) => {
  return (
    <div
      key={field.apiName}
      className={css`
        display: flex;
        background: #fff;
        align-items: center;
        height: 6.4rem;
        border-radius: 3px;
        box-shadow: ${shadows[1]};
        border: 1px solid ${colors.grey100};
        border-left: 5px solid ${colors.blue500};
        align-self: stretch;
        padding: 1.2rem 2.4rem;
        margin-bottom: 2.4rem;
      `}
    >
      <span
        className={css`
          display: flex;
          width: 25.6rem;
          flex-direction: column;
          font-weight: 600;
          margin-left: 2rem;
        `}
      >
        {field.name}
        <span
          className={css`
            color: ${colors.grey300};
            font-size: 1.4rem;
          `}
        >
          {field.apiName}
        </span>
      </span>
      <span
        className={css`
          display: flex;
          width: 19.2rem;
          align-items: center;
          font-size: 1.4rem;
          font-weight: 600;
        `}
      >
        <Icon
          className={css`
            margin-right: 1.4rem;
          `}
          name={fieldIcon(field)}
        />
        {field.__typename === 'RelationField' ? (
          <Button
            className={css`
              padding: 0;
            `}
            onClick={() => navigate(`./${field.relatesTo.id}`)}
            hierarchy="tertiary"
          >
            {fieldName(field)}
          </Button>
        ) : (
          fieldName(field)
        )}
      </span>
      <span
        className={css`
          display: flex;
          width: 19.2rem;
          flex-direction: column;
          font-weight: 600;
          margin-left: 2rem;
          font-size: 1.4rem;
          color: red;
        `}
      >
        {fieldInfoTop(field)}
        <span
          className={css`
            color: ${colors.grey700};
            font-size: 1.4rem;
          `}
        >
          {fieldInfoBottom(field)}
        </span>
      </span>
      <div
        className={css`
          display: flex;
          width: 19.2rem;
          justify-content: space-around;
        `}
      >
        {!isSystemField(field) && (
          <>
            <CircleButton
              icon="minus"
              onClick={() => alert('delete')}
              className={css`
                color: ${colors.red300};
                &:hover:enabled {
                  background-color: ${colors.red100};
                }
              `}
            />
            <CircleButton
              icon="edit"
              className={css`
                color: ${colors.grey600};
                &:hover:enabled {
                  background-color: ${colors.blue100};
                }
              `}
            />
          </>
        )}
      </div>
    </div>
  )
}

export { FieldRow }
