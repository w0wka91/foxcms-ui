import { navigate, RouteComponentProps } from '@reach/router'
import React, { useReducer } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Button, Card, colors, Icon } from 'react-atomicus'
import { ContentModels } from '../../generated/ContentModels'
import { css } from 'emotion'
import Table from '../../components/Table/Table'
import Dayjs from 'dayjs'
import { CONTENT_MODELS } from '../../gql/queries'
import { ContentModelModal } from './ContentModelModal'

interface ModelOverviewProps extends RouteComponentProps {
  branchId?: string
}

type Action =
  | { type: 'create-content-model' }
  | { type: 'delete-model' }
  | {
      type: 'close-modal'
      modal: 'CREATE_EDIT_MODEL' | 'DELETE_FIELD'
    }
type State = {
  contentModelForm: {
    isVisible: boolean
  }
  deleteModelModal: {
    isVisible: boolean
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'create-content-model':
      return {
        ...state,
        contentModelForm: {
          isVisible: true,
        },
      }
    case 'delete-model':
      return {
        ...state,
        deleteModelModal: {
          isVisible: true,
        },
      }
    case 'close-modal':
      return action.modal === 'CREATE_EDIT_MODEL'
        ? {
            ...state,
            contentModelForm: {
              ...state.contentModelForm,
              isVisible: false,
            },
          }
        : {
            ...state,
            deleteModelModal: {
              ...state.deleteModelModal,
              isVisible: false,
            },
          }
    default:
      throw new Error()
  }
}

const ModelOverview: React.FC<ModelOverviewProps> = ({ branchId }) => {
  const { data, loading, error, networkStatus } = useQuery<ContentModels>(
    CONTENT_MODELS,
    {
      variables: { branchId },
    }
  )
  const [state, dispatch] = useReducer(reducer, {
    contentModelForm: {
      isVisible: false,
    },
    deleteModelModal: {
      isVisible: false,
    },
  })
  console.log('HALLO', data?.contentModels, error, networkStatus, loading)
  if (loading) return null
  return (
    <>
      <ContentModelModal
        branchId={branchId}
        isOpen={state.contentModelForm.isVisible}
        onClose={() =>
          dispatch({ type: 'close-modal', modal: 'CREATE_EDIT_MODEL' })
        }
      />
      <div
        className={css`
          margin-top: 4.8rem;
        `}
      >
        <PageHeader title="Content models">
          <Button onClick={() => dispatch({ type: 'create-content-model' })}>
            <Button.Icon name="plus" />
            <span>Create model</span>
          </Button>
        </PageHeader>

        <Card
          className={css`
            min-width: 96rem;
          `}
        >
          {data && (
            <Table>
              <Table.Header>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Fields</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Last update</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Header>
              <tbody>
                {data.contentModels
                  .filter(model => model.id !== '0')
                  .map(contentModel => (
                    <Table.Row
                      key={contentModel.id}
                      onClick={() => navigate(`./models/${contentModel.id}`)}
                    >
                      <Table.Cell>
                        <span
                          className={css`
                            display: flex;
                            flex-direction: column;
                            font-weight: 600;
                          `}
                        >
                          {contentModel.name}
                          <span
                            className={css`
                              color: ${colors.grey300};
                              font-size: 1.4rem;
                            `}
                          >
                            {contentModel.apiName}
                          </span>
                        </span>
                      </Table.Cell>
                      <Table.Cell>{contentModel.fields.length}</Table.Cell>
                      <Table.Cell
                        className={css`
                          max-width: 25.6em;
                        `}
                      >
                        {contentModel.description}
                      </Table.Cell>
                      <Table.Cell>
                        {Dayjs(contentModel.updatedAt)
                          .locale('en')
                          .format('MMMM DD, hh:mm A')}
                      </Table.Cell>
                      <Table.Cell>
                        <Icon name="corner-up-right" />
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </>
  )
}

export { ModelOverview }
