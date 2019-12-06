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
                    type
                }
                ... on RelationField {
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

export { CONTENT_MODEL }