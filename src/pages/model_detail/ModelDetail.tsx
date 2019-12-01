import { RouteComponentProps } from '@reach/router'
import gql from 'graphql-tag'
import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Dropdown } from 'react-atomicus'
import { css } from 'emotion'
import { ContentModel } from '../../generated/ContentModel'
import { DisplayType } from '../../generated/globalTypes'
import { typeIcon } from './field-utils'
import { FieldRow } from './FieldRow'

const CONTENT_MODEL = gql`
  query ContentModel($modelId: ID!) {
    contentModel(modelId: $modelId) {
      id
      apiName
      name
      description
      fields {
        name
        apiName
        ... on ScalarField {
          type
          concern
          constraint
        }
        ... on ListField {
          type
        }
        ... on RelationField {
          relationType: type
          relatesTo {
            id
            name
          }
        }
      }
    }
  }
`

interface ModelDetailProps extends RouteComponentProps {
  branchId?: string
  modelId?: string
}

const ModelDetail: React.FC<ModelDetailProps> = ({ branchId, modelId }) => {
  const { data, loading } = useQuery<ContentModel>(CONTENT_MODEL, {
    variables: { modelId },
  })
  if (loading) return null
  return data?.contentModel ? (
    <div
      className={css`
        margin-top: 4.8rem;
      `}
    >
      <PageHeader title={data.contentModel.name}>
        <Dropdown
          label="Create field"
          icon="chevron-down"
          onSelect={(item: any) => {
            alert(item)
          }}
          menuItems={[
            {
              key: DisplayType.SINGLE_LINE_TEXT,
              icon: typeIcon(DisplayType.SINGLE_LINE_TEXT),
              label: 'Single line text',
            },
            {
              key: DisplayType.MULTI_LINE_TEXT,
              icon: typeIcon(DisplayType.MULTI_LINE_TEXT),
              label: 'Multi line text',
            },
            {
              key: DisplayType.INTEGER,
              icon: typeIcon(DisplayType.INTEGER),
              label: 'Integer',
            },
            {
              key: DisplayType.FLOAT,
              icon: typeIcon(DisplayType.FLOAT),
              label: 'Float',
            },
            {
              key: DisplayType.CHECKBOX,
              icon: typeIcon(DisplayType.CHECKBOX),
              label: 'Checkbox',
            },
            {
              key: DisplayType.DATE,
              icon: typeIcon(DisplayType.DATE),
              label: 'Date',
            },
            {
              key: DisplayType.JSON_EDITOR,
              icon: typeIcon(DisplayType.JSON_EDITOR),
              label: 'JSON',
            },
          ]}
        />
      </PageHeader>
      {data.contentModel.fields.map(field => (
        <FieldRow field={field} />
      ))}
    </div>
  ) : null
}

export { ModelDetail }
