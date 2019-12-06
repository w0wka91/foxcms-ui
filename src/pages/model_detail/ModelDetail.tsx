import { RouteComponentProps } from '@reach/router'
import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Dropdown } from 'react-atomicus'
import { css } from 'emotion'
import {
  ContentModel,
  ContentModel_contentModel_fields_ListField as ListField,
  ContentModel_contentModel_fields_ScalarField as ScalarField,
} from '../../generated/ContentModel'
import { DisplayType } from '../../generated/globalTypes'
import { typeIcon } from './field-utils'
import { FieldRow } from './FieldRow'
import { ScalarFieldDialog } from './ScalarFieldDialog'
import { NewField } from '../../types/NewField'
import { CONTENT_MODEL } from '../../gql/queries'

interface ModelDetailProps extends RouteComponentProps {
  branchId?: string
  modelId?: string
}

const ModelDetail: React.FC<ModelDetailProps> = ({ branchId, modelId }) => {
  const { data, loading } = useQuery<ContentModel>(CONTENT_MODEL, {
    variables: { modelId },
  })
  const [showFieldDialog, setShowFieldDialog] = useState(false)
  const [scalarField, setScalarField] = useState<ScalarField | ListField | NewField>({ type: DisplayType.SINGLE_LINE_TEXT })

  if (loading) return null
  return data?.contentModel ? (
    <>
      <ScalarFieldDialog
        contentModel={data.contentModel}
        isOpen={showFieldDialog}
        field={scalarField}
        onClose={() => setShowFieldDialog(false)}
      />

      <div
        className={css`
            margin-top: 4.8rem;
          `}
      >
        <PageHeader title={data.contentModel.name}>
          <Dropdown
            label="Create field"
            icon="chevron-down"
            onSelect={item => {
              setShowFieldDialog(true)
              setScalarField({ type: item.key as DisplayType })
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
          <FieldRow
            key={field.apiName}
            field={field}
            onDelete={() => alert('delete')}
            onEdit={field => {
              if (field.__typename === 'ScalarField' || field.__typename === 'ListField') {
                setScalarField(field)
              }
              setShowFieldDialog(true)
            }}/>
        ))}
      </div>
    </>
  ) : null
}

export { ModelDetail }
