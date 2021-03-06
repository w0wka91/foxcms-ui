import { css } from 'emotion'
import React, { useMemo, PropsWithChildren } from 'react'
import { Button, Card, colors, Icon } from 'react-atomicus'
import {
  navigate,
  RouteComponentProps,
  Router,
  Link,
  redirectTo,
} from '@reach/router'
import PageHeader from './PageHeader'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Table from './Table/Table'
import { Projects } from '../generated/Projects'
import 'dayjs/locale/en'
import Dayjs from 'dayjs'
import { Project } from '../generated/Project'
import { ModelOverview } from '../pages/model_overview/ModelOverview'
import { ModelDetail } from '../pages/model_detail/ModelDetail'
import { ContentOverview } from '../pages/content_overview/ContentOverview'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ContentDetail } from '../pages/content_detail/ContentDetail'
import { AssetOverview } from '../pages/asset/AssetOverview'
import { ContentModel } from '../generated/ContentModel'
import { CONTENT_MODEL, CONTENT_MODELS } from '../gql/queries'
import { ContentModels } from '../generated/ContentModels'

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
        LOGO
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
        <ProjectPage path=":project/:branch/*" />
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
            <tbody>
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
            </tbody>
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

const PROJECT = gql`
  query Project($generatedName: String!) {
    project(generatedName: $generatedName) {
      id
      name
      generatedName
      branches {
        id
        name
      }
    }
  }
`

let ProjectPage: React.FC<RouteComponentProps<ProjectProps>> = ({
  project,
  branch,
}) => {
  const { data, loading } = useQuery<Project>(PROJECT, {
    variables: { generatedName: project },
  })
  const contentClient = useMemo(() => {
    const cache = new InMemoryCache()
    return new ApolloClient({
      cache,
      link: new HttpLink({
        uri: `${process.env.REACT_APP_PRISMA_SERVER_URL}/${project}/${branch}`,
      }),
    })
  }, [project, branch])
  const branchId = data?.project?.branches.find(b => b.name === branch)?.id
  if (loading) return null
  if (!loading && !branchId) return <h1>Redirect to ...</h1>
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
          <Router>
            <AssetOverview
              path="/assets"
              projectName={project}
              contentClient={contentClient}
            />
            <ModelOverview path="/models" branchId={branchId} />
            <ModelDetail path="/models/:modelId" branchId={branchId} />
            <ContentOverview
              path="/content/:modelId"
              contentClient={contentClient}
            />
            <ContentDetail
              path="/content/:modelId/edit/:contentId"
              contentClient={contentClient}
            />
            <ContentDetail
              path="/content/:modelId/create"
              contentClient={contentClient}
            />
          </Router>
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
        <Menu branchId={branchId} />
      </div>
    </>
  )
}

interface MenuProps {
  branchId?: string
}

const Menu: React.FC<MenuProps> = ({ branchId }) => {
  const { data, loading, error, networkStatus } = useQuery<ContentModels>(
    CONTENT_MODELS,
    {
      variables: { branchId },
    }
  )
  if (loading) return null

  return data ? (
    <nav
      className={css`
        padding-top: 9.6rem;
      `}
    >
      <NavLink
        title="Content models"
        to="models"
        icon="layers"
        sublinks={data.contentModels
          .filter(cm => cm.id !== '0')
          .map(cm => ({ to: cm.id, title: cm.name }))}
      />
      <NavLink
        title="Content"
        to="content"
        icon="columns"
        sublinks={data.contentModels
          .filter(cm => cm.id !== '0')
          .map(cm => ({ to: cm.id, title: cm.name }))}
      />
      <NavLink title="Assets" to="assets" icon="image" />
    </nav>
  ) : null
}

interface Sublink {
  title: string
  to: string
}

interface NavLinkProps {
  title: string
  to: string
  icon?: string
  sublinks?: Sublink[]
}

const NavLink: React.FC<PropsWithChildren<NavLinkProps>> = ({
  title,
  to,
  icon,
  sublinks,
}) => {
  return (
    <div>
      <Link
        to={to}
        getProps={({ isPartiallyCurrent }) => {
          return {
            style: {
              background: isPartiallyCurrent
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
              opacity: isPartiallyCurrent ? '1' : '.4',
            },
          }
        }}
        className={css`
          display: flex;
          padding: 2.4rem 3.2rem;
          align-items: center;
          color: ${colors.grey100};
          font-size: 1.8rem;
          text-decoration: none;
        `}
      >
        {icon && (
          <Icon
            name={icon}
            size="2.4rem"
            className={css`
              margin-right: 1.6rem;
            `}
          />
        )}
        <span>{title}</span>
      </Link>
      <div
        className={css`
          display: flex;
          flex-direction: column;
        `}
      >
        {sublinks?.map(sublink => (
          <Link
            key={to + sublink.to}
            className={css`
              padding: 1.2rem 6.4rem;
              text-decoration: none;
              color: ${colors.grey100};
              display: flex;
              align-items: center;
            `}
            getProps={({ isCurrent }) => {
              return {
                style: {
                  opacity: isCurrent ? '1' : '.4',
                },
              }
            }}
            to={to + '/' + sublink.to}
          >
            <Icon
              name="chevron-right"
              size="1.2rem"
              className={css`
                margin-right: 1.2rem;
              `}
            />
            {sublink.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AuthenticatedApp
