import { RouteComponentProps } from '@reach/router'
import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Button, colors, Dropdown, Modal } from 'react-atomicus'
import { css } from 'emotion'
import {
  ContentModel,
  ContentModel_contentModel_fields as Field,
  ContentModel_contentModel_fields_ListField as ListField,
  ContentModel_contentModel_fields_ScalarField as ScalarField,
} from '../../generated/ContentModel'
import { DisplayType } from '../../generated/globalTypes'
import { typeIcon } from './field-utils'
import { FieldRow } from './FieldRow'
import { ScalarFieldDialog } from './ScalarFieldDialog'
import { NewField } from '../../types/NewField'
import { CONTENT_MODEL } from '../../gql/queries'
import { DELETE_FIELD } from '../../gql/mutations'

const isSystemField = (field: Field) =>
  field.__typename === 'ScalarField' || field.__typename === 'ListField' || field.__typename === 'RelationField'

interface DeleteField {
  modelId?: string
  fieldId?: string
}

interface DeleteFieldDialogProps {
  isOpen: boolean
  onClose: () => void
  field?: DeleteField
}

const DeleteFieldDialog: React.FC<DeleteFieldDialogProps> = ({ isOpen, onClose, field }) => {
  const [deleteField] = useMutation(DELETE_FIELD, {
    variables: {
      modelId: field?.modelId,
      fieldId: field?.fieldId,
    },
    update(cache, { data: { deleteField } }) {
      const data = cache.readQuery<ContentModel>({ query: CONTENT_MODEL, variables: { modelId: field?.modelId } })
      const fields = data?.contentModel
        ?.fields
        ?.filter(field => field.__typename === 'ScalarField' || field.__typename === 'ListField' || field.__typename === 'RelationField')
        ?.filter(field => field.id)
      cache.writeQuery({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
        data: { contentModel: { ...data?.contentModel, fields } },
      })
    },
  })
  return (
    <Modal onClose={onClose} open={isOpen}>
      <Modal.Header>Delete field</Modal.Header>
      <Modal.Content>
        <p
          className={css`
            width: 51.2rem;
            font-color: ${colors.grey800};
        `}>
          By removing this field you will delete <b>ALL</b> content associated with it. Are you sure you want to
          proceed?
        </p>
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="button"
          onClick={async () => {
            await deleteField()
            onClose()
          }}
          intent="danger">
          Delete
        </Button>
        <Button
          type="button"
          hierarchy="tertiary"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

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

  const [showDeleteFieldDialog, setShowDeleteFieldDialog] = useState(false)
  const [deleteField, setDeleteField] = useState<DeleteField | undefined>()

  if (loading) return null
  return data?.contentModel ? (
    <>
      <ScalarFieldDialog
        contentModel={data.contentModel}
        isOpen={showFieldDialog}
        field={scalarField}
        onClose={() => setShowFieldDialog(false)}
      />
      <DeleteFieldDialog
        isOpen={showDeleteFieldDialog}
        onClose={() => setShowDeleteFieldDialog(false)}
        field={deleteField}
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
            onDelete={field => {
              if (field.__typename === 'ScalarField' || field.__typename === 'ListField' || field.__typename === 'RelationField') {
                setDeleteField({ modelId, fieldId: field.id })
              }
              setShowDeleteFieldDialog(true)
            }}
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
