import gql from 'graphql-tag'
import { SCALAR_FIELD_FRAGMENT } from './fragments'

const CONTENT_MODEL = gql`
  query ContentModel($modelId: ID!) {
    contentModel(modelId: $modelId) {
      id
      apiName
      name
      description
      fields {
        name
        apiName
        ... on ScalarField {
          ...ScalarFieldParts
        }
        ... on ListField {
          id
          type
        }
        ... on RelationField {
          id
          relationType: type
          relatesTo {
            id
            name
          }
        }
      }
    }
  }
  ${SCALAR_FIELD_FRAGMENT}
`

const CONTENT_MODELS = gql`
  query ContentModels($branchId: ID!) {
    contentModels(branchId: $branchId) {
      id
      apiName
      name
      description
      updatedAt
      fields {
        name
        apiName
        ... on ScalarField {
          type
          concern
          constraint
        }
      }
    }
  }
`

export { CONTENT_MODELS, CONTENT_MODEL }
