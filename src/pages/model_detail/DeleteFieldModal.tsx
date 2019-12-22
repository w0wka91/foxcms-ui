import { isUserField, UserField } from '../../types/foxcms.global'
import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_FIELD } from '../../gql/mutations'
import { ContentModel } from '../../generated/ContentModel'
import { CONTENT_MODEL } from '../../gql/queries'
import { Button, colors, Modal } from 'react-atomicus'
import { css } from 'emotion'

interface DeleteFieldModalProps {
  isOpen: boolean
  onClose: () => void
  modelId?: string
  field?: UserField
}

const DeleteFieldModal: React.FC<DeleteFieldModalProps> = ({ isOpen, onClose, field, modelId }) => {
  const [deleteField] = useMutation(DELETE_FIELD, {
    variables: {
      modelId: modelId,
      fieldId: field?.id,
    },
    update(cache, { data: { deleteField } }) {
      const data = cache.readQuery<ContentModel>({ query: CONTENT_MODEL, variables: { modelId: modelId } })
      const fields = data?.contentModel
        ?.fields
        ?.filter(f => isUserField(f) && f.id !== field?.id)
      cache.writeQuery({
        query: CONTENT_MODEL,
        variables: { modelId: modelId },
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

export { DeleteFieldModal }