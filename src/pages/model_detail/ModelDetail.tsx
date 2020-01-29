import { RouteComponentProps } from '@reach/router'
import React, { useReducer } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Dropdown, Button, colors } from 'react-atomicus'
import { css } from 'emotion'
import { ContentModel } from '../../generated/ContentModel'
import { DisplayType } from '../../generated/globalTypes'
import { typeIcon } from './field-utils'
import { FieldRow } from './FieldRow'
import { ScalarFieldModal } from './ScalarFieldModal'
import { CONTENT_MODEL } from '../../gql/queries'
import {
  FieldSkeleton,
  isListField,
  isScalarField,
  ListField,
  ScalarField,
  UserField,
  isSystemField,
  isUserField,
  SystemModel,
  isAssetField,
  AssetField,
} from '../../types/foxcms.global'
import { DeleteFieldModal } from './DeleteFieldModal'
import { RelationFieldModal } from './relation/RelationFieldModal'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { REORDER_FIELD } from '../../gql/mutations'

interface ModelDetailProps extends RouteComponentProps {
  branchId?: string
  modelId?: string
}

type Action =
  | { type: 'create-scalar-field'; displayType: DisplayType }
  | { type: 'create-relation-field' }
  | { type: 'edit-scalar-field'; field: ScalarField | AssetField | ListField }
  | { type: 'delete-field'; field: UserField; modelId?: string }
  | {
      type: 'close-modal'
      modal: 'CREATE_EDIT_SCALAR' | 'CREATE_EDIT_RELATION' | 'DELETE_FIELD'
    }
  | { type: 'toggle-system-fields' }
type State = {
  scalarFieldForm: {
    isVisible: boolean
    field: ScalarField | ListField | AssetField | FieldSkeleton
  }
  relationFieldForm: {
    isVisible: boolean
  }
  deleteFieldModal: {
    isVisible: boolean
    field?: UserField
  }
  showSystemFields: boolean
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'create-scalar-field':
      return {
        ...state,
        scalarFieldForm: {
          isVisible: true,
          field: { type: action.displayType },
        },
      }
    case 'create-relation-field':
      return {
        ...state,
        relationFieldForm: {
          isVisible: true,
        },
      }
    case 'edit-scalar-field':
      return {
        ...state,
        scalarFieldForm: {
          isVisible: true,
          field: action.field,
        },
      }
    case 'delete-field':
      return {
        ...state,
        deleteFieldModal: {
          isVisible: true,
          field: action.field,
        },
      }
    case 'close-modal':
      return action.modal === 'CREATE_EDIT_SCALAR'
        ? {
            ...state,
            scalarFieldForm: {
              ...state.scalarFieldForm,
              isVisible: false,
            },
          }
        : action.modal === 'CREATE_EDIT_RELATION'
        ? {
            ...state,
            relationFieldForm: {
              ...state.relationFieldForm,
              isVisible: false,
            },
          }
        : {
            ...state,
            deleteFieldModal: {
              ...state.deleteFieldModal,
              isVisible: false,
            },
          }
    case 'toggle-system-fields':
      return { ...state, showSystemFields: !state.showSystemFields }
    default:
      throw new Error()
  }
}

