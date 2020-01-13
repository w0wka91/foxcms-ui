import React, { useEffect } from 'react'
import { Modal, Input, Button } from 'react-atomicus'
import { css } from 'emotion'
import {
  ContentModel_contentModel,
  ContentModel,
} from '../../../generated/ContentModel'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ContentModels } from '../../../generated/ContentModels'
import { CONTENT_MODELS, CONTENT_MODEL } from '../../../gql/queries'
import useForm from 'react-hook-form'
import { RelationType } from '../../../generated/globalTypes'
import pluralize from 'pluralize'
import snakeCase from 'lodash.snakecase'
import { RelationTypeList } from './RelationTypeList'
import { RelationFormCard } from './RelationFormCard'
import Select from 'react-select'
import { ADD_RELATION_FIELD } from '../../../gql/mutations'

interface RelationFieldModalProps {
  branchId?: string
  isOpen: boolean
  onClose: () => void
  contentModel: ContentModel_contentModel
}

const resolveFieldName = (
  contentModel: ContentModel_contentModel,
  relationType: RelationType
) => {
  return relationType === RelationType.ONE_TO_ONE ||
    relationType === RelationType.ONE_TO_MANY
    ? contentModel.name
    : pluralize(contentModel.name)
}

const RelationFieldModal: React.FC<RelationFieldModalProps> = ({
  isOpen,
  onClose,
  contentModel,
  branchId,
}) => {
  const { data, loading } = useQuery<ContentModels>(CONTENT_MODELS, {
    variables: { branchId },
  })
  const [addRelationField] = useMutation(ADD_RELATION_FIELD, {
    update(cache, { data: { addRelationField } }) {
      const data = cache.readQuery<ContentModel>({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
      })
      console.log(data)
      const fields = data?.contentModel?.fields?.concat(addRelationField)
      console.log(fields)
      cache.writeQuery({
        query: CONTENT_MODEL,
        variables: { modelId: contentModel.id },
        data: { contentModel: { ...data?.contentModel, fields } },
      })
    },
  })
  const { register, handleSubmit, setValue, watch, errors, reset } = useForm({
    defaultValues: {
      relationType: RelationType.ONE_TO_ONE,
      relatesToModel: null,
      relatesToFieldName: resolveFieldName(
        contentModel,
        RelationType.ONE_TO_ONE
      ),
      relatesToApiName: snakeCase(
        resolveFieldName(contentModel, RelationType.ONE_TO_ONE)
      ),
    },
  })
  const { relatesToModel, relationType } = watch()
  useEffect(() => {
    register({ name: 'relationType' })
    register({ name: 'relatesToModel' })
  }, [register])
  useEffect(() => {
    let fieldName = resolveFieldName(contentModel, relationType)
    setValue('relatesToFieldName', fieldName)
    setValue('relatesToApiName', snakeCase(fieldName))
    if (relatesToModel != null) {
      const swappedRelationType =
        relationType === RelationType.ONE_TO_MANY
          ? RelationType.MANY_TO_ONE
          : relationType === RelationType.MANY_TO_ONE
          ? RelationType.ONE_TO_MANY
          : relationType
      let fieldName = resolveFieldName(relatesToModel, swappedRelationType)
      setValue('fieldName', fieldName, true)
      setValue('apiName', snakeCase(fieldName), true)
    }
  }, [contentModel, relatesToModel, relationType, setValue])
  const onSubmit = async (data: any) => {
    await addRelationField({
      variables: {
        modelId: contentModel.id,
        fieldName: data.fieldName,
        apiName: data.apiName,
        relatesToModelId: data.relatesToModel.id,
        relatesToFieldName: data.relatesToFieldName,
        relatesToApiName: data.relatesToApiName,
        relationType: data.relationType,
      },
    })
    onClose()
    reset()
  }
  if (loading) return null
  return data ? (
    <Modal open={isOpen} onClose={onClose}>
      <Modal.Header>Create relation field</Modal.Header>
      <Modal.Content>
        <form
          id="relation-field-form"
          onSubmit={handleSubmit(onSubmit)}
          className={css`
            display: flex;
            align-items: center;
            justify-content: space-around;
          `}
        >
          <RelationFormCard title={contentModel.name}>
            <Input
              ref={e =>
                register(e, {
                  required: 'Please enter a name',
                })
              }
              iconRight="type"
              error={relatesToModel && errors?.fieldName?.message}
              disabled={!relatesToModel}
              name="fieldName"
              autoComplete="off"
              type="text"
              label="Name"
            />
            <Input
              ref={e =>
                register(e, {
                  required: 'Please enter a API name',
                })
              }
              error={relatesToModel && errors?.apiName?.message}
              disabled={!relatesToModel}
              iconRight="git-commit"
              name="apiName"
              autoComplete="off"
              type="text"
              label="API name"
            />
          </RelationFormCard>
          <RelationTypeList
            onSelect={relationType => {
              setValue('relationType', relationType)
            }}
          />
          <RelationFormCard
            title={
              <Select
                styles={{
                  control: styles => ({
                    ...styles,
                  }),
                }}
                className={css`
                  width: 19.2rem;
                `}
                placeholder="Select a model"
                onChange={(relatesToModel: any) =>
                  setValue('relatesToModel', relatesToModel.value)
                }
                value={
                  relatesToModel
                    ? { value: relatesToModel, label: relatesToModel.name }
                    : null
                }
                options={data.contentModels.map(model => ({
                  value: model,
                  label: model.name,
                }))}
              />
            }
          >
            <Input
              ref={e =>
                register(e, {
                  required: 'Please enter a name',
                })
              }
              error={errors?.relatesToFieldName?.message}
              iconRight="type"
              name="relatesToFieldName"
              autoComplete="off"
              type="text"
              label="Name"
            />
            <Input
              ref={e =>
                register(e, {
                  required: 'Please enter a name',
                })
              }
              error={errors?.relatesToApiName?.message}
              iconRight="git-commit"
              name="relatesToApiName"
              autoComplete="off"
              type="text"
              label="API name"
            />
          </RelationFormCard>
        </form>
      </Modal.Content>
      <Modal.Footer>
        <Button type="submit" form="relation-field-form" hierarchy="primary">
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
  ) : null
}

export { RelationFieldModal }
