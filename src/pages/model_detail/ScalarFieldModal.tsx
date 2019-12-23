import { ContentModel, ContentModel_contentModel } from '../../generated/ContentModel'
import { Concern, Constraint } from '../../generated/globalTypes'
import React, { useEffect, useState } from 'react'
import useForm from 'react-hook-form'
import snakeCase from 'lodash.snakecase'
import { Button, Input, Modal, Toggle } from 'react-atomicus'
import { css } from 'emotion'
import { typeName } from './field-utils'
import { useMutation } from '@apollo/react-hooks'
import { CONTENT_MODEL } from '../../gql/queries'
import { ADD_SCALAR_FIELD } from '../../gql/mutations'
import {
  FieldSkeleton,
  isFieldSkeleton,
  isListField,
  isScalarField,
  ListField,
  ScalarField,
} from '../../types/foxcms.global'

interface ScalarFieldDialogProps {
  contentModel: ContentModel_contentModel
  isOpen: boolean
  onClose: () => void
  field: ScalarField | ListField | FieldSkeleton
}

const ScalarFieldModal: React.FC<ScalarFieldDialogProps> = ({ contentModel, isOpen, onClose, field }) => {
  const [apiNameTouched, setApiNameTouched] = useState(false)
  const [addScalarField] = useMutation(ADD_SCALAR_FIELD, {
    update(cache, { data: { addScalarField } }) {
      const data = cache.readQuery<ContentModel>({ query: CONTENT_MODEL, variables: { modelId: contentModel.id } })
      const fields = data?.contentModel?.fields?.concat(addScalarField)
      cache.writeQuery({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
        data: { contentModel: { ...data?.contentModel, fields } },
      })
    },
  })

  const { register, handleSubmit, setValue, errors, reset, watch } = useForm({
    defaultValues: {
      list: false,
      required: false,
      unique: false,
    },
  })
  const { list, required, unique } = watch()
  useEffect(() => {
    register({ name: 'list' })
    register({ name: 'required' })
    register({ name: 'unique' })
  }, [register])

  useEffect(() => {
    if (isScalarField(field) || isListField(field)) {
      setValue('name', field?.name)
      setValue('apiName', field?.apiName)
      setValue('list', isListField(field))
      setValue('required', isScalarField(field) && field.concern === Concern.REQUIRED)
      setValue('unique', isScalarField(field) && field.constraint === Constraint.UNIQUE)
    } else {
      reset()
    }
  }, [field, reset, setValue])

  const onSubmit = async (data: any) => {
    if (isFieldSkeleton(field)) {
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
      onClose()
      reset()
    } else {
      console.log('Update field...')
    }
  }

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      className={css`
          width: 50rem;
        `}
    >
      <Modal.Header>{isFieldSkeleton(field) ? 'Create' : 'Update'} {typeName(field.type)} field</Modal.Header>
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
            ref={register({
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
            })}
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
          <Toggle
            name="list"
            checked={list}
            onChange={e => setValue('list', e.currentTarget.checked)}
            label="Allow multiple values"/>
          <Toggle
            name="required"
            checked={required}
            onChange={e => setValue('required', e.currentTarget.checked)}
            label="Is field required"
            disabled={isListField(field)}/>
          <Toggle
            name="unique"
            checked={unique}
            onChange={e => setValue('unique', e.currentTarget.checked)}
            label="Is field unique"
            disabled={isListField(field)}/>
        </form>
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="submit"
          form="scalar-field-form"
          hierarchy="primary">
          {isFieldSkeleton(field) ? 'Create' : 'Update'}
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