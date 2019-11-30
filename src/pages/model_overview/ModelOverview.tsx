import { RouteComponentProps } from '@reach/router'
import gql from 'graphql-tag'
import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Button, Card, Icon } from 'react-atomicus'
import { ContentModels } from '../../generated/ContentModels'
import { css } from 'emotion'
import Table from '../../components/Table/Table'
import Dayjs from 'dayjs'

const CONTENT_MODELS = gql`
  query ContentModels($branchId: ID!) {
    contentModels(branchId: $branchId) {
      id
      apiName
      name
      description
      updatedAt
      fields {
        name
      }
    }
  }
`

interface ModelOverviewProps extends RouteComponentProps {
  branchId?: string
}

const ModelOverview: React.FC<ModelOverviewProps> = ({ branchId }) => {
  const { data, loading } = useQuery<ContentModels>(CONTENT_MODELS, {
    variables: { branchId },
  })
  if (loading) return null
  return (
    <div
      className={css`
        margin-top: 4.8rem;
      `}
    >
      <PageHeader title="Content models">
        <Button size="large" onClick={() => alert('')}>
          <Button.Icon name="plus" />
          <span>Create model</span>
        </Button>
      </PageHeader>

      <Card
        className={css`
          margin-top: 4.8rem;
        `}
      >
        {data && (
          <Table>
            <Table.Header>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>API</Table.HeaderCell>
              <Table.HeaderCell>Fields</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Last update</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Header>
            <tbody>
              {data.contentModels.map(contentModel => (
                <Table.Row
                  key={contentModel.id}
                  title="Enter project"
                  onClick={() => alert('')}
                >
                  <Table.Cell>{contentModel.name}</Table.Cell>
                  <Table.Cell>{contentModel.apiName}</Table.Cell>
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
  )
}

export { ModelOverview }