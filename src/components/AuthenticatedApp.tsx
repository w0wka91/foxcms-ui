import { css } from 'emotion'
import React from 'react'
import { colors, Card, Button, Icon } from 'react-atomicus'
import { RouteComponentProps, Router, navigate } from '@reach/router'
import PageHeader from './PageHeader'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Table from './Table/Table'
import { Projects } from '../generated/Projects'
import 'dayjs/locale/en'
import Dayjs from 'dayjs'

Dayjs.locale('en')

const AuthenticatedApp: React.FC<RouteComponentProps> = () => {
  return (
    <div
      className={css`
        border-top: 4px solid ${colors.blue700};
        min-height: 100vh;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
      `}
    >
      <div
        className={css`
          padding: 2.4rem;
          border-bottom: 1px solid ${colors.grey200};
        `}
      >
        Header
      </div>
      <Router
        className={css`
          display: flex;
          flex: 1 1 auto;
          flex-direction: row;
          background: url('https://www.toptal.com/designers/subtlepatterns/patterns/dust_scratches.png');
        `}
      >
        <ProjectList path="/" />
        <Project path=":project/:branch/*" />
      </Router>
    </div>
  )
}

const PROJECTS = gql`
  query Projects {
    projects {
      id
      name
      generatedName
      updatedAt
      branches {
        id
        name
      }
    }
  }
`

let ProjectList: React.FC<RouteComponentProps> = () => {
  const { loading, data } = useQuery<Projects>(PROJECTS)
  if (loading) return null
  return (
    <div
      className={css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      `}
    >
      <div
        className={css`
          margin-top: 4.8rem;
          width: 76.8rem;
        `}
      >
        <PageHeader title="Projects">
          <Button>
            <Button.Icon name="plus" />
            <span>Create project</span>
          </Button>
        </PageHeader>
      </div>
      <Card
        className={css`
          width: 76.8rem;
          margin-top: 4.8rem;
        `}
      >
        {data && (
          <Table>
            <Table.Header>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Branches</Table.HeaderCell>
              <Table.HeaderCell>Last update</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Header>
            {data.projects.map(project => (
              <Table.Row
                key={project.id}
                title="Enter project"
                onClick={() =>
                  navigate(
                    `${project.generatedName}/${project.branches[0].name}`
                  )
                }
              >
                <Table.Cell>{project.name}</Table.Cell>
                <Table.Cell>{project.branches.length}</Table.Cell>
                <Table.Cell>
                  {Dayjs(project.updatedAt)
                    .locale('en')
                    .format('MMMM DD, hh:mm A')}
                </Table.Cell>
                <Table.Cell>
                  <Icon name="corner-up-right" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}

interface ProjectProps {
  project: string
  branch: string
}

let Project: React.FC<RouteComponentProps<ProjectProps>> = ({
  project,
  branch,
}) => {
  if (project == null || branch == null) {
    navigate('/')
  }
  return (
    <>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
        `}
      >
        <main
          className={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1 1 auto;
            padding-bottom: 3.2rem;
          `}
        >
          {project}/{branch}
        </main>
      </div>
      <div
        className={css`
          flex: 0 0 25.6rem;
          order: -1;
          border-right: 1px solid ${colors.grey200};
          background-color: ${colors.blue700};
        `}
      >
        SIDEBAR1
      </div>
    </>
  )
}

export default AuthenticatedApp
