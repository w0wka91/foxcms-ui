import React from 'react'
import { RelationField } from '../../types/foxcms.global'
import { FormContextValues, Controller } from 'react-hook-form'
import { useQuery } from '@apollo/react-hooks'
import { generateQuery } from '../../gql/utils'
import { RelationType } from '../../generated/globalTypes'
import pluralize from 'pluralize'
import { Label, Select } from 'react-atomicus'

interface RelationInputProps {
  field: RelationField
  value: any
  formContext: Omit<
    FormContextValues<any>,
    'handleSubmit' | 'formState' | 'watch'
  >
  contentClient: any
}

const RelationInput = ({
  field,
  value,
  formContext,
  contentClient,
}: RelationInputProps) => {
  const { data: contentData } = useQuery(generateQuery(field.relatesTo), {
    client: contentClient,
  })
  const isMulti =
    field.relationType === RelationType.ONE_TO_MANY ||
    field.relationType === RelationType.MANY_TO_MANY
  const content =
    contentData && contentData[pluralize(field.relatesTo.apiName).toLowerCase()]
  const options =
    contentData &&
    content.map((entry: any) => ({
      value: entry.id,
      label: entry[field.relatesTo.previewField.apiName],
    }))
  let defaultValue
  if (isMulti && Array.isArray(value)) {
    defaultValue = value.map((val: any) => ({
      value: val.id,
      label: options?.find((opt: any) => opt.value === val.id)?.label,
      relatesToModel: field.relatesTo,
    }))
  } else {
    defaultValue = value && {
      value: value.id,
      label: options?.find((opt: any) => opt.value === value.id)?.label,
      relatesToModel: field.relatesTo,
    }
  }
  return options ? (
    <div>
      <Label>{field.name}</Label>
      <Controller
        isMulti={isMulti}
        defaultValue={defaultValue}
        name={field.apiName}
        as={Select}
        options={options}
        placeholder={`Select a ${field.relatesTo.name}`}
        control={formContext.control}
        onChange={([selected]) => ({ value: selected })}
      />
    </div>
  ) : null
}

export { RelationInput }
