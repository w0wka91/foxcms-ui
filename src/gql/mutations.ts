import gql from 'graphql-tag'
import {
  SCALAR_FIELD_FRAGMENT,
  RELATION_FIELD_FRAGMENT,
  CONTENT_MODEL_FRAGMENT,
} from './fragments'

const ADD_CONTENT_MODEL = gql`
  mutation AddContentModel(
    $branchId: ID!
    $name: String!
    $apiName: String!
    $description: String!
  ) {
    addContentModel(
      input: {
        branchId: $branchId
        name: $name
        apiName: $apiName
        description: $description
      }
    ) {
      ...ContentModelParts
    }
  }
  ${CONTENT_MODEL_FRAGMENT}
`

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
      modelId
      field {
        ... on RelationField {
          ...RelationFieldParts
        }
      }
    }
  }
  ${RELATION_FIELD_FRAGMENT}
`

const DELETE_FIELD = gql`
  mutation DeleteField($modelId: ID!, $fieldId: ID!) {
    deleteField(modelId: $modelId, id: $fieldId) {
      modelId
      fieldId
    }
  }
`
export { ADD_SCALAR_FIELD, DELETE_FIELD, ADD_RELATION_FIELD, ADD_CONTENT_MODEL }
