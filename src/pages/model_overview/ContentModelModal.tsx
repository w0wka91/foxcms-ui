import {
  ContentModel,
  ContentModel_contentModel,
} from '../../generated/ContentModel'
import { Concern, Constraint } from '../../generated/globalTypes'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import snakeCase from 'lodash.snakecase'
import { Button, Input, Modal } from 'react-atomicus'
import { css } from 'emotion'
import { useMutation } from '@apollo/react-hooks'
import { CONTENT_MODEL, CONTENT_MODELS } from '../../gql/queries'
import { ADD_CONTENT_MODEL } from '../../gql/mutations'
import {
  FieldSkeleton,
  isFieldSkeleton,
  isListField,
  isScalarField,
  ListField,
  ScalarField,
} from '../../types/foxcms.global'
import { ContentModels } from '../../generated/ContentModels'

interface ContentModelModalProps {
  branchId?: string
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  apiName: string
  description: string
}

const ContentModelModal: React.FC<ContentModelModalProps> = ({
  branchId,
  isOpen,
  onClose,
}) => {
  const [addContentModel] = useMutation(ADD_CONTENT_MODEL, {
    update(cache, { data: { addContentModel } }) {
      const data = cache.readQuery<ContentModels>({
        query: CONTENT_MODELS,
        variables: { branchId },
      })
      const models = data?.contentModels?.concat(addContentModel)
      cache.writeQuery({
        query: CONTENT_MODELS,
        variables: { branchId },
        data: { contentModels: models },
      })
    },
  })
  const [apiNameTouched, setApiNameTouched] = useState(false)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const { register, handleSubmit, setValue, errors, reset, watch } = useForm<
    FormData
  >()
  useEffect(() => {
    if (isOpen) setTimeout(() => nameRef.current?.focus(), 50)
  }, [isOpen, nameRef])
  const onSubmit = async (data: any) => {
    await addContentModel({
      variables: {
        branchId,
        name: data.name,
        apiName: data.apiName,
        description: data.description,
      },
    })
    onClose()
    reset()
  }
  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      className={css`
        width: 50rem;
      `}
    >
      <Modal.Header>Create content model</Modal.Header>
      <Modal.Content>
        <form
          id="content-model-form"
          onSubmit={handleSubmit(onSubmit)}
          className={css`
            & > * {
              margin-bottom: 1.2rem;
            }
          `}
        >
          <Input
            name="name"
            label="Name"
            iconRight="type"
            type="text"
            autoComplete="off"
            onChange={evt => {
              if (!apiNameTouched) {
                setValue('apiName', evt.currentTarget.value)
              }
            }}
            error={errors?.name?.message}
            ref={e => {
              register(e, {
                required: 'Please enter a name',
                pattern: {
                  value: /^[a-zA-Z0-9 _]*$/,
                  message: 'The name must be alphanumeric',
                },
                minLength: {
                  value: 3,
                  message: 'The name must contain at least 3 characters',
                },
                maxLength: {
                  value: 64,
                  message: 'The name can contain at most 64 characters',
                },
              })
              nameRef.current = e
            }}
          />
          <Input
            name="apiName"
            label="API name"
            onFocus={() => setApiNameTouched(true)}
            iconRight="git-commit"
            type="text"
            autoComplete="off"
            error={errors?.apiName?.message}
            ref={register({
              required: 'Please enter a API name',
              pattern: {
                value: /^[a-zA-Z0-9_]*$/,
                message: 'The API name must be alphanumeric',
              },
              minLength: {
                value: 3,
                message: 'The API name must contain at least 3 characters',
              },
              maxLength: {
                value: 64,
                message: 'The API name can contain at most 64 characters',
              },
            })}
          />
          <Input
            name="description"
            label="Description"
            iconRight="align-justify"
            type="text"
            autoComplete="off"
            error={errors?.description?.message}
            ref={register}
          />
        </form>
      </Modal.Content>
      <Modal.Footer>
        <Button type="submit" form="content-model-form" hierarchy="primary">
          Create
        </Button>
        <Button
          type="button"
          hierarchy="tertiary"
          onClick={() => {
            reset()
            onClose()
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { ContentModelModal }
