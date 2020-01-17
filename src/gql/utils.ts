import { ContentModel_contentModel } from '../generated/ContentModel'
import gql from 'graphql-tag'
import pluralize from 'pluralize'
import { isUserField, isScalarField, ScalarField } from '../types/foxcms.global'
import { DisplayType } from '../generated/globalTypes'

const generateQuery = (
  contentModel: ContentModel_contentModel | null | undefined,
  contentId?: string
) => {
  const cols = contentModel?.fields.map(f => `${f.apiName} `)
  if (contentId) {
    return gql`
    query {
        ${contentModel?.apiName.toLowerCase() ??
          'modelName'}(where: {id: "${contentId}"}) {
            ${cols}
        }
    }
    `
  } else {
    const pluralizedApiName = pluralize(
      contentModel?.apiName ?? 'modelName'
    ).toLowerCase()
    return gql`
      query {
          ${pluralizedApiName} {
            ${cols}
          }
      }
      `
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
  if (!contentId) {
    return gql`
    mutation {
      create${contentModel?.apiName}(data: { ${scalarFieldData?.join(', ') ??
      'placeholder: placeholder'}, status: Published }) {
        id
      }
    }`
  } else {
    return gql`
    mutation {
      update${contentModel?.apiName}(data: { ${scalarFieldData?.join(', ') ??
      'placeholder: placeholder'}, status: Published }, where: { id: "${contentId}"}) {
        id createdAt updatedAt status ${Object.keys(data).join(' ')}
      }
    }`
  }
}

export { generateQuery, generateMutation }
