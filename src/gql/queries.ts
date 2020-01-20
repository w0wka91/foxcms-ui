import gql from 'graphql-tag'
import { CONTENT_MODEL_FRAGMENT } from './fragments'

const CONTENT_MODEL = gql`
  query ContentModel($modelId: ID!) {
    contentModel(modelId: $modelId) {
      ...ContentModelParts
    }
  }
  ${CONTENT_MODEL_FRAGMENT}
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
