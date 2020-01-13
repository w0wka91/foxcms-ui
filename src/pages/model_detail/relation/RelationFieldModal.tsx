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
import { useForm, Controller } from 'react-hook-form'
import { RelationType } from '../../../generated/globalTypes'
import pluralize from 'pluralize'
import snakeCase from 'lodash.snakecase'
import { RelationTypeList } from './RelationTypeList'
import { RelationFormCard } from './RelationFormCard'
import Select from 'react-select'
import { ADD_RELATION_FIELD } from '../../../gql/mutations'
import { AddRelationField_addRelationField as AddRelationPayload } from '../../../generated/AddRelationField'

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

interface FormData {
  fieldName: string
  apiName: string
  relationType: RelationType
  relatesToModel: {
    value: ContentModel_contentModel
    label: string
  } | null
  relatesToFieldName: string
  relatesToApiName: string
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
      addRelationField.forEach((newRelation: AddRelationPayload) => {
        try {
          const data = cache.readQuery<ContentModel>({
            query: CONTENT_MODEL,
            variables: { modelId: newRelation.modelId },
          })
          const fields = data?.contentModel?.fields?.concat(newRelation.field)
          cache.writeQuery({
            query: CONTENT_MODEL,
            variables: { modelId: newRelation.modelId },
            data: { contentModel: { ...data?.contentModel, fields } },
          })
        } catch (ex) {
          // readQuery throws an error currently if there is no data present
        }
      })
    },
  })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      relationType: RelationType.ONE_TO_ONE,
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
    let fieldName = resolveFieldName(contentModel, relationType as RelationType)
    setValue('relatesToFieldName', fieldName)
    setValue('relatesToApiName', snakeCase(fieldName))
    if (relatesToModel != null) {
      const swappedRelationType =
        relationType === RelationType.ONE_TO_MANY
          ? RelationType.MANY_TO_ONE
          : relationType === RelationType.MANY_TO_ONE
          ? RelationType.ONE_TO_MANY
          : relationType
      let fieldName = resolveFieldName(
        relatesToModel.value,
        swappedRelationType as RelationType
      )
      setValue('fieldName', fieldName, true)
      setValue('apiName', snakeCase(fieldName), true)
    }
  }, [contentModel, relatesToModel, relationType, setValue])
  const closeModal = () => {
    setValue('relatesToModel', null)
    reset()
    onClose()
  }
  const onSubmit = async (data: any) => {
    await addRelationField({
      variables: {
        modelId: contentModel.id,
        fieldName: data.fieldName,
        apiName: data.apiName,
        relatesToModelId: data.relatesToModel.value.id,
        relatesToFieldName: data.relatesToFieldName,
        relatesToApiName: data.relatesToApiName,
        relationType: data.relationType,
      },
    })
    closeModal()
  }
  if (loading) return null
  return data ? (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={css`
        max-width: 999rem;
      `}
    >
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
              ref={register({
                required: 'Please enter a name',
              })}
              iconRight="type"
              error={relatesToModel ? errors?.fieldName?.message : ''}
              disabled={!relatesToModel}
              name="fieldName"
              autoComplete="off"
              type="text"
              label="Name"
            />
            <Input
              ref={register({
                required: 'Please enter a API name',
              })}
              error={relatesToModel ? errors?.relatesToApiName?.message : ''}
              disabled={!relatesToModel}
              iconRight="git-commit"
              name="apiName"
              autoComplete="off"
              type="text"
              label="API name"
            />
          </RelationFormCard>
          <Controller
            as={RelationTypeList}
            name="relationType"
            value={relationType}
            control={control}
          />
          <RelationFormCard
            title={
              <Controller
                as={
                  <Select
                    styles={{
                      control: styles => ({
                        ...styles,
                        width: '19.2rem',
                      }),
                    }}
                  />
                }
                options={data.contentModels
                  .filter(model => model.id !== contentModel.id)
                  .map(model => ({
                    value: model as ContentModel_contentModel,
                    label: model.name,
                  }))}
                placeholder="Select a model"
                control={control}
                rules={{ required: true }}
                onChange={([selected]) => {
                  return { value: selected }
                }}
                name="relatesToModel"
              />
            }
          >
            <Input
              ref={register({
                required: 'Please enter a name',
              })}
              error={errors?.relatesToFieldName?.message}
              iconRight="type"
              name="relatesToFieldName"
              autoComplete="off"
              type="text"
              label="Name"
            />
            <Input
              ref={register({
                required: 'Please enter a name',
              })}
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
        <Button type="button" hierarchy="tertiary" onClick={closeModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null
}

export { RelationFieldModal }