const ModelDetail: React.FC<ModelDetailProps> = ({ branchId, modelId }) => {
  const { data, loading, error } = useQuery<ContentModel>(CONTENT_MODEL, {
    variables: { modelId },
  })

  const [state, dispatch] = useReducer(reducer, {
    scalarFieldForm: {
      isVisible: false,
      field: { type: DisplayType.SINGLE_LINE_TEXT },
    },
    relationFieldForm: {
      isVisible: false,
    },
    deleteFieldModal: {
      isVisible: false,
    },
    showSystemFields: false,
  })
  const [reorderField] = useMutation(REORDER_FIELD)
  if (loading) return null
  if (error) return <span>{error.message}</span>
  return data?.contentModel ? (
    <>
      <ScalarFieldModal
        isOpen={state.scalarFieldForm.isVisible}
        contentModel={data.contentModel}
        field={state.scalarFieldForm.field}
        onClose={() =>
          dispatch({ type: 'close-modal', modal: 'CREATE_EDIT_SCALAR' })
        }
      />
      <RelationFieldModal
        branchId={branchId}
        onClose={() =>
          dispatch({ type: 'close-modal', modal: 'CREATE_EDIT_RELATION' })
        }
        isOpen={state.relationFieldForm.isVisible}
        contentModel={data.contentModel}
      />
      <DeleteFieldModal
        isOpen={state.deleteFieldModal.isVisible}
        modelId={data.contentModel.id}
        field={state.deleteFieldModal.field}
        onClose={() => dispatch({ type: 'close-modal', modal: 'DELETE_FIELD' })}
      />
      <PageHeader
        title={data.contentModel.name}
        subtitle={`#${data.contentModel.apiName}`}
      >
        <Dropdown
          label="Create field"
          icon="chevron-down"
          onSelect={item => {
            if (item.key === 'RELATION') {
              dispatch({
                type: 'create-relation-field',
              })
            } else {
              dispatch({
                type: 'create-scalar-field',
                displayType: item.key as DisplayType,
              })
            }
          }}
          menuItems={[
            {
              key: DisplayType.SINGLE_LINE_TEXT,
              icon: typeIcon(DisplayType.SINGLE_LINE_TEXT),
              label: 'Single line text',
            },
            {
              key: DisplayType.MULTI_LINE_TEXT,
              icon: typeIcon(DisplayType.MULTI_LINE_TEXT),
              label: 'Multi line text',
            },
            {
              key: DisplayType.INTEGER,
              icon: typeIcon(DisplayType.INTEGER),
              label: 'Integer',
            },
            {
              key: DisplayType.FLOAT,
              icon: typeIcon(DisplayType.FLOAT),
              label: 'Float',
            },
            {
              key: DisplayType.CHECKBOX,
              icon: typeIcon(DisplayType.CHECKBOX),
              label: 'Checkbox',
            },
            {
              key: DisplayType.DATE,
              icon: typeIcon(DisplayType.DATE),
              label: 'Date',
            },
            {
              key: SystemModel.ASSET,
              icon: typeIcon(SystemModel.ASSET),
              label: 'Asset',
            },
            {
              key: DisplayType.JSON_EDITOR,
              icon: typeIcon(DisplayType.JSON_EDITOR),
              label: 'JSON',
            },
            {
              key: 'RELATION',
              icon: 'git-merge',
              label: 'Relation',
            },
          ]}
        />
      </PageHeader>
      <Button
        onClick={() => dispatch({ type: 'toggle-system-fields' })}
        hierarchy="tertiary"
        intent="primary"
        className={css`
          color: ${colors.grey700};
          display: flex;
          align-items: center;
          margin-bottom: 1.2rem;
          padding: 0;
          &:focus {
            outline: none;
          }
        `}
      >
        <span>System fields</span>
        <Button.Icon
          name={state.showSystemFields ? 'chevron-up' : 'chevron-down'}
        />
      </Button>
      <div
        className={css`
          max-height: ${state.showSystemFields ? '1000px' : '0px'};
          visibility: ${state.showSystemFields ? 'visible' : 'hidden'};
          opacity: ${state.showSystemFields ? '1' : '0'};
        `}
      >
        {data?.contentModel?.fields
          .filter(f => isSystemField(f))
          .map(field => (
            <FieldRow key={field.apiName} field={field} />
          ))}
      </div>
      <DragDropContext
        onDragEnd={res => {
          if (res.destination?.index) {
            const systemFields = data?.contentModel?.fields.filter(f =>
              isSystemField(f)
            )
            const userFields = data?.contentModel?.fields.filter(f =>
              isUserField(f)
            )

            const reorderedUserFields = Array.from(userFields ?? [])
            const [removed] = reorderedUserFields.splice(
              res.source.index - 1,
              1
            )
            reorderedUserFields.splice(res.destination.index - 1, 0, removed)

            reorderField({
              variables: {
                modelId: data.contentModel?.id,
                from: res.source.index,
                to: res.destination?.index,
              },
              optimisticResponse: {
                __typename: 'Mutation',
                reorderField: {
                  ...data.contentModel,
                  fields: systemFields?.concat(reorderedUserFields),
                },
              },
            })
          }
        }}
      >
        <Droppable droppableId="fields-droppable">
          {provided => (
            <div
              ref={provided.innerRef}
              className={css`
                min-width: 96rem;
              `}
              {...provided.droppableProps}
            >
              {data?.contentModel?.fields
                .filter(f => isUserField(f))
                .map(field => (
                  <Draggable
                    key={field.apiName}
                    draggableId={field.apiName}
                    index={field.position}
                  >
                    {provided => (
                      <FieldRow
                        field={field}
                        onDelete={field => {
                          dispatch({ type: 'delete-field', field, modelId })
                        }}
                        onEdit={field => {
                          if (
                            isListField(field) ||
                            isAssetField(field) ||
                            isScalarField(field)
                          ) {
                            dispatch({ type: 'edit-scalar-field', field })
                          }
                        }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  ) : null
}

export { ModelDetail }
