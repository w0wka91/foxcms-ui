import gql from 'graphql-tag'
import { SCALAR_FIELD_FRAGMENT, RELATION_FIELD_FRAGMENT } from './fragments'

const ADD_SCALAR_FIELD = gql`
  mutation AddScalarField(
    $modelId: ID!
    $fieldName: String!
    $apiName: String!
    $displayType: DisplayType!
    $concern: Concern!
    $constraint: Constraint!
  ) {
    addScalarField(
      input: {
        modelId: $modelId
        fieldName: $fieldName
        apiName: $apiName
        displayType: $displayType
        concern: $concern
        constraint: $constraint
      }
    ) {
      ... on ScalarField {
        ...ScalarFieldParts
      }
    }
  }
  ${SCALAR_FIELD_FRAGMENT}
`

const ADD_RELATION_FIELD = gql`
  mutation AddRelationField(
    $modelId: ID!
    $fieldName: String!
    $apiName: String!
    $relatesToModelId: ID!
    $relatesToFieldName: String!
    $relatesToApiName: String!
    $relationType: RelationType!
  ) {
    addRelationField(
      input: {
        modelId: $modelId
        fieldName: $fieldName
        apiName: $apiName
        relatesToModelId: $relatesToModelId
        relatesToFieldName: $relatesToFieldName
        relatesToApiName: $relatesToApiName
        relationType: $relationType
      }
    ) {
      ... on RelationField {
        ...RelationFieldParts
      }
    }
  }
  ${RELATION_FIELD_FRAGMENT}
`

const DELETE_FIELD = gql`
  mutation DeleteField($modelId: ID!, $fieldId: ID!) {
    deleteField(modelId: $modelId, id: $fieldId)
  }
`
export { ADD_SCALAR_FIELD, DELETE_FIELD, ADD_RELATION_FIELD }
