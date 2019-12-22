import { RouteComponentProps } from '@reach/router'
import React, { useReducer } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Dropdown } from 'react-atomicus'
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
} from '../../types/foxcms.global'
import { DeleteFieldModal } from './DeleteFieldModal'

interface ModelDetailProps extends RouteComponentProps {
  branchId?: string
  modelId?: string
}

type Action =
  { type: 'create-field', displayType: DisplayType }
  | { type: 'edit-scalar-field', field: ScalarField | ListField }
  | { type: 'delete-field', field: UserField, modelId?: string }
  | { type: 'close-modal', modal: 'CREATE_EDIT' | 'DELETE_FIELD' }
type State = {
  scalarFieldForm: {
    isVisible: boolean,
    field: ScalarField | ListField | FieldSkeleton,
  }
  deleteFieldModal: {
    isVisible: boolean,
    field?: UserField
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'create-field':
      return {
        ...state,
        scalarFieldForm: {
          isVisible: true,
          field: { type: action.displayType },
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
      return action.modal === 'CREATE_EDIT' ? {
        ...state,
        scalarFieldForm: {
          ...state.scalarFieldForm,
          isVisible: false,
        },
      } : {
        ...state,
        deleteFieldModal: {
          ...state.deleteFieldModal,
          isVisible: false,
        },
      }
    default:
      throw new Error()
  }
}

const ModelDetail: React.FC<ModelDetailProps> = ({ branchId, modelId }) => {
  const { data, loading } = useQuery<ContentModel>(CONTENT_MODEL, {
    variables: { modelId },
  })

  const [state, dispatch] = useReducer(reducer, {
    scalarFieldForm: {
      isVisible: false,
      field: { type: DisplayType.SINGLE_LINE_TEXT },
    },
    deleteFieldModal: {
      isVisible: false,
    },
  })
  if (loading) return null

  return data?.contentModel ? (
    <>
      <ScalarFieldModal
        isOpen={state.scalarFieldForm.isVisible}
        contentModel={data.contentModel}
        field={state.scalarFieldForm.field}
        onClose={() => dispatch({ type: 'close-modal', modal: 'CREATE_EDIT' })}
      />
      <DeleteFieldModal
        isOpen={state.deleteFieldModal.isVisible}
        modelId={data.contentModel.id}
        field={state.deleteFieldModal.field}
        onClose={() => dispatch({ type: 'close-modal', modal: 'DELETE_FIELD' })}
      />
      <div
        className={css`
            margin-top: 4.8rem;
          `}
      >
        <PageHeader title={data.contentModel.name}>
          <Dropdown
            label="Create field"
            icon="chevron-down"
            onSelect={item =>
              dispatch({ type: 'create-field', displayType: item.key as DisplayType })
            }
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
                key: DisplayType.JSON_EDITOR,
                icon: typeIcon(DisplayType.JSON_EDITOR),
                label: 'JSON',
              },
            ]}
          />
        </PageHeader>
        {data.contentModel.fields.map(field => (
          <FieldRow
            key={field.apiName}
            field={field}
            onDelete={field => {
              dispatch({ type: 'delete-field', field, modelId })
            }}
            onEdit={field => {
              if (isListField(field) || isScalarField(field)) {
                dispatch({ type: 'edit-scalar-field', field })
              }
            }}/>
        ))}
      </div>
    </>
  ) : null
}

export { ModelDetail }
