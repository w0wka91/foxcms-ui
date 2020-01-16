import { RouteComponentProps, navigate } from '@reach/router'
import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Button, Card } from 'react-atomicus'
import { css } from 'emotion'
import Table from '../../components/Table/Table'
import { CONTENT_MODEL } from '../../gql/queries'
import { ContentModel } from '../../generated/ContentModel'
import { generateQuery } from '../../gql/utils'
import pluralize from 'pluralize'

interface ContentOverviewProps extends RouteComponentProps {
  modelId?: string
  contentClient: any
}

const ContentOverview: React.FC<ContentOverviewProps> = ({
  modelId,
  contentClient,
}) => {
  const { data: modelData, loading } = useQuery<ContentModel>(CONTENT_MODEL, {
    variables: { modelId },
  })
  const { data: contentData } = useQuery(
    generateQuery(modelData?.contentModel),
    { client: contentClient }
  )
  if (loading) return null
  return modelData?.contentModel ? (
    <>
      <div
        className={css`
          margin-top: 4.8rem;
        `}
      >
        <PageHeader
          title={modelData.contentModel.name}
          subtitle={`#${modelData.contentModel.apiName}`}
        >
          <Button>
            <Button.Icon name="plus" />
            <span>Create {modelData.contentModel.name}</span>
          </Button>
        </PageHeader>

        <Card
          className={css`
            min-width: 96rem;
          `}
        >
          <Table>
            <Table.Header>
              <Table.HeaderCell>Id</Table.HeaderCell>
            </Table.Header>
            <tbody>
              {contentData &&
                contentData[
                  pluralize(modelData.contentModel.apiName).toLowerCase()
                ].map((entry: any) => (
                  <Table.Row
                    key={entry.id}
                    onClick={() => navigate(`./${modelId}/edit/${entry.id}`)}
                  >
                    <Table.Cell>{entry.id}</Table.Cell>
                  </Table.Row>
                ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </>
  ) : null
}

export { ContentOverview }
