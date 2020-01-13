import gql from 'graphql-tag'
import {
  SCALAR_FIELD_FRAGMENT,
  RELATION_FIELD_FRAGMENT,
  CONTENT_MODEL_FRAGMENT,
} from './fragments'

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
          ...RelationFieldParts
        }
      }
    }
  }
  ${SCALAR_FIELD_FRAGMENT}
  ${RELATION_FIELD_FRAGMENT}
`

const CONTENT_MODELS = gql`
  query ContentModels($branchId: ID!) {
    contentModels(branchId: $branchId) {
      ...ContentModelParts
    }
  }
  ${CONTENT_MODEL_FRAGMENT}
`

export { CONTENT_MODELS, CONTENT_MODEL }
