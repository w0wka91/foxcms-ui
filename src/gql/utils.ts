import {
  ContentModel_contentModel,
  ContentModel_contentModel_fields_RelationField_relatesTo,
} from '../generated/ContentModel'
import gql from 'graphql-tag'
import pluralize from 'pluralize'
import {
  isUserField,
  isScalarField,
  ScalarField,
  isRelationField,
} from '../types/foxcms.global'
import { DisplayType } from '../generated/globalTypes'

interface Field {
  __typename?: string
  apiName: string
}

const queryFields = (
  contentModel:
    | ContentModel_contentModel
    | ContentModel_contentModel_fields_RelationField_relatesTo
    | null
    | undefined
) => {
  let fields: Array<Field> = contentModel?.fields ?? [{ apiName: 'id' }]
  const scalarFields = fields
    .filter(f => f.__typename !== 'RelationField')
    .map(f => f.apiName)
  const relationFields = fields
    .filter(f => f.__typename === 'RelationField')
    .map(f => `${f.apiName} { id } `)
  return scalarFields.concat(relationFields)
}

const generateQuery = (
  contentModel:
    | ContentModel_contentModel
    | ContentModel_contentModel_fields_RelationField_relatesTo
    | null
    | undefined,
  contentId?: string
) => {
  const fieldQuery = queryFields(contentModel)
  if (contentId) {
    return gql`
    query {
        ${contentModel?.apiName.toLowerCase() ??
          'modelName'}(where: {id: "${contentId}"}) {
            ${fieldQuery}
        }
    }`
  } else {
    const pluralizedApiName = pluralize(
      contentModel?.apiName ?? 'modelName'
    ).toLowerCase()
    return gql`
      query {
          ${pluralizedApiName} {
            ${fieldQuery}
          }
      }`
  }
}

const normalizeValue = (scalarField: ScalarField, val: any) => {
  if (!val) return null
  const escapedValue = typeof val === 'string' ? val.replace(/"/g, '\\"') : val
  switch (scalarField.type) {
    case DisplayType.SINGLE_LINE_TEXT:
    case DisplayType.DATE:
      return `"${escapedValue}"`
    case DisplayType.MULTI_LINE_TEXT:
    case DisplayType.JSON_EDITOR:
      return `"""${escapedValue}"""`
    default:
      return escapedValue
  }
}

const generateMutation = (
  contentModel: ContentModel_contentModel | null | undefined,
  data: any,
  contentId?: string
) => {
  const scalarFieldData = contentModel?.fields
    .filter(f => isUserField(f) && isScalarField(f))
    .map(
      f => `${f.apiName}: ${normalizeValue(f as ScalarField, data[f.apiName])}`
    )
  const relationFieldData = contentModel?.fields
    .filter(f => isRelationField(f) && data[f.apiName])
    .map(f => {
      if (Array.isArray(data[f.apiName])) {
        return `${f.apiName}: { ${contentId ? 'set' : 'connect'}: [ ${data[
          f.apiName
        ]
          .map((val: any) => `{ id: "${val.value}" }`)
          .join(',')} ] }`
      } else {
        return `${f.apiName}: { connect: { id: "${data[f.apiName].value}" } }`
      }
    })
  const updateData = scalarFieldData?.concat(relationFieldData ?? []).join(', ')
  if (!contentId) {
    return gql`
    mutation {
      create${contentModel?.apiName}(data: { ${updateData ??
      'placeholder: placeholder'}, status: Published }) {
        id
      }
    }`
  } else {
    const fieldQuery = queryFields(contentModel)
    return gql`
    mutation {
      update${contentModel?.apiName}(data: { ${updateData ??
      'placeholder: placeholder'}, status: Published }, where: { id: "${contentId}"}) {
        id createdAt updatedAt status ${fieldQuery}
      }
    }`
  }
}

export { generateQuery, generateMutation }
