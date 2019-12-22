import React from 'react'
import { colors, Icon, shadows } from 'react-atomicus'
import { css } from 'emotion'
import { fieldIcon, fieldInfoBottom, fieldInfoTop, fieldName } from './field-utils'
import { ContentModel_contentModel_fields as Field } from '../../generated/ContentModel'
import { isSystemField, UserField } from '../../types/foxcms.global'
import { Link } from '@reach/router'
import CircleButton from '../../components/CircleButton'

interface FieldRowProps {
  field: Field
  onEdit: (field: UserField) => void
  onDelete: (field: UserField) => void
}

const FieldRow: React.FC<FieldRowProps> = ({ field, onEdit, onDelete }) => {
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
          <Link
            className={css`
              text-decoration: none;
              color: ${colors.blue700};
              &:visited {
                color: ${colors.blue700};
              }
              &:hover {
                text-decoration: underline;
              }
            `}
            to={`../${field.relatesTo.id}`}
          >
            {fieldName(field)}
          </Link>
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
              onClick={() => onDelete(field)}
              className={css`
                color: ${colors.red300};
                &:hover:enabled {
                  background-color: ${colors.red100};
                }
              `}
            />
            <CircleButton
              icon="edit-2"
              onClick={() => onEdit(field)}
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
