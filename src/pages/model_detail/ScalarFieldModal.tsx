import {
  ContentModel,
  ContentModel_contentModel,
} from '../../generated/ContentModel'
import { Concern, Constraint } from '../../generated/globalTypes'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import snakeCase from 'lodash.snakecase'
import { Button, Input, Modal, Toggle } from 'react-atomicus'
import { css } from 'emotion'
import { fieldTypeName } from './field-utils'
import { useMutation } from '@apollo/react-hooks'
import { CONTENT_MODEL } from '../../gql/queries'
import { ADD_SCALAR_FIELD, ADD_ASSET_FIELD } from '../../gql/mutations'
import {
  FieldSkeleton,
  isFieldSkeleton,
  isListField,
  isScalarField,
  ListField,
  ScalarField,
  AssetField,
  isAssetField,
  SystemModel,
} from '../../types/foxcms.global'

interface ScalarFieldDialogProps {
  contentModel: ContentModel_contentModel
  isOpen: boolean
  onClose: () => void
  field: ScalarField | ListField | AssetField | FieldSkeleton
}

interface FormData {
  name: string
  apiName: string
  list: boolean
  required: boolean
  unique: boolean
}

const ScalarFieldModal: React.FC<ScalarFieldDialogProps> = ({
  contentModel,
  isOpen,
  onClose,
  field,
}) => {
  const [apiNameTouched, setApiNameTouched] = useState(false)
  const [addScalarField] = useMutation(ADD_SCALAR_FIELD, {
    update(cache, { data: { addScalarField } }) {
      const data = cache.readQuery<ContentModel>({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
      })
      const fields = data?.contentModel?.fields?.concat(addScalarField)
      cache.writeQuery({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
        data: { contentModel: { ...data?.contentModel, fields } },
      })
    },
  })
  const [addAssetField] = useMutation(ADD_ASSET_FIELD, {
    update(cache, { data: { addAssetField } }) {
      const data = cache.readQuery<ContentModel>({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
      })
      const fields = data?.contentModel?.fields?.concat(addAssetField)
      cache.writeQuery({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
        data: { contentModel: { ...data?.contentModel, fields } },
      })
    },
  })
  const { register, handleSubmit, setValue, errors, reset, control } = useForm<
    FormData
  >({
    defaultValues: {
      list: false,
      required: false,
      unique: false,
    },
  })
  useEffect(() => {
    if (!isFieldSkeleton(field)) {
      setValue('name', field?.name)
      setValue('apiName', field?.apiName)
      setValue('list', isListField(field))
      setValue(
        'required',
        (isScalarField(field) || isAssetField(field)) &&
          field.concern === Concern.REQUIRED
      )
      setValue(
        'unique',
        isScalarField(field) && field.constraint === Constraint.UNIQUE
      )
    } else {
      reset()
    }
  }, [field, reset, setValue])

  const onSubmit = async (data: any) => {
    if (isFieldSkeleton(field)) {
      if (field.type === SystemModel.ASSET) {
        await addAssetField({
          variables: {
            modelId: contentModel.id,
            fieldName: data.name,
            apiName: data.apiName,
            concern: data.required ? Concern.REQUIRED : Concern.OPTIONAL,
          },
        })
      } else {
        await addScalarField({
          variables: {
            modelId: contentModel.id,
            fieldName: data.name,
            apiName: data.apiName,
            displayType: field.type,
            concern: data.required ? Concern.REQUIRED : Concern.OPTIONAL,
            constraint: data.unique ? Constraint.UNIQUE : Constraint.NONE,
          },
        })
      }
      onClose()
      reset()
    } else {
      console.log('Update field...')
    }
  }
  const action = useMemo(() => (isFieldSkeleton(field) ? 'Create' : 'Update'), [
    field,
  ])
  const nameRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (isOpen) setTimeout(() => nameRef.current?.focus(), 50)
  }, [isOpen, nameRef])

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      className={css`
        width: 50rem;
      `}
    >
      <Modal.Header>{`${action} ${fieldTypeName(field)}`} field</Modal.Header>
      <Modal.Content>
        <form
          id="scalar-field-form"
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
                setValue('apiName', snakeCase(evt.currentTarget.value))
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
          <Controller
            name="list"
            disabled={true}
            control={control}
            as={Toggle}
            label="Allow multiple values"
          />
          <Controller
            name="required"
            control={control}
            as={Toggle}
            label="Is field required"
          />
          <Controller
            name="unique"
            control={control}
            as={Toggle}
            label="Is field unique"
          />
        </form>
      </Modal.Content>
      <Modal.Footer>
        <Button type="submit" form="scalar-field-form" hierarchy="primary">
          {action}
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

export { ScalarFieldModal }
