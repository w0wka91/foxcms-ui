import gql from 'graphql-tag'
import { SCALAR_FIELD_FRAGMENT } from './fragments'

const ADD_SCALAR_FIELD = gql`
    mutation AddScalarField(
        $modelId: ID!,
        $fieldName: String!,
        $apiName: String!,
        $displayType: DisplayType!,
        $concern: Concern!,
        $constraint: Constraint!) {
        addScalarField(input: {
            modelId: $modelId,
            fieldName: $fieldName,
            apiName: $apiName,
            displayType: $displayType,
            concern: $concern,
            constraint: $constraint}) {
            ... on ScalarField {
                ...ScalarFieldParts
            }
        }
    }
    ${SCALAR_FIELD_FRAGMENT}
`

const DELETE_FIELD = gql`
    mutation DeleteField(
        $modelId: ID!,
        $fieldId: ID!) {
        deleteField(modelId: $modelId, id: $fieldId)
    }
`
export { ADD_SCALAR_FIELD, DELETE_FIELD }