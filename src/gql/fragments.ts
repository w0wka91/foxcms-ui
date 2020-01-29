import gql from 'graphql-tag'

const SCALAR_FIELD_FRAGMENT = gql`
  fragment ScalarFieldParts on ScalarField {
    id
    name
    apiName
    position
    type
    concern
    constraint
  }
`

const ASSET_FIELD_FRAGMENT = gql`
  fragment AssetFieldParts on AssetField {
    id
    name
    apiName
    position
    concern
  }
`

const RELATION_FIELD_FRAGMENT = gql`
  fragment RelationFieldParts on RelationField {
    id
    name
    apiName
    position
    relationType: type
    relatesTo {
      id
      apiName
      name
      previewField {
        name
        apiName
      }
      fields {
        name
        apiName
        position
        ... on ScalarField {
          ...ScalarFieldParts
        }
        ... on ListField {
          id
          type
        }
        ... on RelationField {
          relationType: type
        }
      }
    }
  }
  ${SCALAR_FIELD_FRAGMENT}
`

const CONTENT_MODEL_FRAGMENT = gql`
  fragment ContentModelParts on ContentModel {
    id
    apiName
    name
    description
    updatedAt
    previewField {
      name
      apiName
    }
    fields {
      name
      apiName
      position
      ... on ScalarField {
        ...ScalarFieldParts
      }
      ... on ListField {
        id
        type
      }
      ... on AssetField {
        ...AssetFieldParts
      }
      ... on RelationField {
        ...RelationFieldParts
      }
    }
  }
  ${SCALAR_FIELD_FRAGMENT}
  ${RELATION_FIELD_FRAGMENT}
  ${ASSET_FIELD_FRAGMENT}
`

export {
  SCALAR_FIELD_FRAGMENT,
  RELATION_FIELD_FRAGMENT,
  CONTENT_MODEL_FRAGMENT,
  ASSET_FIELD_FRAGMENT,
}
